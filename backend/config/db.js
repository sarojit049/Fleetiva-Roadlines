const { MongoClient, ServerApiVersion } = require('mongodb');
let MongoMemoryServer;

try {
  MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
} catch (e) {
  MongoMemoryServer = null;
}

const uriFromEnv = process.env.MONGO_URI;
let memoryServerInstance = null;
let client = null;

async function createClient(uri) {
  return new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
}

async function startInMemoryMongo() {
  if (!MongoMemoryServer) {
    throw new Error('mongodb-memory-server not installed');
  }
  memoryServerInstance = await MongoMemoryServer.create();
  const uri = memoryServerInstance.getUri();
  client = await createClient(uri);
  await client.connect();
}

async function connectMongo() {
  try {
    if (uriFromEnv) {
      client = await createClient(uriFromEnv);
      await client.connect();
      await client.db('admin').command({ ping: 1 });
    } else if (process.env.SKIP_MONGO === 'true') {
      return;
    } else {
      if (!MongoMemoryServer) {
        return;
      }
      await startInMemoryMongo();
      await client.db('admin').command({ ping: 1 });
    }
  } catch (err) {
    throw err;
  }
}

async function stopInMemoryMongo() {
  if (client) await client.close();
  if (memoryServerInstance) await memoryServerInstance.stop();
}

module.exports = { connectMongo, client: () => client, stopInMemoryMongo };
