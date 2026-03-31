import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.listingId === action.payload.listingId);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.listingId === action.payload.listingId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.listingId !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.listingId === action.payload.listingId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || []
      };

    default:
      return state;
  };

};

const initialState = {
  items: []
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (listing, quantity = 1) => {
    const cartItem = {
      listingId: listing._id,
      title: listing.title,
      price: listing.pricing.totalDiscountedPrice,
      originalPrice: listing.pricing.totalOriginalPrice,
      image: listing.images[0]?.url,
      vendor: listing.vendor.businessName,
      category: listing.category,
      urgency: listing.urgency,
      quantity
    };

    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    toast.success(`${listing.title} added to cart!`);
  };

  const removeFromCart = (listingId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: listingId });
    toast.success('Item removed from cart');
  };

  const updateQuantity = (listingId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(listingId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { listingId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartSavings = () => {
    return state.items.reduce((total, item) => {
      const itemSavings = (item.originalPrice - item.price) * item.quantity;
      return total + itemSavings;
    }, 0);
  };

  const getCartCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const getServiceFee = () => {
    return Math.round(getCartTotal() * 0.05 * 100) / 100;
  };

  const getTax = () => {
    return Math.round((getCartTotal() + getServiceFee()) * 0.08 * 100) / 100;
  };

  const getFinalTotal = () => {
    return getCartTotal() + getServiceFee() + getTax();
  };

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartSavings,
    getCartCount,
    getServiceFee,
    getTax,
    getFinalTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
