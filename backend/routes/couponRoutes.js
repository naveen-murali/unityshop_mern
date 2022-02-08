import express from 'express';
const router = express.Router();

import {
    createCoupon,
    deleteCoupon,
    getCoupon,
    getAllCoupon
} from '../controllers/couponController.js';
import { protect, admin } from '../middlewares/authMiddlewares.js';

router.route('/')
    .get(protect, admin, getAllCoupon)
    .post(protect, admin, createCoupon);

router.route('/:coupon')
    .get(protect, getCoupon)
    .delete(protect, admin, deleteCoupon);

export default router;