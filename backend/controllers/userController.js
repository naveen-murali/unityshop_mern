import asyncHandler from 'express-async-handler';
import User from "../models/userModel.js";
import Wishlist from "../models/whishlistModel.js";
import generateToken from '../util/generateToken.js';
import { client } from '../config/twilio.js';

// @desc    Auth use & get token
// @rout    POST /api/users/login
// @acce    Public
export const authUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);
        throw new Error('Invalid email address');
    }

    if (user.isBlocked) {
        res.status(403);
        throw new Error('Account is blocked, contact the admin.');
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
            wallet: user.wallet,
            address: user.address,
            isAdmin: user.isAdmin,
            referralNum: user.referralNum,
            wishlistCount,
            token: generateToken(user._id)
        });
    }

    res.status(401);
    throw new Error('Invalid password');
});


// @desc    Auth use & get token using google authentication
// @rout    POST /api/users/google
// @acce    Public
export const googleAuth = asyncHandler(async (req, res, next) => {
    const { googleId } = req.body;
    const user = await User.findOne({ googleId });

    if (!user) {
        res.status(401);
        throw new Error('User not registerd');
    }

    if (user.isBlocked) {
        res.status(403);
        throw new Error('Account is blocked, contact the admin.');
    }

    let wishlistCount;
    try {
        const wishlist = await Wishlist.findOne({ user: user._id });
        wishlistCount = wishlist ? wishlist.wishlistItems.length : 0;
    } catch (err) {
        console.error(err);
    }

    return res.json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        wallet: user.wallet,
        address: user.address,
        isAdmin: user.isAdmin,
        referralNum: user.referralNum,
        wishlistCount,
        token: generateToken(user._id)
    });
});


// @desc    Register a new User
// @route   POST /api/users/register
// @access  Public
export const googleRegister = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        phone,
        googleId,
        referralId
    } = req.body;

    console.log({
        name,
        email,
        phone,
        googleId,
    });

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

    let refUser;
    if (referralId) {
        refUser = await User.findOne({ phone: referralId });

        if (!refUser) {
            res.status(400);
            throw new Error('Sorry, referred user not found');
        }
    }

    const user = await User.create({
        name,
        email,
        phone,
        googleId,
        wallet: referralId ? 200 : 0
    });

    if (refUser && referralId) {
        refUser.wallet = 200;
        refUser.referralNum = refUser.referralNum + 1;
        await refUser.save();
    }

    if (user)
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            isAdmin: user.isAdmin,
            wallet: user.wallet,
            address: user.address,
            referralNum: user.referralNum,
            token: generateToken(user._id)
        });

    res.status(400);
    throw new Error('Invalid user data');
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

    if (user)
        return res.json({
            _id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            wallet: user.wallet,
            address: user.address,
            isAdmin: user.isAdmin,
            referralNum: user.referralNum,
            wishlistCount,
            token: generateToken(user._id)
        });

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
            address: user.address,
            wallet: user.wallet,
            referralNum: user.referralNum,
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
    console.log(req.body);
    if (user) {
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.email = req.body.email || user.email;

        if (req.body.password)
            user.password = req.body.password;


        const updateUser = await user.save();
        return res.json({
            _id: updateUser._id,
            name: updateUser.name,
            phone: updateUser.phone,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
            wallet: updateUser.wallet,
            address: user.address,
            referralNum: updateUser.referralNum,
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
    const {
        name,
        phone,
        email,
        password,
        referralId
    } = req.body;


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

    let refUser;
    if (referralId) {
        refUser = await User.findOne({ phone: referralId });

        if (!refUser) {
            res.status(400);
            throw new Error('Sorry, referred user not found');
        }
    }

    const user = await User.create({
        name,
        phone,
        email,
        password,
        wallet: referralId ? 200 : 0
    });

    if (refUser && referralId) {
        refUser.wallet = 200;
        refUser.referralNum = refUser.referralNum + 1;
        await refUser.save();
    }

    if (user)
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            isAdmin: user.isAdmin,
            wallet: user.wallet,
            address: user.address,
            referralNum: user.referralNum,
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
        await user.save();

        res.json({ message: 'Password successfuly changed, Please Login.' });
    } catch (err) {
        console.error(err);
        res.status(401);
        throw new Error('OTP Varification failed');
    }
});


// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            $or: [
                {
                    name: {
                        $regex: req.query.keyword,
                        $options: 'i'
                    }
                },
                {
                    email: {
                        $regex: req.query.keyword,
                        $options: 'i'
                    }
                }
            ]
        }
        : {};

    const count = await User.countDocuments({ ...keyword });
    const users = await User.find({ ...keyword })
        .select('-password')
        .limit(pageSize)
        .skip((page - 1) * pageSize);

    if (!users) {
        res.status(404);
        throw new Error('Users not found');
    }

    res.status(200).json({
        users,
        page,
        pages: Math.ceil(count / pageSize)
    });
});




// @desc    Get user by id
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// @desc    Delete user
// @route   GET /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        const wishlist = Wishlist.find({ user: user._id });

        if (wishlist)
            await wishlist.remove();

        await user.remove();
        res.status(204).json({});
    } else {
        res.status(404);
        throw new Error('Users not found');
    }
});


// @desc    To update the profile of the user by admin.
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.isAdmin = req.body.isAdmin;
        user.isBlocked = req.body.isBlocked;

        const updateUser = await user.save();
        return res.json({
            _id: updateUser._id,
            name: updateUser.name,
            phone: updateUser.phone,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
            isBlocked: updateUser.isBlocked
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// @desc    To the save user address
// @route   PUT /api/users/address
// @access  Private
export const saveAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.address.push({
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        postalCode: req.body.postalCode,
        contry: req.body.contry,
    });

    await user.save();
    res.json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        wallet: user.wallet,
        address: user.address,
        isAdmin: user.isAdmin,
        referralNum: user.referralNum,
        wishlistCount: user.wishlistCount,
        token: generateToken(user._id)
    });
});


// @desc    To the update user address
// @route   PUT /api/users/address
// @access  Private
export const updateAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (req.query.delete)
        user.address = user.address.filter(add => add._id.toString() !== req.query.id);
    else
        user.address = user.address.map(add => {
            if (add._id.toString() === req.query.id) {
                add.phone = req.body.phone;
                add.address = req.body.address;
                add.city = req.body.city;
                add.postalCode = req.body.postalCode;
                add.contry = req.body.contry;
            }

            return add;
        });

    await user.save();
    res.json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        wallet: user.wallet,
        address: user.address,
        isAdmin: user.isAdmin,
        referralNum: user.referralNum,
        wishlistCount: user.wishlistCount,
        token: generateToken(user._id)
    });
});
