const jwt = require('jsonwebtoken');
const User = require('../models/User');

const extractToken = (req) =>
  req.cookies?.accessToken ||
  req.headers.authorization?.split(' ')[1] ||
  req.query?.token;

let admin = null;

/* ================= SAFE FIREBASE LOAD ================= */
try {
  admin = require("firebase-admin");

  // Firebase only usable if initialized in server.js
  if (admin.apps.length === 0) {
    console.warn("⚠️ Firebase not initialized — combinedAuth running in JWT-only mode");
  }
} catch (err) {
  console.warn("⚠️ Firebase package not found — combinedAuth running in JWT-only mode");
}

exports.authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);
        if (user) {
          req.user = { userId: user._id, role: user.role, email: user.email, name: user.name };
          return next();
        }
      } catch (jwtErr) {
        console.warn("JWT verification failed, trying Firebase:", jwtErr.message);
      }
    }

    // If JWT failed or not present, try Firebase
    if (admin && admin.apps.length > 0) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const idToken = authHeader.split('Bearer ')[1];
        if (idToken) {
          try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const user = await User.findOne({ firebaseUid: decodedToken.uid });
            if (user) {
              req.user = { userId: user._id, role: user.role, email: user.email, name: user.name };
              return next();
            }
          } catch (firebaseErr) {
            console.warn("Firebase verification failed:", firebaseErr.message);
          }
        }
      }
    }

    // If both failed
    return res.status(401).json({ message: "Unauthorized" });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (roles.length && !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return next();
};
