import express from 'express';
const router = express.Router();
import {
    getProducts,
    getProductById,
    deleteProduct,
    getProductsAdmin,
    createProduct,
    updateProduct,
    reiveiwProduct,
    getTopProduct
} from '../controllers/productController.js';
import {
    addOffer,
    deleteOffer,
    getBrands,
    createBrands,
    updateBrands
} from '../controllers/brandController.js';
import { protect, admin } from '../middlewares/authMiddlewares.js';
import { upload } from '../middlewares/multerUpload.js';
import { s3Multiple } from '../middlewares/awsUpload.js';

router
    .route('/')
    .get(getProducts)
    .post(protect, admin, upload.array('image', 3), s3Multiple, createProduct);

router.route('/top')
    .get(getTopProduct);

router.route('/admin')
    .get(protect, admin, getProductsAdmin);

router.route('/brands')
    .get(protect, admin, getBrands)
    .post(protect, admin, createBrands);

router.route('/brands/offers/:id')
    .post(protect, admin, addOffer);
    
router.route('/brands/offers/:id/:offerId')
    .delete(protect, admin, deleteOffer);

router.route('/brands/:id')
    .put(protect, admin, updateBrands);

router.route('/admin/:id')
    .delete(protect, admin, deleteProduct);

router.route('/:id/reviews')
    .put(protect, reiveiwProduct);

router
    .route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .put(protect, admin, deleteProduct);


export default router;