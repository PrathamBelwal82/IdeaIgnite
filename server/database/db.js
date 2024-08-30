const mongoose =require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const DBConnection = async()=>{
    const MONGODB_URI=process.env.MONGODB_URI;
    try {
        await mongoose.connect(MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 50000, // Increase timeout if needed
        });
        console.log('MongoDB connected successfully');
      } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
      }
};

module.exports = {DBConnection};