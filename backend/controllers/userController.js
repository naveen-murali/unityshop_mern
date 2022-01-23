import asyncHandler from 'express-async-handler';
import User from "../models/userModel.js";
import Wishlist from "../models/whishlistModel.js";
import generateToken from '../util/generateToken.js';
import { client } from '../config/twilio.js';

// @desc    Auth use & get token
// @rout    POST /api/users/login
// @acce    Private
export const authUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);
        throw new Error('Invalid email address');
    }

    let wishlistCount;
    try {
        const wishlist = await Wishlist.findOne({ user: user._id });
        wishlistCount = wishlist ? wishlist.wishlistItems.length : 0;
    } catch (err) {
        console.error(err);
    }

    if (user && (await user.matchPassword(password))) {
        return res.json({
            _id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            isAdmin: user.isAdmin,
            wishlistCount,
            token: generateToken(user._id)
        });
    }

    res.status(401);
    throw new Error('Invalid password');
});


// @desc    Varifyning user & getting new token
// @rout    POST /api/users/varifyuser
// @acce    Private
export const varifyuser = asyncHandler(async (req, res, next) => {
    const user = req.user;

    let wishlistCount;
    try {
        const wishlist = await Wishlist.findOne({ user: user._id });
        wishlistCount = wishlist ? wishlist.wishlistItems.length : 0;
    } catch (err) {
        console.error(err);
    }

    if (user) {
        return res.json({
            _id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            isAdmin: user.isAdmin,
            wishlistCount,
            token: generateToken(user._id)
        });
    }

    res.status(401);
    throw new Error('User not found');
});


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// @desc    To update the profile of the user.
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updateUser = await user.save();
        return res.json({
            _id: updateUser._id,
            name: updateUser.name,
            phone: updateUser.phone,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
            token: generateToken(updateUser._id)
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// @desc    Register a new User
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
    const { name, phone, email, password } = req.body;
    
    const userExistPhone = await User.findOne({ phone });
    if (userExistPhone) {
        res.status(400);
        throw new Error(`${phone} is already a registered`);
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(400);
        throw new Error(`${email} is already a user`);
    }

    const user = await User.create({
        name,
        phone,
        email,
        password
    });

    if (user)
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });

    res.status(400);
    throw new Error('Invalid user data');
});


// @desc    For getting otp
// @route   GET /api/users/getOtp
// @access  Public
export const getOtp = asyncHandler(async (req, res) => {
    const phone = req.params.phone;

    const user = await User.findOne({ phone });

    if (!user) {
        res.status(400);
        throw new Error('Please enter a registered phone number');
    }

    const resp = await client.verify.services(process.env.SERVICE_ID)
        .verifications
        .create({ to: `+91${phone}`, channel: 'sms' });

    res.json({ message: 'OTP send' });
});


// @desc    For getting otp
// @route   GET /api/users/otp
// @access  Public
export const varifyOtp = asyncHandler(async (req, res) => {
    try {
        const phone = req.params.phone;

        const { status } = await client.verify.services(process.env.SERVICE_ID)
            .verificationChecks
            .create({ to: `+91${phone}`, code: req.body.otp });

        if (status !== 'approved') {
            res.status(401);
            throw new Error('Invalid OTP');
        }

        const user = await User.findOne({ phone });
        if (!user) {
            res.status(400);
            throw new Error('Please enter a registered phone number');
        }

        user.password = req.body.password;
        const newUserData = await user.save();

        res.json({ message: 'Password successfuly changed, Please Login.' });
    } catch (err) {
        console.error(err);
        res.status(401);
        throw new Error('OTP Varification failed');
    }
});