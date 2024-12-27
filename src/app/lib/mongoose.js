import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
    throw new Error('Please define the MONGODB_URL environment variable inside .env');
}

export async function connectDB() {
    try {
        const { connection } = await mongoose.connect(MONGODB_URL);

        if (connection.readyState === 1) {
            console.log('MongoDB connected');
            return;
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}
