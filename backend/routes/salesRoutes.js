import express from 'express';
const router = express.Router();
import { getSalesReport } from '../controllers/salesController.js';
import { protect, admin } from '../middlewares/authMiddlewares.js';

router.route('/')
    .get(protect, admin, getSalesReport);

export default router;