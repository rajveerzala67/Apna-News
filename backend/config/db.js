import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

global.isMockDB = false;
const MOCK_DB_DIR = path.join(__dirname, '../data');
const MOCK_DB_FILE = path.join(MOCK_DB_DIR, 'db.json');

// Ensure mock database directory and file exist
export const initMockDB = () => {
  if (!fs.existsSync(MOCK_DB_DIR)) {
    fs.mkdirSync(MOCK_DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(MOCK_DB_FILE)) {
    const initialData = {
      users: [],
      readingHistory: [],
      analytics: {
        views: {},
        searches: {},
        categories: {}
      }
    };
    fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(initialData, null, 2));
  }
};

// Read from mock database file
export const readMockDB = () => {
  initMockDB();
  try {
    const data = fs.readFileSync(MOCK_DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading mock database:', error);
    return { users: [], readingHistory: [], analytics: { views: {}, searches: {}, categories: {} } };
  }
};

// Write to mock database file
export const writeMockDB = (data) => {
  initMockDB();
  try {
    fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to mock database:', error);
    return false;
  }
};

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.warn('⚠️  MONGODB_URI is not defined in .env. Falling back to local JSON database storage.');
    global.isMockDB = true;
    initMockDB();
    console.log(`📂 Mock DB initialized at: ${MOCK_DB_FILE}`);
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });
    console.log(`🔌 MongoDB Connected: ${conn.connection.host}`);
    global.isMockDB = false;

    // Drop the problematic bookmarks.url_1 index if it exists
    try {
      const usersCollection = conn.connection.db.collection('users');
      const indexes = await usersCollection.indexes();
      const hasDuplicateIndex = indexes.some(idx => idx.name === 'bookmarks.url_1');
      if (hasDuplicateIndex) {
        console.log('🧹 Problematic index "bookmarks.url_1" detected. Dropping it...');
        await usersCollection.dropIndex('bookmarks.url_1');
        console.log('✅ Dropped "bookmarks.url_1" index successfully.');
      }
    } catch (indexError) {
      console.warn('⚠️ Warning: Could not drop "bookmarks.url_1" index:', indexError.message);
    }
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.warn('⚠️  Falling back to local JSON database storage.');
    global.isMockDB = true;
    initMockDB();
    console.log(`📂 Mock DB initialized at: ${MOCK_DB_FILE}`);
  }
};

export default connectDB;
