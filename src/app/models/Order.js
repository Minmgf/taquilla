import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    taquillero: {
        type: String,
        required: true
    },
    coverValue: {
        type: Number,
        required: true
    },
    baseAmount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    paid: {
        type: Boolean,
        default: false
    },
    value: {
        type: Number,
        default: 0
    }
});

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
