# 🚚 Logistics & Transport Management System (SaaS)

## 📝 Overview
In the traditional logistics sector, matching loads with available trucks is often a manual, fragmented process involving multiple middlemen. This **Multi-Tenant SaaS** platform digitizes the entire workflow—from load posting and truck availability to smart matching, digital Bilty generation, and GST invoicing.

It provides a centralized ecosystem for Logistics Companies (Tenants) to manage their customers and drivers with complete data isolation.

## 🌟 Key Features

- **Multi-Tenant Architecture**: Complete data isolation between different logistics companies (tenants).
- **Role-Based Access Control (RBAC)**: Dedicated dashboards for **Admins**, **Drivers** (Truck Owners), and **Customers** (Load Owners).
- **Smart Matching**: Algorithm to match available trucks with loads based on capacity and vehicle type.
- **Secure Authentication**: JWT-based auth with Access/Refresh token rotation and OTP verification via Twilio & Redis.
- **Password Recovery**: OTP-based forgot password flow for secure account recovery.
- **Digital Documentation**: Automated generation of 4-copy Bilty and GST Invoices in PDF format.
- **Real-time Status Tracking**: Workflow management from 'Assigned' to 'In-Transit' and 'Delivered'.

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- React Router (Routing)
- Axios (API Calls with Interceptors)
- CSS-in-JS (Modern, responsive UI)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database & Modeling)
- Redis (OTP Storage & Rate Limiting)
- Twilio (SMS Gateway)
- PDFKit (Document Generation)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- Redis Server (Running on port 6379)
- Twilio Account (for SMS features)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bonubhavana04/Fleetiva-Roadlines.git
   cd Fleetiva-Roadlines
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   npm run dev
   ```

### Quick Start (Development)

```bash
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev
```

Backend runs on `http://localhost:5000`  
Frontend runs on `http://localhost:5173`

---

## 🏗️ Project Structure

```text
├── .github/
│   ├── ISSUE_TEMPLATE/ # Bug & Feature templates
│   └── workflows/      # CI/CD Pipeline (GitHub Actions)
├── CONTRIBUTING.md     # Open-source contribution guidelines
├── backend/
│   ├── config/         # Service clients (Redis, Twilio)
│   ├── middleware/     # Auth, Role, and Tenant scoping
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # Modular API endpoints
│   ├── utils/          # PDF Generation logic
│   └── server.js       # Entry point
└── frontend/
    ├── src/
    │   ├── api/        # Axios configuration
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # Role-specific dashboards and forms
    │   └── App.jsx     # Routing and Layout logic
```

## 📝 API Documentation (Brief)

| Method | Endpoint | Description   |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Register new user/tenant & send OTP |
| POST | `/api/auth/verify-otp` | Verify OTP and create account |
| POST | `/api/auth/forgot-password` | Request password reset OTP |
| POST | `/api/auth/reset-password` | Reset password using OTP |
| GET | `/api/match/:loadId` | Find matching trucks for a load (Admin only) |
| GET | `/api/booking/:id/bilty` | Generate and download Bilty PDF |

## 🤖 CI/CD

This project includes a **GitHub Actions** workflow for Continuous Integration. The pipeline automatically:
- Performs security audits on backend dependencies.
- Lints the codebase for consistency.
- Verifies frontend builds.

##  Contributing

Contributions are welcome! Please read our CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License.