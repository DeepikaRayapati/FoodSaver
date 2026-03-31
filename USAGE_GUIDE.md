# FoodSaver Platform - Usage Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally or connection string)
- npm or yarn

### Installation & Setup

1. **Navigate to project directory**
   ```bash
   cd "Food Project"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your MongoDB connection
   npm run dev
   ```

3. **Frontend Setup** (in separate terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Seed Sample Data**
   ```bash
   cd backend
   node utils/seeder.js
   ```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📱 User Accounts & Roles

### Sample Login Credentials

**Admin Account:**
- Email: admin@foodsaver.com
- Password: admin123
- Role: Admin

**Vendor Account:**
- Email: green@foodsaver.com
- Password: vendor123
- Role: Vendor (Fresh Market)

**Vendor Account 2:**
- Email: bakery@foodsaver.com
- Password: vendor123
- Role: Vendor (Sweet Bakery)

**Consumer Accounts:**
- Email: john@foodsaver.com
- Password: consumer123
- Role: Consumer

- Email: jane@foodsaver.com
- Password: consumer123
- Role: Consumer

## 🎯 Platform Features

### 1. **Landing Page** (http://localhost:3000)
- Mission statement and impact statistics
- Call-to-action for registration
- Feature overview
- Testimonials

### 2. **Marketplace** (http://localhost:3000/marketplace)
- Browse available food listings
- Filter by category, urgency, and search
- View food details and pricing
- Favorite listings
- Real-time availability updates

### 3. **Authentication**
- User registration with role selection
- Secure login system
- Password reset functionality
- Profile management

### 4. **Dashboards**

**Consumer Dashboard:**
- Order history and status
- Savings analytics
- Favorite categories
- Impact tracking

**Vendor Dashboard:**
- Listing management
- Order processing
- Revenue analytics
- Performance metrics

**Admin Dashboard:**
- Platform overview
- User management
- System analytics
- Environmental impact metrics

### 5. **Analytics** (http://localhost:3000/analytics)
- AI-powered insights
- Waste risk analysis
- Environmental impact tracking
- Demand predictions
- Category performance

### 6. **About Page** (http://localhost:3000/about)
- Mission and values
- Food safety compliance
- Team information
- Contact details

## 🔧 Technical Features

### Backend (Node.js + Express)
- RESTful API architecture
- MongoDB with Mongoose ODM
- JWT authentication
- Role-based access control
- Real-time notifications (Socket.io)
- File upload functionality
- Rate limiting and security
- AI-powered predictions (mock)

### Frontend (React + Tailwind CSS)
- Responsive design
- Component-based architecture
- Context API for state management
- Real-time updates
- Modern UI/UX
- Mobile-first approach

### Database Schema
- **Users**: Authentication and profile data
- **Listings**: Food items with pricing and availability
- **Orders**: Purchase transactions and tracking
- **Analytics**: Performance metrics and insights

## 🌟 Key Features Demonstrated

### ✅ Core Functionality
- [x] User registration and login
- [x] Role-based access (Admin, Vendor, Consumer)
- [x] Food listing creation and management
- [x] Order processing and tracking
- [x] Real-time notifications

### ✅ Advanced Features
- [x] AI-powered expiration predictions
- [x] Environmental impact tracking
- [x] Food safety compliance (HACCP/ISO 22000)
- [x] File upload for food images
- [x] Search and filtering
- [x] Analytics dashboard

### ✅ UI/UX Excellence
- [x] Modern, responsive design
- [x] Eco-friendly color scheme
- [x] Intuitive navigation
- [x] Mobile optimization
- [x] Loading states and error handling

## 📊 Sample Data

The seeder creates:
- 1 Admin user
- 2 Vendor accounts (Grocery & Bakery)
- 2 Consumer accounts
- Sample food listings
- Mock order data

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers

## 🚀 Deployment Notes

For production deployment:
1. Update environment variables in `.env`
2. Configure production database
3. Set up proper CORS origins
4. Implement proper file storage (AWS S3)
5. Add SSL certificates
6. Configure proper logging

## 🤝 Contributing

This is a demonstration platform showcasing:
- Full-stack development
- Modern web technologies
- Sustainable business concept
- Clean, scalable architecture

## 📞 Support

For any issues or questions:
1. Check the console logs for errors
2. Verify MongoDB connection
3. Ensure all dependencies are installed
4. Check port availability (3000, 5000)

---

**Built with ❤️ for a sustainable future**
