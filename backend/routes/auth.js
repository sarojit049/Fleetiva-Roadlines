const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');
const User = require('../models/User');
const LoginLog = require('../models/LoginLog');
const { twilioClient, redisClient } = require('../config/clients');

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

const signToken = (user) =>
  jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
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
  }).catch(() => {});

router.post('/register', async (req, res) => {
  const { name, email, phone, password, role = 'customer', companyName } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: 'Name, email, phone, and password are required.' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  if (!['customer', 'driver', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role.' });
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
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    await logLoginAttempt({
      req,
      email,
      provider: 'local',
      status: 'failure',
      reason: 'missing_credentials',
    });
    return res.status(400).json({ message: 'Email and password are required.' });
  }

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
});

router.post('/firebase/login', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    await logLoginAttempt({
      req,
      provider: 'firebase',
      status: 'failure',
      reason: 'missing_token',
    });
    return res.status(400).json({ message: 'Firebase ID token is required.' });
  }
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
});

router.post('/firebase/register', async (req, res) => {
  const { idToken, name, phone, role = 'customer', companyName } = req.body;
  if (!idToken || !name || !phone) {
    return res.status(400).json({ message: 'ID token, name, and phone are required.' });
  }
  if (!['customer', 'driver', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role.' });
  }
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
});

router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.json({ message: 'Logged out' });
});

router.get('/me', require('../middleware/combinedAuth').authenticate, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json({ user });
});

router.post('/forgot-password', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: 'Phone is required.' });

  const user = await User.findOne({ phone });
  if (!user) return res.status(404).json({ message: 'User not found.' });

  if (!redisClient) {
    return res.status(503).json({ message: 'OTP service unavailable.' });
  }

  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
  await redisClient.set(`otp:${phone}`, otp, { EX: OTP_TTL_SECONDS });

  if (!twilioClient) {
    return res.status(503).json({ message: 'SMS service unavailable.' });
  }

  await twilioClient.messages.create({
    body: `Your Fleetiva OTP is ${otp}. It expires in ${Math.floor(OTP_TTL_SECONDS / 60)} minutes.`,
    from: process.env.TWILIO_FROM_NUMBER,
    to: phone,
  });

  res.json({ message: 'OTP sent successfully.' });
});

router.post('/reset-password', async (req, res) => {
  const { phone, otp, newPassword } = req.body;
  if (!phone || !otp || !newPassword) {
    return res.status(400).json({ message: 'Phone, OTP, and new password are required.' });
  }

  if (!validatePassword(newPassword)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  if (!redisClient) {
    return res.status(503).json({ message: 'OTP service unavailable.' });
  }

  const storedOtp = await redisClient.get(`otp:${phone}`);
  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  const user = await User.findOneAndUpdate({ phone }, { password: hashed }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found.' });

  await redisClient.del(`otp:${phone}`);

  res.json({ message: 'Password updated successfully.' });
});

module.exports = router;
