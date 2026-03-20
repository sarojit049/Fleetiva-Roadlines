const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');
const User = require('../models/User');
const LoginLog = require('../models/LoginLog');
const { redisClient } = require('../config/clients');
const sendEmail = require('../utils/email');
const {
  registerSchema,
  loginSchema,
  firebaseLoginSchema,
  firebaseRegisterSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validations/authValidation');
const asyncHandler = require('../utils/asyncHandler');
const validateRequest = require('../middleware/validateRequest');

// Fallback in-memory OTP store if Redis is unavailable
const otpStore = new Map();

const router = express.Router();

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '7d';
const OTP_TTL_SECONDS = Number(process.env.OTP_TTL_SECONDS || 600);

const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};

const getJwtSecret = () => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET is not set.');
  }
  return process.env.ACCESS_TOKEN_SECRET;
};

const signToken = (user) =>
  jwt.sign({ userId: user._id, role: user.role }, getJwtSecret(), {
    expiresIn: ACCESS_TOKEN_TTL,
  });

const validatePassword = (password) => typeof password === 'string' && password.length >= 8;

const firebaseReady = () => admin.apps && admin.apps.length > 0;

const logLoginAttempt = ({ req, user, email, provider, status, reason }) =>
  LoginLog.create({
    user: user?._id,
    email: email || user?.email,
    provider,
    status,
    reason,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  }).catch(() => { });

router.post('/register', validateRequest({ body: registerSchema }), asyncHandler(async (req, res) => {
  const { name, email, phone, password, role, companyName } = req.body;

  if (!validatePassword(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered.' });
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    phone,
    password: hashed,
    role,
    companyName: companyName || undefined,
    authProvider: 'local',
    isVerified: true,
  });

  const accessToken = signToken(user);
  setAuthCookie(res, accessToken);

  res.status(201).json({
    accessToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      companyName: user.companyName,
    },
  });
}));

router.post('/login', validateRequest({ body: loginSchema }), asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.password) {
    await logLoginAttempt({
      req,
      email,
      provider: 'local',
      status: 'failure',
      reason: 'invalid_credentials',
    });
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    await logLoginAttempt({
      req,
      user,
      provider: 'local',
      status: 'failure',
      reason: 'invalid_credentials',
    });
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const accessToken = signToken(user);
  setAuthCookie(res, accessToken);
  await logLoginAttempt({ req, user, provider: 'local', status: 'success' });

  res.json({
    accessToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      companyName: user.companyName,
    },
  });
}));

router.post('/firebase/login', validateRequest({ body: firebaseLoginSchema }), asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!firebaseReady()) {
    await logLoginAttempt({
      req,
      provider: 'firebase',
      status: 'failure',
      reason: 'firebase_unavailable',
    });
    return res.status(503).json({ message: 'Firebase authentication unavailable.' });
  }

  const decoded = await admin.auth().verifyIdToken(idToken);
  const { uid, email, name, phone_number: phone } = decoded;

  let user = await User.findOne({ $or: [{ firebaseUid: uid }, { email }] });
  if (!user) {
    user = await User.create({
      name: name || email,
      email,
      phone,
      role: 'customer',
      authProvider: 'firebase',
      firebaseUid: uid,
      isVerified: true,
    });
  }

  const accessToken = signToken(user);
  setAuthCookie(res, accessToken);
  await logLoginAttempt({ req, user, provider: 'firebase', status: 'success' });

  res.json({
    accessToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      companyName: user.companyName,
    },
  });
}));

router.post('/firebase/register', validateRequest({ body: firebaseRegisterSchema }), asyncHandler(async (req, res) => {
  const { idToken, name, phone, role, companyName } = req.body;

  if (!firebaseReady()) {
    return res.status(503).json({ message: 'Firebase authentication unavailable.' });
  }

  const decoded = await admin.auth().verifyIdToken(idToken);
  const { uid, email } = decoded;

  const existing = await User.findOne({ $or: [{ firebaseUid: uid }, { email }] });
  if (existing) {
    return res.status(409).json({ message: 'Account already exists. Please login.' });
  }

  const user = await User.create({
    name,
    email,
    phone,
    role,
    companyName: companyName || undefined,
    authProvider: 'firebase',
    firebaseUid: uid,
    isVerified: true,
  });

  const accessToken = signToken(user);
  setAuthCookie(res, accessToken);

  res.status(201).json({
    accessToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      companyName: user.companyName,
    },
  });
}));

router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.json({ message: 'Logged out' });
});

router.get('/me', require('../middleware/combinedAuth').authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json({ user });
}));

router.post('/forgot-password', validateRequest({ body: forgotPasswordSchema }), asyncHandler(async (req, res) => {
  const { email } = req.body;


  // check removed to ensure OTP sends regardless of user existence

  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

  // Store OTP (Redis or Memory)
  if (redisClient) {
    await redisClient.set(`otp:${email}`, otp, { EX: OTP_TTL_SECONDS });
  } else {
    otpStore.set(email, { otp, expires: Date.now() + OTP_TTL_SECONDS * 1000 });
  }

  await sendEmail(
    email,
    'Your Fleetiva OTP Code',
    `<p>Your Fleetiva OTP is <strong>${otp}</strong>.</p><p>It expires in ${Math.floor(OTP_TTL_SECONDS / 60)} minutes.</p>`
  );

  res.json({ message: 'OTP sent successfully.' });
}));

router.post('/reset-password', validateRequest({ body: resetPasswordSchema }), asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  let storedOtp = null;

  if (redisClient) {
    storedOtp = await redisClient.get(`otp:${email}`);
  } else {
    const data = otpStore.get(email);
    if (data && data.expires > Date.now()) {
      storedOtp = data.otp;
    } else {
      otpStore.delete(email); // Cleanup expired
    }
  }

  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  const user = await User.findOneAndUpdate({ email }, { password: hashed }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found.' });

  // Cleanup OTP
  if (redisClient) {
    await redisClient.del(`otp:${email}`);
  } else {
    otpStore.delete(email);
  }

  res.json({ message: 'Password updated successfully.' });
}));

module.exports = router;
