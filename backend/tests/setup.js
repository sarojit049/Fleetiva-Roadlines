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
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  process.env.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'test-secret';
  process.env.ACCESS_TOKEN_TTL = '1d';
  process.env.MONGOMS_VERSION = process.env.MONGOMS_VERSION || '7.0.14';
  process.env.MONGOMS_DISTRO = process.env.MONGOMS_DISTRO || 'ubuntu-22.04';

  mongoServer = await MongoMemoryServer.create({
    binary: { version: process.env.MONGOMS_VERSION },
  });
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { autoIndex: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
