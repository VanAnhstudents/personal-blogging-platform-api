const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('MongoDB URL:', process.env.MONGODB_URL);
        
        if (!process.env.MONGODB_URL) {
            throw new Error('MONGODB_URL is not defined in environment variables');
        }

        const conn = await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected: ${conn.connection.host}');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
