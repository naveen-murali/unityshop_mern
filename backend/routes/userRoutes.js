import express from 'express';
const router = express.Router();

import {
    authUser,
    getOtp,
    getUserProfile,
    registerUser,
    updateUserProfile,
    varifyOtp,
    varifyuser
} from '../controllers/userController.js';
import {
    addToWishlists,
    getWishlists,
    removeFromWishlists
} from '../controllers/wishlistController.js';
import { protect, admin } from '../middlewares/authMiddlewares.js';

router.route('/')
    .post(registerUser);

router.post('/login', authUser);
router.route('/otp/:phone')
    .get(getOtp)
    .post(varifyOtp);

router.route('/wishlists')
    .get(protect, getWishlists)
    .put(protect, addToWishlists)
    .delete(protect, removeFromWishlists);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.get('/varifyUser', protect, varifyuser);

export default router;