const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from server/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/renthere';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected successfully to host: ${conn.connection.host}`);
    console.log(`📍 Connected Database Name: ${conn.connection.name}`);
  } catch (err) {
    console.warn('⚠️ Primary MongoDB connection failed or timeout. Attempting fallback memory server...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`✅ InMemory MongoDB Connected successfully at: ${uri}`);
    } catch (memErr) {
      console.error('❌ MongoDB Connection Error:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
