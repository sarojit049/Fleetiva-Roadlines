require("dotenv").config();

const app = require("./app");
const { connectMongo } = require("./config/db2");

require("./config/clients");

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

// ================= SERVER START =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
