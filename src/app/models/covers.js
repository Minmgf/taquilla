import mongoose from 'mongoose';

const CoversSchema = new mongoose.Schema({
    taquillero: {
        type: String,
        required: true
    },
    coversQuantity: {
        type: Number,
        required: true
    },
    coverValue: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentReceived: {
        type: Number,
        required: true
    },
    change: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    paid: {
        type: Boolean,
        required: true
    }
});

export const Covers = mongoose.models.Covers || mongoose.model('Covers', CoversSchema);
