require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const admin = require('firebase-admin');

const errorHandler = require('./middleware/errorHandler');
const { connectMongo } = require('./config/db2');

require('./config/clients');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_PREVIEW_URL,
    process.env.CORS_ORIGINS,
  ]
    .filter(Boolean)
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean)
);

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.size === 0) return true;
  if (allowedOrigins.has(origin)) return true;
  const previewSuffix = process.env.VERCEL_PREVIEW_SUFFIX;
  if (previewSuffix && origin.endsWith(previewSuffix)) return true;
  return false;
};

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

app.use(express.json());
app.use(cookieParser());

if (process.env.SKIP_FIREBASE === 'true') {
  console.log('⚠️ Firebase skipped (SKIP_FIREBASE=true)');
} else if (
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_PRIVATE_KEY &&
  process.env.FIREBASE_CLIENT_EMAIL
) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
    }
  } catch (err) {
    console.warn('⚠️ Firebase init failed:', err.message);
  }
} else {
  console.warn('⚠️ Firebase env not set — running without Firebase');
}

connectMongo()
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/load', require('./routes/load'));
app.use('/api/truck', require('./routes/truck'));
app.use('/api/booking', require('./routes/booking'));
app.use('/api/bilty', require('./routes/bilty'));
app.use('/api/match', require('./routes/match'));
app.use('/api/users', require('./routes/users'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
