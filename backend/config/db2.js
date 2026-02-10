const mongoose = require('mongoose');
let MongoMemoryServer;

try {
  MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
} catch (e) {
  MongoMemoryServer = null;
}

const uriFromEnv = process.env.MONGO_URI;
let memoryServerInstance = null;

async function connectMongo() {
  if (mongoose.connection.readyState === 1) return;

  try {
    if (uriFromEnv) {
      await mongoose.connect(uriFromEnv, {
        autoIndex: true,
      });
      return;
    }

    if (process.env.SKIP_MONGO === 'true') {
      return;
    }

    if (!MongoMemoryServer) {
      throw new Error('MONGO_URI is required or install mongodb-memory-server');
    }

    memoryServerInstance = await MongoMemoryServer.create();
    const uri = memoryServerInstance.getUri();
    await mongoose.connect(uri, { autoIndex: true });
  } catch (err) {
    throw err;
  }
}

async function stopInMemoryMongo() {
  if (mongoose.connection.readyState) {
    await mongoose.disconnect();
  }
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
  }
}

module.exports = { connectMongo, stopInMemoryMongo };
