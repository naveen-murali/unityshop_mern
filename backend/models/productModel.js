import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
        },
    },
    {
        timestamps: true
    }
);

const productModel = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        name: {
            type: String,
            required: true
        },
        image: [{
            type: String,
            required: true,
        }],
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Brand"
        },
        description: {
            type: String,
            required: true
        },
        reviews: [reviewSchema],
        rating: {
            type: Number,
            required: true,
            default: 0
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0
        },
        discount: {
            type: Number,
            required: true,
            default: 0
        },
        price: {
            type: Number,
            required: true,
            default: 0
        },
        countInStock: {
            type: Number,
            required: true,
            default: 0
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
);


const Product = mongoose.model('Product', productModel);

export default Product;