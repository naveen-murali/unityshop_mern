import mongoose from 'mongoose';

const wishlistSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        wishlistItems: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product"
        }],
    },
    {
        timestamps: true
    }
);

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;