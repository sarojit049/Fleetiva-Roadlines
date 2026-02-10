# 🚚 Fleetiva Roadlines — Logistics & Transport SaaS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Backend: Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://render.com)
[![Frontend: Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel)](https://vercel.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://www.mongodb.com)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://reactjs.org)

---

## 📋 Overview
Fleetiva Roadlines is a production-ready logistics platform for load posting, truck assignment, booking management, and Bilty (LR) generation. It supports role-based access for **Customers**, **Drivers**, and **Admins**, with real-time shipment status updates and printable documentation.

---

## ✨ Key Features
- **Role-Based Access Control (RBAC)** for customers, drivers, and admins.
- **JWT Authentication** with secure password hashing (bcrypt).
- **Load Posting & Matching** to assign available trucks.
- **Booking Management** with shipment status workflow.
- **Real Bilty (LR) Generation** stored in MongoDB and printable as PDF.
- **Payment Tracking** with balance calculations and status updates.
- **OTP Password Recovery** via Redis + Twilio.
- **Centralized Error Handling** and audit logs.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|----------|
| **Frontend** | React + Vite | Fast, modern UI framework |
| | Axios | HTTP client with interceptors |
| | React Router | Role-based routing |
| | CSS Modules | Component-scoped styling |
| **Backend** | Node.js + Express | RESTful API server |
| | MongoDB + Mongoose | NoSQL database & ODM |
| | JWT + bcrypt | Authentication & password hashing |
| | PDFKit | Bilty/Invoice PDF generation |
| **Infrastructure** | Render | Backend hosting |
| | Vercel | Frontend hosting |
| | Redis | OTP caching |
| | Twilio | SMS notifications |

---

## 📁 Project Structure
```text
backend/
  config/
  middleware/
  models/
  routes/
  utils/
frontend/
  src/
    api/
    components/
    context/
    pages/
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
- `MONGO_URI` — MongoDB Atlas connection string
- `ACCESS_TOKEN_SECRET` — JWT secret
- `ACCESS_TOKEN_TTL` — JWT TTL (e.g., `7d`)
- `FRONTEND_URL` — production frontend URL
- `FRONTEND_PREVIEW_URL` — preview URL (optional)
- `CORS_ORIGINS` — comma-separated CORS allowlist
- `VERCEL_PREVIEW_SUFFIX` — e.g., `.vercel.app`
- `FREIGHT_RATE_PER_TON` — base freight rate
- `OTP_TTL_SECONDS` — OTP expiration (default 600)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — Twilio SMS
- `REDIS_URL` — Redis connection string
- `SKIP_MONGO` — set `true` to skip DB (not for production)
- `SKIP_FIREBASE` — set `true` if not using Firebase

### Frontend (`frontend/.env`)
- `VITE_API_BASE_URL` — backend API base (e.g., `https://your-backend.onrender.com/api`)
- `VITE_RENDER_SERVICE_NAME` — Render service name for preview URLs
- `VITE_RENDER_SERVICE_URL` — Render base URL
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`

---

## 📦 Prerequisites

Before running this project locally, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB instance)
- **Git** installed
- **Redis** (optional, for OTP functionality)
- **Twilio** account (optional, for SMS)

---

## 🚀 Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## 🌐 Deployment

### Backend (Render)
1. Create a new **Web Service** on Render.
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables from `backend/.env.example`.
5. Ensure MongoDB Atlas IP allowlist includes Render.

### Frontend (Vercel)
1. Import the `frontend/` project into Vercel.
2. Set `VITE_API_BASE_URL` to the Render backend URL + `/api`.
3. Deploy.

### 🔥 Firebase Authorized Domains
To enable Google/Firebase authentication:
1. Go to **Firebase Console → Authentication → Settings → Authorized domains**
2. Add your deployed Vercel URL (e.g., `your-app.vercel.app`)
3. Add any custom domains you're using

---

## 🔌 API Highlights

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | User login |
| `GET` | `/api/auth/me` | Authenticated | Get current user |
| `POST` | `/api/load/post` | Customer | Post new load |
| `GET` | `/api/load/available` | Admin | View available loads |
| `POST` | `/api/truck/post` | Driver | Post truck availability |
| `GET` | `/api/match/:loadId` | Admin | Match trucks to load |
| `POST` | `/api/booking/create` | Admin | Create booking + Bilty |
| `GET` | `/api/booking/all` | Admin | View all bookings |
| `GET` | `/api/booking/customer/bookings` | Customer | View own bookings |
| `GET` | `/api/booking/driver/bookings` | Driver | View assigned bookings |
| `PATCH` | `/api/booking/:id/status` | Driver | Update shipment status |
| `GET` | `/api/booking/:id/bilty` | Authenticated | Download Bilty PDF |
| `GET` | `/api/booking/:id/invoice` | Authenticated | Download Invoice PDF |

---

## 🔒 Security Notes
- Secrets are stored in `.env` only.
- Passwords are hashed with bcrypt.
- JWTs are validated on every protected route.
- CORS and HTTP-only cookies are supported.

---

## 🤝 Contributing

We welcome contributions! Follow these steps to contribute:

### Git Workflow

1. **Fork the repository**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Fleetiva-Roadlines.git
   cd Fleetiva-Roadlines
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes and commit**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch and submit

### Contribution Guidelines
- Follow existing code style and conventions
- Write clear commit messages (use conventional commits)
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

If you have questions or need help:
- 📧 Open an issue on GitHub
- 💡 Check existing issues and discussions
- 🌟 Star this repo if you find it helpful!

---

<div align="center">

### ⭐ Star us on GitHub — it motivates us a lot!

**Made with ❤️ by the Fleetiva Team**

[⬆ Back to Top](#-fleetiva-roadlines--logistics--transport-saas)

</div>
