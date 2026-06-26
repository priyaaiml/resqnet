<div align="center">

# 🛡️ ResQNet
### Community-Powered Disaster Response System

![ResQNet Banner](https://img.shields.io/badge/ResQNet-Community%20Disaster%20Response-FF6B35?style=for-the-badge&logo=shield&logoColor=white)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?style=flat-square&logo=socket.io)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

> *Community-powered disaster response, built for the moments that matter.*

[🚀 Live Demo](#) • [📸 Screenshots](#screenshots) • [⚙️ Setup](#setup) • [📡 API Docs](#api)

</div>

---

## 🌟 Overview

ResQNet is a full-stack community-based disaster management system that enables citizens to report disasters, coordinates volunteer response, and provides real-time updates to keep communities safe during emergencies.

Built as a competition-level MERN stack project with production-grade architecture, real-time capabilities, and a premium UI designed to impress.

---

## ✨ Features

### 🚨 Core Features
- **Disaster Reporting** — Report incidents with title, description, location, images, severity and type
- **Live Disaster Feed** — Browse and filter all reported disasters in real-time
- **Incident Tracking** — Track status from Reported → In Progress → Resolved
- **Interactive Map** — Visualize disaster locations on a live map
- **Image Upload** — Upload disaster photos via Cloudinary CDN

### 👥 Role-Based Access
| Feature | Citizen | Volunteer | Admin |
|---------|---------|-----------|-------|
| View Feed | ✅ | ✅ | ✅ |
| Report Disaster | ✅ | ✅ | ✅ |
| Update Status | ❌ | ✅ | ✅ |
| Volunteer Dashboard | ❌ | ✅ | ✅ |
| Admin Dashboard | ❌ | ❌ | ✅ |
| Analytics | ❌ | ❌ | ✅ |

### ⚡ Advanced Features
- **Real-Time Updates** — Socket.io powered live notifications
- **Analytics Dashboard** — Charts and insights using Recharts
- **Emergency Alert Banners** — Live severity indicators
- **Volunteer Assignment** — Smart volunteer management workflow
- **Activity Timeline** — Complete audit trail for each incident
- **JWT Authentication** — Secure role-based access control

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + Vite — Fast, modern UI framework
- **React Router v6** — Client-side routing
- **Recharts** — Beautiful analytics charts
- **Leaflet.js** — Interactive disaster maps
- **Socket.io Client** — Real-time updates
- **Framer Motion** — Smooth animations
- **Axios** — API communication

### Backend
- **Node.js** + **Express.js** — RESTful API server
- **MongoDB** + **Mongoose** — Database and ODM
- **Socket.io** — Real-time bidirectional communication
- **JWT** — Secure authentication
- **Cloudinary** — Image storage and CDN
- **Multer** — File upload handling
- **bcryptjs** — Password hashing

---

## 📸 Screenshots

### 🏠 Landing Page
> Premium dark UI with glassmorphism effects, floating cards and live emergency alerts

### 📊 Admin Dashboard
> Complete oversight with user management, disaster tracking and analytics

### 🗺️ Live Feed
> Real-time disaster feed with advanced filtering and search

### 📈 Analytics
> Data-driven insights with interactive charts and statistics

---

## ⚙️ Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/priyaaiml/resqnet.git
cd resqnet
```

**2. Install backend dependencies:**
```bash
cd server
npm install
```

**3. Install frontend dependencies:**
```bash
cd ../client
npm install
```

**4. Configure environment variables:**
```bash
cd ../server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

**5. Run the application:**

Backend:
```bash
cd server
npx nodemon server.js
```

Frontend:
```bash
cd client
npm run dev
```

**6. Open in browser:**
---

## 📡 API Documentation

### Auth Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/profile` | Get user profile | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |

### Disaster Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/disasters` | Get all disasters | ❌ |
| POST | `/api/disasters` | Report disaster | ✅ |
| GET | `/api/disasters/:id` | Get disaster detail | ❌ |
| PUT | `/api/disasters/:id/status` | Update status | Volunteer+ |
| DELETE | `/api/disasters/:id` | Delete disaster | Admin |

### Volunteer Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/volunteers/register` | Register as volunteer | ✅ |
| GET | `/api/volunteers` | Get all volunteers | ✅ |
| GET | `/api/volunteers/me` | Get my profile | Volunteer |
| PUT | `/api/volunteers/availability` | Update availability | Volunteer |

### Admin Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/stats` | Dashboard statistics | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| PUT | `/api/admin/users/:id/role` | Update user role | Admin |
| POST | `/api/admin/disasters/:id/assign` | Assign volunteer | Admin |

---

## 📁 Project Structure
---

## 🔐 Security Features

- JWT token authentication with 30-day expiry
- Password hashing with bcryptjs (salt rounds: 10)
- Role-based access control middleware
- CORS configuration for production
- Environment variables for all secrets
- Input validation on all endpoints

---

## 🚀 Deployment

### Backend — Render
1. Connect GitHub repo to Render
2. Set build command: `npm install`
3. Set start command: `node server.js`
4. Add all environment variables

### Frontend — Vercel
1. Connect GitHub repo to Vercel
2. Set root directory to `client`
3. Build command: `npm run build`
4. Update API URL to production backend

---

## 👩‍💻 Developer

**Priya** — Full Stack Developer

Built with ❤️ for the community.

---

## 📄 License

MIT License — feel free to use this project as inspiration.

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with 🛡️ by ResQNet Team

</div>