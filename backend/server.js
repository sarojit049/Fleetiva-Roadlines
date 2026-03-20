require("dotenv").config();
const app = require("./app");
const { connectMongo } = require("./config/db2");

require("./config/clients");

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

// ================= HEALTH ROUTE =================
app.get("/", (req, res) => {
  res.json({ status: "Fleetiva backend running" });
});

// ================= DATABASE =================
const startServer = async () => {
  try {
    await connectMongo();
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
