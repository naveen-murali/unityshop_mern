import asyncHandler from 'express-async-handler';
import Coupon from '../models/couponModel.js';


const dateFormatter = (date) => {
    const newDate = new Date(date);
    newDate.setUTCHours(23);
    newDate.setUTCMinutes(59);
    newDate.setUTCSeconds(59);
    newDate.setUTCMilliseconds(999);
    return newDate;
};

const now = () => {
    const d = new Date();
    const yy = d.getFullYear();
    const mm = (d.getMonth() + 1 < 10) ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
    const dd = ((d.getDate()) < 10) ? `0${(d.getDate())}` : ((d.getDate()));
    const newDate = `${yy}-${mm}-${dd}`;
    return newDate;
};

// @desc    Creating a Brands
// @rout    POST /api/coupons
// @acce    Private/Admin
export const createCoupon = asyncHandler(async (req, res, next) => {
    const couponExist = await Coupon.findOne({
        coupon: req.body.coupon,
        expireAt: { $gt: new Date() },
        isDeleted: false
    });
    if (couponExist) {
        res.status(400);
        throw new Error('Valied coupon is already exists');
    }

    const coupon = new Coupon({
        user: req.user._id,
        coupon: req.body.coupon,
        discount: req.body.discount,
        expireAt: dateFormatter(req.body.expireAt)
    });
    const createdCoupon = await coupon.save();

    res.status(201).json(createdCoupon);
});


// @desc    Get all coupon
// @rout    GET /api/coupons
// @acce    Private/Admin
export const getAllCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await Coupon.find({});
    if (!coupon) {
        res.status(400);
        throw new Error('Coupons not found');
    }

    res.json(coupon);
});


// @desc    Delete offer in the order
// @rout    DELETE /api/coupons/:coupon
// @acce    Private/Admin
export const deleteCoupon = asyncHandler(async (req, res, next) => {
    const { coupon } = req.params;

    const couponFound = await Coupon.findById(coupon);
    if (!couponFound) {
        res.status(400);
        throw new Error('Coupon not found');
    }

    couponFound.isDeleted = true;

    await couponFound.save();
    res.status(204).json({});
});


// @desc    Get one coupon
// @rout    GET /api/coupons/:coupon
// @acce    Private
export const getCoupon = asyncHandler(async (req, res, next) => {
    const { coupon } = req.params;

    const couponFound = await Coupon.findOne({
        coupon,
        isDeleted: false,
        expireAt: {
            $gt: now()
        }
    });
    if (!couponFound) {
        res.status(400);
        throw new Error('Coupon not found');
    }

    const alreadyUsed = couponFound.usedBy.some(user => user.toString() === req.user._id.toString());
    if (alreadyUsed) {
        res.status(400);
        throw new Error('You have already used the coupon');
    }

    res.json({
        _id: couponFound._id,
        coupon: couponFound.coupon,
        discount: couponFound.discount
    });
});
