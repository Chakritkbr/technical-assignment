import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
export const connectDB = async () => {
  console.log(`MONGO_URI env: ${process.env.MONGO_URI}`);
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});
