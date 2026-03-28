# Digital Heroes 🏌️‍♂️

A premium full-stack platform transforming charity golf subscriptions with a sleek, high-end user interface. Built to handle secure subscriptions, automated monthly draws, and robust admin workflows. 

**Live Demo:** [Digital Heroes Platform](https://golf-charity-subscription-platform-sand.vercel.app/)

## ✨ Key Features

- **Premium UI/UX:** High-performance responsive design built with a strict 8pt grid, WCAG 2.1 compliance, and hardware-accelerated Framer Motion interactions.
- **Optimistic rendering:** Instantaneous data mutations with immediate UI feedback and subtle fallback skeleton screens.
- **Tiered Subscriptions:** Distinct roles (Visitor, Subscriber, and Admin) and simulated real-time payment flows.
- **Golf Draw Engine:** Dedicated algorithms to configure, simulate, and securely publish automated monthly lucky draw results based on user stableford points.
- **Admin Command Center:** Powerful debounced search interfaces and verification workflows for payouts.

## 🛠️ Technology Stack

- **Frontend:** React, Vite, Tailwind CSS (v4), Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)

## 🚀 Getting Started

To run this project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abhay030/Golf-Charity-Subscription-Platform.git
   cd Golf-Charity-Subscription-Platform
   ```

2. **Install dependencies:**
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. **Run the Development Servers:**
   ```bash
   # Terminal 1: Start Backend (from /server)
   npm run dev

   # Terminal 2: Start Frontend (from /client)
   npm run dev
   ```

## 🔒 Security & Performance
- JWT-based HttpOnly Authentication
- Global Error & Suspense boundary integrations
- React.lazy dynamic imported code-splitting (Dashboard & Admin)
