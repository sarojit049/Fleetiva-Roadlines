const { connectMongo, stopInMemoryMongo } = require("../config/db2");
const mongoose = require("mongoose");

jest.setTimeout(600000); // 10 minutes for initial MongoDB download

beforeAll(async () => {
  process.env.SKIP_MONGO = "false"; 
  // Ensure we don't accidentally connect to real DB if env vars are leaking
  process.env.MONGO_URI = ""; 
  await connectMongo();
});

afterAll(async () => {
  await stopInMemoryMongo();
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});
