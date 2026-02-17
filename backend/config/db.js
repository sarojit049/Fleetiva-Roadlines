
const { MongoClient, ServerApiVersion } = require("mongodb");
let MongoMemoryServer;
try {
  MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
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
    },
  });
}

async function startInMemoryMongo() {
  if (!MongoMemoryServer) {
    throw new Error("mongodb-memory-server not installed");
  }
  memoryServerInstance = await MongoMemoryServer.create();
  const uri = memoryServerInstance.getUri();
  client = await createClient(uri);
  await client.connect();
  console.log("✅ Started in-memory MongoDB for local testing");
}

async function connectMongo() {
  try {
    if (uriFromEnv) {
      client = await createClient(uriFromEnv);
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("✅ MongoDB: Pinged deployment — connected successfully");
    } else if (process.env.SKIP_MONGO === "true") {
      console.log("⚠️ SKIP_MONGO=true — skipping MongoDB initialization");
    } else {
      if (!MongoMemoryServer) {
        console.warn(
          "⚠️ No MONGO_URI and mongodb-memory-server not installed; skipping",
        );
        return;
      }
      await startInMemoryMongo();
      await client.db("admin").command({ ping: 1 });
    }
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message || err);
    throw err;
  }
}

async function stopInMemoryMongo() {
  if (client) await client.close();
  if (memoryServerInstance) await memoryServerInstance.stop();
}

module.exports = { connectMongo, client: () => client, stopInMemoryMongo };
// const { MongoClient, ServerApiVersion } = require('mongodb');
// let MongoMemoryServer;
// try {
//   MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
// } catch (e) {
//   MongoMemoryServer = null;
// }

// const uriFromEnv = process.env.MONGO_URI;

// let memoryServerInstance = null;
// let client = null;

// async function createClient(uri) {
//   return new MongoClient(uri, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     }
//   });
// }

// async function startInMemoryMongo() {
//   if (!MongoMemoryServer) {
//     throw new Error('mongodb-memory-server not installed');
//   }
//   memoryServerInstance = await MongoMemoryServer.create();
//   const uri = memoryServerInstance.getUri();
//   client = await createClient(uri);
//   await client.connect();
//   console.log('✅ Started in-memory MongoDB for local testing');
// }

// async function connectMongo() {
//   try {
//     if (uriFromEnv) {
//       client = await createClient(uriFromEnv);
//       await client.connect();
//       await client.db('admin').command({ ping: 1 });
//       console.log('✅ MongoDB: Pinged deployment — connected successfully');
//     } else if (process.env.SKIP_MONGO === 'true') {
//       console.log('⚠️ SKIP_MONGO=true — skipping MongoDB initialization');
//     } else {
//       if (!MongoMemoryServer) {
//         console.warn('⚠️ No MONGO_URI and mongodb-memory-server not installed; skipping');
//         return;
//       }
//       await startInMemoryMongo();
//       await client.db('admin').command({ ping: 1 });
//     }
//   } catch (err) {
//     console.error('❌ MongoDB connection error:', err.message || err);
//     throw err;
//   }
// }

// async function stopInMemoryMongo() {
//   if (client) await client.close();
//   if (memoryServerInstance) await memoryServerInstance.stop();
// }

// module.exports = { connectMongo, client: () => client, stopInMemoryMongo };
// const { MongoClient, ServerApiVersion } = require('mongodb');

// const uri = process.env.MONGO_URI || "mongodb+srv://sarojyadavit_db_user:<db_password>@fleetiva.n6ydrw1.mongodb.net/?appName=fleetiva";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function connectMongo() {
//   try {
//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log("✅ MongoDB: Pinged deployment — connected successfully");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err.message || err);
//     throw err;
//   }
// }

// module.exports = { connectMongo, client };
// const { MongoClient, ServerApiVersion } = require('mongodb');
// let MongoMemoryServer;
// try {
//   MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
// } catch (e) {
//   MongoMemoryServer = null;
// }

// const uriFromEnv = process.env.MONGO_URI;

// let memoryServerInstance = null;
// let client = null;

// async function createClient(uri) {
//   return new MongoClient(uri, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     }
//   });
// }

// async function startInMemoryMongo() {
//   if (!MongoMemoryServer) {
//     throw new Error('mongodb-memory-server not installed');
//   }
//   memoryServerInstance = await MongoMemoryServer.create();
//   const uri = memoryServerInstance.getUri();
//   client = await createClient(uri);
//   await client.connect();
//   console.log('✅ Started in-memory MongoDB for local testing');
// }

// async function connectMongo() {
//   try {
//     if (uriFromEnv) {
//       client = await createClient(uriFromEnv);
//       await client.connect();
//       await client.db('admin').command({ ping: 1 });
//       console.log('✅ MongoDB: Pinged deployment — connected successfully');
//     } else if (process.env.SKIP_MONGO === 'true') {
//       console.log('⚠️ SKIP_MONGO=true — skipping MongoDB initialization');
//     } else {
//       if (!MongoMemoryServer) {
//         console.warn('⚠️ No MONGO_URI and mongodb-memory-server not installed; skipping');
//         return;
//       }
//       await startInMemoryMongo();
//       await client.db('admin').command({ ping: 1 });
//     }
//   } catch (err) {
//     console.error('❌ MongoDB connection error:', err.message || err);
//     throw err;
//   }
// }

// async function stopInMemoryMongo() {
//   if (client) await client.close();
//   if (memoryServerInstance) await memoryServerInstance.stop();
// }

// module.exports = { connectMongo, client: () => client, stopInMemoryMongo };
// const { MongoClient, ServerApiVersion } = require('mongodb');

// const uri = process.env.MONGO_URI || "mongodb+srv://sarojyadavit_db_user:<db_password>@fleetiva.n6ydrw1.mongodb.net/?appName=fleetiva";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function connectMongo() {
//   try {
//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log("✅ MongoDB: Pinged deployment — connected successfully");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err.message || err);
//     throw err;
//   }
// }

// module.exports = { connectMongo, client };
const { connectMongo, stopInMemoryMongo } = require('./db2');

module.exports = { connectMongo, stopInMemoryMongo };

