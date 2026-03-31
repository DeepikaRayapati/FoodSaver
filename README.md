# FoodSaver - Food Waste Reduction Platform

A modern, responsive web application that connects restaurants, grocery stores, and consumers to reduce food waste through discounted sales and donations.

## 🎯 Core Features

- **Cloud-based marketplace** for surplus/near-expiry food items
- **Multi-role system**: Admin, Vendor (restaurants/grocery stores), Consumer
- **AI-powered features**: Expiration prediction, automated alerts, analytics
- **Real-time notifications** for deals and urgent listings
- **Secure authentication** with role-based access
- **Logistics management**: Pickup and delivery options
- **Food safety compliance** (HACCP & ISO 22000 standards)

## 🛠️ Tech Stack

- **Frontend**: React + Tailwind CSS + Lucide Icons
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.io
- **AI Features**: Mock AI logic for expiration prediction

## 📁 Project Structure

```
Food Project/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── styles/
│   └── public/
├── backend/           # Node.js API
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   └── utils/
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation

1. **Clone and setup**
   ```bash
   cd "Food Project"
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment setup**
   - Create `.env` file in backend directory
   - Add MongoDB connection string and JWT secret

5. **Start the application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

## 🌐 Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 Pages & Features

1. **Landing Page** - Mission, impact stats, call-to-action
2. **Marketplace** - Browse food listings with filters
3. **Vendor Dashboard** - Manage listings for restaurants/stores
4. **Consumer Dashboard** - View purchases and donations
5. **Admin Panel** - Platform management and analytics
6. **Analytics Page** - AI insights and waste reduction metrics
7. **Compliance Page** - Food safety guidelines and standards

## 🔐 User Roles

- **Consumer**: Browse, purchase, and claim food items
- **Vendor**: List surplus food, manage inventory
- **Admin**: Oversee platform, manage users, view analytics

## 🤝 Contributing

This project aims to reduce food waste and promote sustainability. Contributions are welcome!

## 📄 License

MIT License - see LICENSE file for details
