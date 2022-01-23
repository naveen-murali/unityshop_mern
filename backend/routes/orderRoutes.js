import express from 'express';
const router = express.Router();

import {
    addOrderItems,
    createRazorpayOrder,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    cancelOrderId
} from '../controllers/orderController.js';
import { protect, admin } from '../middlewares/authMiddlewares.js';

router.route('/')
    .post(protect, addOrderItems);

router.route('/myOrders')
    .get(protect, getMyOrders);

router.route('/myOrders/:id')
    .delete(protect, cancelOrderId);

router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/pay')
    .put(protect, updateOrderToPaid);

router.route('/razorpay')
    .post(protect, createRazorpayOrder);

export default router;