import asyncHandler from 'express-async-handler';
import Brand from '../models/brandModel.js';
import Product from '../models/productModel.js';

const formatDate = (date) => {
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
// @rout    POST /api/products/brands
// @acce    Private/Admin
export const createBrands = asyncHandler(async (req, res, next) => {
    const brands = await Brand.findOne({ name: req.body.name });

    if (brands) {
        res.status(400);
        throw new Error('Brand already exists');
    }

    const newBrands = new Brand({
        name: req.body.name
    });

    const resp = await newBrands.save();
    resp.productCount = 0;

    res.status(201).json({
        _id: resp._id,
        name: resp.name,
        createdAt: resp.createdAt,
        productCount: 0
    });
});


// @desc    Update a Brands
// @rout    PUT /api/products/brands/:id
// @acce    Private/Admin
export const updateBrands = asyncHandler(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
        res.status(400);
        throw new Error('Brand not found');
    }

    brand.name = req.body.name || brand.name;
    brand.isDeleted = req.body.isDeleted;
    console.log(req.body);
    const resp = await brand.save();
    const productCount = await Product.countDocuments({ brand: brand._id });
    await Product.updateMany({ brand: brand._id }, { $set: { isDeleted: req.body.isDeleted || false } });
    res.json({
        _id: resp._id,
        name: resp.name,
        isDeleted: resp.isDeleted,
        createdAt: resp.createdAt,
        productCount
    });
});


// @desc    Getting all the brand a Brands
// @rout    GET /api/products/brands
// @acce    Private/Admin
export const getBrands = asyncHandler(async (req, res, next) => {
    const brands = await Brand.find({});
    const products = await Product.aggregate([
        {
            $group: {
                _id: '$brand',
                productCount: { $sum: 1 }
            }
        }
    ]);

    const newbrands = brands.map(brand => {
        const product = products.find(product => product._id.toString() === brand._id.toString());
        return {
            _id: brand._id,
            name: brand.name,
            isDeleted: brand.isDeleted,
            createdAt: brand.createdAt,
            offers: brand.offers,
            productCount: product ? product.productCount : 0
        };
    });

    res.json(newbrands);
});


// @desc    Add offers to a brand
// @rout    POST /api/products/brands/offers/:id
// @acce    Private/Admin
export const addOffer = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { discount, expireAt } = req.body;

    const brand = await Brand.findById(id);
    if (!brand) {
        res.status(400);
        throw new Error('Brand not found');
    }

    const isOfferExists = brand.offers.some(offer => {
        console.log(typeof offer.expireAt);
        return !offer.isDeleted && offer.expireAt > new Date(now());
    });
    if (isOfferExists) {
        res.status(400);
        throw new Error('Brand already has a offer');
    }

    brand.offers.push({
        discount: Number(discount),
        expireAt: formatDate(expireAt)
    });
    const updatedBrand = await brand.save();

    res.status(201).json(updatedBrand);
});


// @desc    Delete offer in the order
// @rout    DELETE /api/products/brands/offers/:id
// @acce    Private/Admin
export const deleteOffer = asyncHandler(async (req, res, next) => {
    const { id, offerId } = req.params;

    const brand = await Brand.findById(id);
    if (!brand) {
        res.status(400);
        throw new Error('Brand not found');
    }

    brand.offers = brand.offers.map(offer => {
        if (offer._id.toString() === offerId)
            offer.isDeleted = true;

        return offer;
    });

    await brand.save();
    res.status(204).json({});
});