import asyncHandler from 'express-async-handler';
import shortid from 'shortid';
import mongoose from 'mongoose';
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import Coupon from "../models/couponModel.js";
import User from "../models/userModel.js";
import { razorpay } from '../config/razorpay.js';

const ObjectId = mongoose.Types.ObjectId;


// @desc    Creating order
// @rout    POST /api/orders
// @acce    Private
export const addOrderItems = asyncHandler(async (req, res, next) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        totalPrice,
        paymentResult,
        appiedCoupon,
        wallet
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }
    let newOrder = {
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        totalPrice
    };
    if (paymentMethod === 'Razorpay') {
        newOrder.paymentResult = paymentResult;
        newOrder.isPaid = true;
        newOrder.paidAt = paymentResult.update_time;
    }

    if (paymentMethod === 'PayPal') {
        newOrder.isPaid = true;
        newOrder.id = paymentResult.id;
        newOrder.status = paymentResult.status;
        newOrder.update_time = new Date(paymentResult.update_time);
        newOrder.email_address = paymentResult.payer.email_address;
    }

    if (appiedCoupon)
        newOrder.appiedCoupon = appiedCoupon;

    if (wallet)
        newOrder.wallet = wallet;

    const order = new Order(newOrder);
    const createdOrder = await order.save();

    if (wallet) {
        const user = await User.findById(req.user._id);
        user.wallet = user.wallet - wallet;
        await user.save();
    }

    const productIds = orderItems.map(item => ObjectId(item.product));
    const products = await Product.find({ _id: { $in: productIds } });
    orderItems.forEach(async (item) => {
        const index = products.findIndex(product =>
            product._id.toString() === item.product);

        await Product.findByIdAndUpdate(
            products[index],
            {
                $inc: {
                    countInStock: -item.qty
                }
            });
    });

    if (appiedCoupon) {
        const coupon = await Coupon.findById(appiedCoupon._id);
        coupon.usedBy.push(req.user._id);
        await coupon.save();
    }

    // products.save();
    res.status(201).json(createdOrder);
});


// @desc    Getting one order
// @rout    GET /api/orders/:id
// @acce    Private
export const getOrderById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findById(id)
        .populate('user', 'name email phone')
        .populate({
            path: 'orderItems.product',
            select: 'name image brand',
            populate: {
                path: 'brand',
                select: 'name'
            }
        });

    if (!order) {
        res.status(404);
        throw new Error('Order Not found');
    }

    res.json(order);
});


// @desc    Cancelling one order
// @rout    DELETE /api/orders/:id
// @acce    Private
export const cancelOrderId = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findById(id)
        .populate('user', 'name email phone')
        .populate({
            path: 'orderItems.product',
            select: 'name image brand',
            populate: {
                path: 'brand',
                select: 'name'
            }
        });

    if (!order) {
        res.status(404);
        throw new Error('Order Not found');
    }

    order.isCancelled = true;
    order.cancelledAt = Date.now();
    const cancelledOrder = await order.save();

    const productIds = order.orderItems.map(item => item.product._id);
    const products = await Product.find({ _id: { $in: productIds } });

    order.orderItems.forEach(async (item) => {
        const index = products.findIndex(product =>
            product._id.toString() === item.product._id.toString());
        await Product.findByIdAndUpdate(products[index]._id, { $inc: { countInStock: +item.qty } });
    });

    res.json(cancelledOrder);
});


// @desc    Deliver status to true
// @rout    PUT /api/orders/:id/deliver
// @acce    Private/Admin
export const deliverOrder = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findById(id)
        .populate('user', 'name email phone')
        .populate({
            path: 'orderItems.product',
            select: 'name image brand',
            populate: {
                path: 'brand',
                select: 'name'
            }
        });

    if (!order) {
        res.status(404);
        throw new Error('Order Not found');
    }

    order.isDelivered = true;
    order.deliveredAt = new Date(now());
    if (order.paymentMethod === 'COD') {
        order.isPaid = true;
        order.paidAt = new Date(now());
    }

    const deliveredOrder = await order.save();

    res.json(deliveredOrder);
});

// @desc    For getting an orders of a user
// @rout    GET /api/orders/myOrders/:id
// @acce    Private
export const getMyOrders = asyncHandler(async (req, res, next) => {
    const { _id: id } = req.user;
    const orders = await Order.find({ user: id })
        .populate('user', 'name email phone')
        .populate({
            path: 'orderItems.product',
            select: 'name image',
        }).sort({ createdAt: -1 });

    if (!orders) {
        res.status(404);
        throw new Error('Orders Not found');
    }

    res.json(orders);
});


// @desc    Updating order to paind
// @rout    GET /api/orders/:id/pay
// @acce    Private
export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
        res.status(404);
        throw new Error('Order Not found');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address
    };

    updatedOrder = new order.save();

    res.json(updatedOrder);
});


// @desc    Creating razorpay payment
// @rout    POST /api/orders/razorpay
// @acce    Private
export const createRazorpayOrder = asyncHandler(async (req, res, next) => {
    const { totalPrice } = req.body;
    const payment_capture = 1;
    const currency = "INR";

    const options = {
        amount: totalPrice * 100,
        currency,
        receipt: shortid.generate(),
        payment_capture,
    };


    const response = await razorpay.orders.create(options);

    if (!response.status === 'created') {
        res.status(500);
        throw new Error('Failed to create payment');
    }

    res.status(201).json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
        key: process.env.RAZORPAY_KEY_ID
    });
});

// @desc    For getting all orders of a users
// @rout    GET /api/orders/myOrders
// @acce    Private/Admin
export const getOrders = asyncHandler(async (req, res, next) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Order.countDocuments();
    const orders = await Order.find({})
        .populate('user', 'name email phone')
        .populate({
            path: 'orderItems.product',
            select: 'name image',
        }).sort({ createdAt: -1 })
        .limit(pageSize)
        .skip((page - 1) * pageSize);

    if (!orders) {
        res.status(404);
        throw new Error('Orders Not found');
    }

    res.json({
        orders,
        page,
        pages: Math.ceil(count / pageSize)
    });
});


const now = () => {
    const d = new Date();
    const yy = d.getFullYear();
    const mm = (d.getMonth() + 1 < 10) ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
    const dd = ((d.getDate()) < 10) ? `0${(d.getDate())}` : ((d.getDate()));
    const newDate = `${yy}-${mm}-${dd}`;
    return newDate;
};
