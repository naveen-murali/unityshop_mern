import mongoose from 'mongoose';

const offersSchema = mongoose.Schema(
    {
        discount: {
            type: Number,
            required: false
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        },
        expireAt: {
            type: Date,
            required: false
        }
    },
    {
        timestamps: true
    }
);

const brandSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        },
        offers: [offersSchema]
    },
    {
        timestamps: true
    }
);

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;