import express from 'express';
const router = express.Router();

import {
    authUser,
    getOtp,
    getUserProfile,
    registerUser,
    updateUserProfile,
    varifyOtp,
    varifyuser,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    saveAddress,
    updateAddress,
    googleAuth,
    googleRegister,
    googleLink
} from '../controllers/userController.js';
import {
    addToWishlists,
    getWishlists,
    removeFromWishlists
} from '../controllers/wishlistController.js';
import { protect, admin } from '../middlewares/authMiddlewares.js';


router.route('/')
    .get(protect, admin, getUsers)
    .post(registerUser);

router.post('/google', googleAuth);
router.post('/google/register', googleRegister);
router.post('/google/link', protect, googleLink);

router.post('/login', authUser);

router.route('/address')
    .post(protect, saveAddress)
    .put(protect, updateAddress);

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

router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);


export default router;