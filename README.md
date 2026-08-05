# 🏠 Rent Here — Fullstack Real Estate & PG Rental Platform

> **Find. Connect. Move In.**  
> A production-grade MERN stack web application for discovering verified PG accommodations for boys, 1BHK, and 2BHK rental properties with direct landlord connection, automated admin listing approval pipeline, and simulated ad boosting.

---

## 🌟 Key Features

### 🛡️ 1. 3-Tier User Role System
- **Super Admin**: Dedicated pending approval queue, single-click listing verification/rejection with reason input, platform metrics overview, and user account management.
- **Seller (Property Owner/Landlord)**: Property listing creator (with photo uploads), listing status tracking (`Pending Admin Review`, `Live / Approved`, `Rejected with Reason`), 7/30-day ad boosting, and buyer lead manager.
- **Buyer (Tenant/Seeker)**: Public marketplace search feed, multi-criteria filtering, wishlist bookmarking, direct seller phone/email reveal, and inquiry messaging.

### ⚡ 2. Property Approval Pipeline
- New property listings automatically default to `status: "pending"` in MongoDB.
- Pending listings are isolated from public search feeds until approved by Super Admin.

### 🚀 3. Ad Boosting Engine
- Sellers can activate simulated 7-Day or 30-Day boost subscriptions.
- Boosted listings are assigned `isBoosted: true` and sorted at the top of search queries using composite MongoDB sorting (`{ isBoosted: -1, createdAt: -1 }`).

### 🎨 4. Custom Whitish Design System
- Built with Vanilla CSS, featuring glassmorphism header navigation, soft shadow elevations, loading skeletons, custom empty states, and toast notifications.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router DOM v6, Axios, Lucide Icons, React Hot Toast, Vanilla CSS
- **Backend**: Node.js, Express.js (MVC Pattern), JWT Authentication, bcryptjs, Multer
- **Database**: MongoDB & Mongoose ORM (with in-memory fallback support)

---

## 📂 Project Architecture

```
d:\RENT HERE\
├── client/                     # React Vite Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI components & individual CSS files
│   │   ├── context/            # AuthContext for global user state & wishlist
│   │   ├── pages/              # Home, SellerDashboard, AdminDashboard, BuyerDashboard
│   │   ├── App.jsx             # Main Application & Router
│   │   └── main.jsx            # React DOM Entry
│   └── index.html              # HTML Entry & Favicon
└── server/                     # Node.js Express Backend API
    ├── config/                 # MongoDB Connection Config
    ├── controllers/            # Auth, Property, Inquiry, Admin Controllers
    ├── middleware/             # JWT Protect, Role Authorize, Error Middleware
    ├── models/                 # User, Property, Inquiry Mongoose Schemas
    ├── routes/                 # Express API Endpoint Routes
    └── server.js               # Express Server Entry Point
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
```

### 2. Environment Setup
Create a `.env` file in the root directory (or `server/` directory):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/renthere
JWT_SECRET=your_jwt_secret_key
```

### 3. Run Backend Server
```bash
cd server
npm install
node server.js
```
*Backend runs on `http://localhost:5000`*

### 4. Run Frontend App
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 📄 License
This project is licensed under the MIT License.
