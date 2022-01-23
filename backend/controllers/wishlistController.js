import asyncHandler from 'express-async-handler';
import Wishlist from '../models/whishlistModel.js';
import Whislist from "../models/whishlistModel.js";


// @desc    Adding wishlist of a user
// @rout    PUT /api/wishlists
// @acce    Private
export const addToWishlists = asyncHandler(async (req, res, next) => {
    const id = req.user._id;
    let wishlist = await Whislist.findOne({ user: id });

    if (!wishlist)
        wishlist = new Wishlist({
            user: id, wishlistItems: [req.body.id]
        });
    else if (wishlist.wishlistItems.find(item => item.toString() === req.body.id)) {
        res.status(400);
        throw new Error('Already added to the wishlist');
    }
    else
        wishlist.wishlistItems.push(req.body.id);

    const savedWishlist = await wishlist.save();
    // console.log(savedWishlist);

    res.json(savedWishlist);
});


// @desc    Adding wishlist of a user
// @rout    DELETE /api/wishlists?id=<id>
// @acce    Private
export const removeFromWishlists = asyncHandler(async (req, res, next) => {
    const id = req.user._id;
    let wishlist = await Whislist.findOne({ user: id });

    if (!wishlist) {
        res.status(400);
        throw new Error('You have nothing in your wishlist to delete.');
    }
    else if (!wishlist.wishlistItems.find(item => item.toString() === req.query.id)) {
        res.status(400);
        throw new Error('No such a product exist on the wishlist.');
    }

    wishlist.wishlistItems = wishlist.wishlistItems
        .filter(item => item.toString() !== req.query.id);

    await wishlist.save();

    res.status(204).json({});
});


// @desc    Getting wishlist of a user
// @rout    GET /api/wishlists
// @acce    Private
export const getWishlists = asyncHandler(async (req, res, next) => {
    const id = req.user._id;

    let wishlist = await Wishlist.findOne({ user: id })
        .populate({
            path: 'wishlistItems',
            select: 'name image price numReviews brand',
            populate: {
                path: 'brand',
                select: 'name'
            }
        }).select('wishlistItems');

    if (!wishlist)
        wishlist = {
            wishlistItems: []
        };

    res.json(wishlist.wishlistItems);
});