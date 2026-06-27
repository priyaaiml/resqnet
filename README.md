<div align="center">

<img src="https://img.shields.io/badge/ResQNet-Community%20Disaster%20Response-FF6B35?style=for-the-badge&logoColor=white" />

# 🛡️ ResQNet
## Community-Based Disaster Management System

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=flat-square&logo=socket.io)](https://socket.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Images-3448C5?style=flat-square&logo=cloudinary)](https://cloudinary.com/)

**Internship Project — SkyForger Technologies**

> *Community-powered disaster response, built for the moments that matter.*

🔗 **GitHub:** https://github.com/priyaaiml/resqnet

</div>

---

## 📌 Problem Statement

Natural and man-made disasters affect millions of people every year. The biggest challenge during emergencies is **lack of coordination** between citizens, volunteers and authorities. ResQNet solves this by providing a unified platform for disaster reporting, volunteer coordination and real-time response tracking.

---

## 💡 Solution

ResQNet is a full-stack web application that enables:
- Citizens to **report disasters** instantly with location and images
- Volunteers to **respond and coordinate** effectively
- Admins to **manage and track** all incidents in real-time
- Communities to **stay informed** through live updates

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite | Fast, modern UI |
| Backend | Node.js + Express | RESTful API |
| Database | MongoDB Atlas | Cloud database |
| Auth | JWT + bcryptjs | Secure authentication |
| Real-time | Socket.io | Live updates |
| Images | Cloudinary | Image storage CDN |
| Maps | Leaflet.js | Interactive maps |
| Charts | Recharts | Analytics visualization |
| Deployment | Vercel + Render | Cloud hosting |

---

## ✨ Key Features

### 🚨 Disaster Management
- Report disasters with title, description, location, images, type and severity
- Live disaster feed with search and filter by status, severity and type
- Incident status tracking — Reported → In Progress → Resolved
- Activity timeline for every incident
- Interactive map showing all disaster locations

### 👥 User Roles
| Feature | Citizen | Volunteer | Admin |
|---------|---------|-----------|-------|
| View disaster feed | ✅ | ✅ | ✅ |
| Report disaster | ✅ | ✅ | ✅ |
| Update status | ❌ | ✅ | ✅ |
| Volunteer dashboard | ❌ | ✅ | ✅ |
| Admin dashboard | ❌ | ❌ | ✅ |
| Analytics | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

### 📊 Admin Dashboard
- Real-time statistics — total users, volunteers, disasters
- Disaster breakdown by type and severity
- User management with role assignment
- Volunteer assignment to incidents
- Recent activity overview

### 📈 Analytics
- Monthly disaster trend line chart
- Disaster distribution by type bar chart
- Severity distribution pie chart
- Key performance metrics

### 🦺 Volunteer System
- Volunteer registration with skills selection
- Availability status — Available, Busy, Offline
- Assigned disaster tracking
- Mission completion tracking
- Skill-based profile

### ⚡ Real-Time Features
- Socket.io powered live notifications
- Emergency alert banners
- Live incident count updates
- Real-time status changes

---

## 🏗️ System Architecture
---

## 📁 Project Structure

## 📡 API Endpoints

### Authentication
### Disasters
### Volunteers
### Admin
---

## 🔐 Security

- JWT authentication with 30 day expiry
- Password hashing with bcryptjs (10 salt rounds)
- Role-based middleware protecting all routes
- CORS configured for production domains
- Environment variables for all sensitive data
- Input validation on all API endpoints

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)

### Quick Start

```bash
# Clone repository
git clone https://github.com/priyaaiml/resqnet.git
cd resqnet

# Setup backend
cd server
npm install
# Create .env file with your credentials
npx nodemon server.js

# Setup frontend (new terminal)
cd client
npm install
npm run dev
```

### Environment Variables

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/resqnet
JWT_SECRET=your_super_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

---

## 🌐 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | Coming soon |
| Backend | Render | Coming soon |
| Database | MongoDB Atlas | Cloud hosted |
| Images | Cloudinary | Cloud hosted |

---

## 👩‍💻 Developer

**Priya** — Full Stack Developer
- GitHub: [@priyaaiml](https://github.com/priyaaiml)
- Internship: SkyForger Technologies

---

## 🏆 Built For

SkyForger Technologies Internship Program
Community-Based Disaster Management System Project

---

<div align="center">

**⭐ If you find this helpful, please star the repository!**

Built with ❤️ by Priyamani | SkyForger Technologies Internship 2026

</div>
