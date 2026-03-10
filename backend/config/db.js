const mongoose = require('mongoose');

let memoryServer;

const isInMemoryEnabled = () => (process.env.MONGO_FALLBACK_INMEMORY || '').toLowerCase() === 'true';

const connectInMemory = async () => {
  const { MongoMemoryServer } = require('mongodb-memory-server');

  mongoose.set('strictQuery', true);

  if (!memoryServer) {
    memoryServer = await MongoMemoryServer.create();
  }

  const uri = memoryServer.getUri();
  await mongoose.connect(uri, {
    autoIndex: process.env.NODE_ENV !== 'production',
    serverSelectionTimeoutMS: 5000,
  });

  console.log('✅ MongoDB connected (in-memory)');
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    if (isInMemoryEnabled()) {
      await connectInMemory();
      return;
    }
    throw new Error('MONGO_URI is not set');
  }

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: process.env.NODE_ENV !== 'production',
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    if (isInMemoryEnabled()) {
      await connectInMemory();
      return;
    }

    const hint =
      "MongoDB connection failed. If you're using local MongoDB, install/start it (port 27017). " +
      "Or use MongoDB Atlas and set MONGO_URI in backend/.env. " +
      "For quick dev without MongoDB, set MONGO_FALLBACK_INMEMORY=true.";
    err.message = `${hint} Original error: ${err.message}`;
    throw err;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }

  try {
    if (memoryServer) {
      await memoryServer.stop();
      memoryServer = undefined;
    }
  } catch {
    // ignore
  }
};

module.exports = { connectDB, disconnectDB };
