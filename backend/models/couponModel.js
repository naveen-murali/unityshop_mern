import mongoose from 'mongoose';

const couponSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        coupon: {
            type: String,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
        expireAt: {
            type: Date,
            required: true
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        },
        usedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'User'
        }]
    },
    {
        timestamps: true
    }
);

const Wishlist = mongoose.model('Coupon', couponSchema);

export default Wishlist;