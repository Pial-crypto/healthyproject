// lib/mongodb.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL;
//console.log("DATABASE_URL in route:", MONGODB_URI);



async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }
  await mongoose.connect(MONGODB_URI);
  console.log("mongo successfully connected");
  return mongoose;
}

export default dbConnect;