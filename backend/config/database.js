const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const isTest = process.env.NODE_ENV === 'test';

let mongoServer;

/**
 * Connect to MongoDB (or in-memory MongoDB for tests)
 * @returns {Promise<typeof mongoose>}
 */
async function connectDB() {
  // Skip if already connected
  if (mongoose.connection.readyState === 1) {
    console.info('Already connected to MongoDB');
    return mongoose;
  }
  
  if (isTest) {
    // Fast, zero-setup in-memory MongoDB for tests
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    
    console.info('Connected to in-memory MongoDB for testing');
  } else {
    if (!process.env.MONGODB_URL) {
      throw new Error('Missing MONGODB_URL environment variable');
    }
    
    await mongoose.connect(process.env.MONGODB_URL, {
      maxPoolSize: 5,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    });
    
    console.info('Connected to MongoDB');
  }
  
  return mongoose;
}

/**
 * Disconnect from MongoDB and cleanup
 * @returns {Promise<void>}
 */
async function disconnectDB() {
  await mongoose.disconnect();
  
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
}

/**
 * Clear all collections (useful for tests)
 * @returns {Promise<void>}
 */
async function clearDatabase() {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

module.exports = {
  connectDB,
  disconnectDB,
  clearDatabase,
  mongoose
};
