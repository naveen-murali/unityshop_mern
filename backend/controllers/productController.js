import asyncHandler from 'express-async-handler';
import Brand from '../models/brandModel.js';
import Product from "../models/productModel.js";


// @desc    Fetch all the products
// @rout    GET /api/products
// @acce    public
export const getProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find({}).populate("brand", "name");
    res.status(200).json(products);
});


// @desc    Fetch single products
// @rout    GET /api/products/:id
// @acce    public
export const getProductById = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate("brand", "name");
    if (product)
        return res.json(product);

    res.status(404);
    throw new Error('Product not found');
});