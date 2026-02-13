# 🔐 Forgot Password Setup Guide

This project uses **Nodemailer** to send password reset OTPs via email. By default, it is configured to use **Gmail SMTP**.

## 🚀 Quick Start (Testing Mode)

If you just want to test without successful email delivery, the system automatically falls back to **Ethereal Email** (a fake SMTP service) when no valid credentials are provided.

1. **Clear** or **Comment out** `SMTP_USER` and `SMTP_PASS` in `backend/.env`.
2. Request a password reset on the frontend (`http://localhost:5173/forgot-password`).
3. Check your **backend terminal console**. You will see a link like:
   ```
   🔗 PREVIEW EMAIL HERE: https://ethereal.email/message/...
   ```
4. Click the link to view the fake email and get the OTP.

---

## 📧 Setting up Real Gmail Sending

To send actual emails to users' inboxes, you must configure a Gmail App Password.

### Step 1: Prepare your Google Account
**NOTE:** You cannot use your regular Gmail password. Google blocks third-party apps for security.

1. Go to **[Google Account Security](https://myaccount.google.com/security)**.
2. Enable **2-Step Verification** (if not already enabled).
3. Search for **"App passwords"** in the search bar at the top of the page.
4. Select **App passwords**.
5. Create a new App Password:
   - **App name**: `Fleetiva`
   - Click **Create**.
6. Copy the generated **16-character password** (e.g., `abcd efgh ijkl mnop`).

### Step 2: Configure Backend Environment
1. Open the file `backend/.env`.
2. Add or update the SMTP configuration section:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_real_email@gmail.com
SMTP_PASS=paste_your_16_char_app_password_here
SMTP_SECURE=false
SMTP_FROM="Fleetiva Support <no-reply@fleetiva.com>"
```

- **SMTP_USER**: Your full Gmail address.
- **SMTP_PASS**: The 16-character App Password you generated (remove spaces if you want, but Node.js handles them fine usually).

### Step 3: Restart Backend
Whenever you change the `.env` file, you must **restart the server** for changes to take effect:

```bash
# In the backend directory
Ctrl+C  # to stop
npm run dev
```

## 🛠️ Troubleshooting

### Error: `Invalid login: 535-5.7.8 Username and Password not accepted`
- **Cause**: You are likely using your regular Gmail login password.
- **Fix**: You **MUST** use an App Password generated from Google Security settings.

### Error: `EADDRINUSE: address already in use :::5000`
- **Cause**: The server is already running in another terminal or background process.
- **Fix**:
  ```bash
  sudo lsof -i :5000  # Find the Process ID (PID)
  sudo kill -9 <PID>  # Kill the process
  npm run dev         # Start again
  ```
