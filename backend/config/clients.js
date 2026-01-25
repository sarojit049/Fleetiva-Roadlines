require('dotenv').config();
const twilio = require('twilio');

/* ================== TWILIO ================== */
let twilioClient = null;

if (
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN
) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
} else {
  console.log('ℹ️ Twilio disabled (env vars missing)');
}

/* ================== REDIS (STRICTLY OPTIONAL) ================== */
let redisClient = null;

if (process.env.REDIS_URL && process.env.REDIS_URL.trim() !== '') {
  const redis = require('redis');

  redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
      reconnectStrategy: false, // 🚨 THIS IS CRITICAL
    },
  });

  redisClient.on('ready', () => {
    console.log('✅ Redis connected');
  });

  redisClient.on('error', (err) => {
    console.warn('⚠️ Redis error (ignored):', err.message);
  });

  (async () => {
    try {
      await redisClient.connect();
    } catch (err) {
      console.warn('⚠️ Redis unavailable. Running without Redis.');
      redisClient = null;
    }
  })();
} else {
  console.log('ℹ️ REDIS_URL not set. Redis completely disabled.');
}

module.exports = { twilioClient, redisClient };
