require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const admin = require("firebase-admin");

const errorHandler = require("./middleware/errorHandler");
const { connectMongo } = require("./config/db");

require("./config/clients");

const app = express();

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ================= FIREBASE SAFE INIT =================
if (process.env.SKIP_FIREBASE === "true") {
  console.log("⚠️ Firebase skipped (SKIP_FIREBASE=true)");
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
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
      console.log("✅ Firebase initialized");
    }
  } catch (err) {
    console.warn("⚠️ Firebase init failed:", err.message);
  }
} else {
  console.warn("⚠️ Firebase env not set — running without Firebase");
}

// ================= DATABASE =================
connectMongo()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ================= HEALTH ROUTE =================
app.get("/", (req, res) => {
  res.json({ status: "Fleetiva backend running" });
});

// ================= API ROUTES =================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/logistics", require("./routes/logistics"));

// ================= ERROR HANDLER =================
app.use(errorHandler);

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
