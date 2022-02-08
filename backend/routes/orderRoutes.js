import express from 'express';
const router = express.Router();

import {
    addOrderItems,
    createRazorpayOrder,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    cancelOrderId,
    getOrders,
    deliverOrder
} from '../controllers/orderController.js';
import { protect, admin } from '../middlewares/authMiddlewares.js';

router.route('/')
    .get(protect, admin, getOrders)
    .post(protect, addOrderItems);

router.route('/myOrders')
    .get(protect, getMyOrders);

router.route('/myOrders/:id')
    .delete(protect, cancelOrderId);

router.route('/razorpay')
    .post(protect, createRazorpayOrder);

router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/deliver')
    .put(protect, admin, deliverOrder);

router.route('/:id/pay')
    .put(protect, updateOrderToPaid);


export default router;