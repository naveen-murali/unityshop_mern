import asyncHandler from 'express-async-handler';
import shortid from 'shortid';
// import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import { razorpay } from '../config/razorpay.js';


// @desc    Creating order
// @rout    POST /api/orders
// @acce    Private
export const addOrderItems = asyncHandler(async (req, res, next) => {
    //TODO: need to remove the quanity of the product from the products.
    //TODO: also add the quandity to the product after cancelation.
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        totalPrice,
        paymentResult
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

    const order = new Order(newOrder);
    const createdOrder = await order.save();

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
    console.log(order);

    if (!order) {
        res.status(404);
        throw new Error('Order Not found');
    }

    order.isCancelled = true;
    order.cancelledAt = Date.now();
    const cancelledOrder = await order.save();

    res.json(cancelledOrder);
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
        });

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