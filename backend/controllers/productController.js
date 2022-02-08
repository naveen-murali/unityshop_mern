import asyncHandler from 'express-async-handler';
import Brand from '../models/brandModel.js';
import Product from "../models/productModel.js";


// @desc    Fetch all the products
// @rout    GET /api/products
// @acce    Public
export const getProducts = asyncHandler(async (req, res, next) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        }
        : {
            name: {
                $regex: '',
                $options: 'i'
            }
        };

    const condition = {
        ...keyword,
        $or: [
            {
                isDeleted: { $exists: false }
            },
            {
                isDeleted: false
            }
        ],
    };

    const count = await Product.countDocuments(condition);
    const products = await Product.find(condition)
        .populate({
            path: 'brand',
            select: 'name isDeleted offers',
            match: {
                $or: [
                    {
                        isDeleted: { $exists: false }
                    },
                    {
                        isDeleted: false
                    }
                ]
            }
        })
        .select('-isDeleted')
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip((page - 1) * pageSize);

    res.status(200).json({
        products,
        page,
        pages: Math.ceil(count / pageSize)
    });
});


// @desc    Fetch single products
// @rout    GET /api/products/:id
// @acce    Public
export const getProductById = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate("brand", "name offers");
    if (product)
        return res.json(product);

    res.status(404);
    throw new Error('Product not found');
});


// @desc    Fetch all the products
// @rout    GET /api/admin/products
// @acce    Private/Admin
export const getProductsAdmin = asyncHandler(async (req, res, next) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        }
        : {
            name: {
                $regex: '',
                $options: 'i'
            }
        };

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .populate("brand", "name")
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip((page - 1) * pageSize);

    res.status(200).json({
        products,
        page,
        pages: Math.ceil(count / pageSize)
    });
});


// @desc    Delete product from the inventory
// @rout    DELETE /api/products/admin/:id
// @acce    Private/Admin
export const deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    product.isDeleted = true;
    await product.save();

    return res.status(204).json({});
});


// @desc    Creating a product
// @rout    POST /api/products
// @acce    Private/Admin
export const createProduct = asyncHandler(async (req, res, next) => {
    const productDetails = req.body;
    productDetails.user = req.user._id;
    productDetails.image = req.files.map(file => file.path);

    const product = new Product(productDetails);
    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
});


// @desc    Update a product
// @rout    put /api/products/:id
// @acce    Private/Admin
export const updateProduct = asyncHandler(async (req, res, next) => {
    const {
        name,
        price,
        brand,
        description,
        isDeleted,
        image,
        countInStock,
        discount
    } = req.body;

    const product = await Product.findById(req.params.id)
        .populate('brand', 'isDeleted');

    if (product.brand.isDeleted && (isDeleted !== product.isDeleted)) {
        res.status(400);
        throw new Error('Can not change the delete status, because brand is deleted.');
    }

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    product.name = name;
    product.price = price;
    product.brand = brand;
    product.image = image;
    product.discount = discount || 0;
    product.isDeleted = isDeleted;
    product.description = description;
    product.countInStock = countInStock;
    const updatedProduct = await product.save();

    res.status(201).json(updatedProduct);
});


// @desc    Create new review
// @rout    put /api/products/:id/reviews
// @acce    Private
export const reiveiwProduct = asyncHandler(async (req, res, next) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const alreadyReviewed = product.reviews.find(review =>
        review.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
        res.status(400);
        throw new Error('You already reviewed the product.');
    }

    const newReview = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    };
    product.reviews.push(newReview);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, review) =>
        acc + review.rating, 0) / product.numReviews;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
});


// @desc    Fetch the top ratted products
// @rout    GET /api/products/top
// @acce    Public
export const getTopProduct = asyncHandler(async (req, res, next) => {
    const products = await Product.find({
        $or: [
            {
                isDeleted: { $exists: false }
            },
            {
                isDeleted: false
            }
        ]
    })
        .populate({
            path: 'brand',
            select: 'name',
            match: {
                $or: [
                    {
                        isDeleted: { $exists: false }
                    },
                    {
                        isDeleted: false
                    }
                ]
            }
        })
        .select('-isDeleted')
        .sort({ rating: -1 })
        .limit(3);

    res.status(200).json(products);
});
