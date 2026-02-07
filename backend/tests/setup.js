const { connectMongo, stopInMemoryMongo } = require("../config/db2");

jest.setTimeout(600000); // 10 minutes for initial MongoDB download


beforeAll(async () => {
  // Connect to the in-memory database
  // We don't set MONGO_URI, so db2.js will use MongoMemoryServer
  process.env.SKIP_MONGO = "false"; 
  await connectMongo();
});

afterAll(async () => {
  await stopInMemoryMongo();
});
