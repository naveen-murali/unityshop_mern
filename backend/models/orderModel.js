import mongoose from 'mongoose';

const orderItemsSchema = mongoose.Schema({
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: {
        type: Number,
        required: true,
        default: 0
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    }
});

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        orderItems: [orderItemsSchema],
        shippingAddress: {
            phone: { type: Number, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            contry: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            required: true
        },
        paymentResult: {
            razorpay_order_id: { type: String },
            razorpay_payment_id: { type: String },
            razorpay_signature: { type: String },
            id: { type: String },
            status: { type: String },
            email_address: { type: String },
            update_time: { type: Date },
        },
        itemsPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        appiedCoupon: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: false,
                ref: 'Coupon'
            },
            coupon: {
                type: String,
                required: false,
            },
            discount: {
                type: Number,
                required: false,
            }
        },
        wallet: {
            type: Number,
            required: true,
            default: 0
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false
        },
        paidAt: { type: Date },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false
        },
        deliveredAt: { type: Date },
        isCancelled: {
            type: Boolean,
            default: false
        },
        cancelledAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);


const Order = mongoose.model('Order', orderSchema);

export default Order;