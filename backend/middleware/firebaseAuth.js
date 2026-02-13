const admin = require("firebase-admin");

/**
 * Middleware to verify Firebase ID token
 * Adds decoded Firebase user to req.user
 */
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Firebase ID token required' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    if (!idToken) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Verify the token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Add Firebase user to request object
    req.user = decodedToken;

    next();
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    return res.status(401).json({ message: 'Invalid Firebase token' });
  }
};

/**
 * Optional middleware - verifies token if present but doesn't require it
 */
const optionalFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      if (idToken) {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
      }
    }

    next();
  } catch (error) {
    // Don't fail, just continue without user
    console.warn('Optional Firebase token verification failed:', error.message);
    next();
  }
};

module.exports = {
  verifyFirebaseToken,
  optionalFirebaseToken
};
