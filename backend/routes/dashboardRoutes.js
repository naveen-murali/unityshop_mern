import express from 'express';
const router = express.Router();
import { protect, admin } from '../middlewares/authMiddlewares.js';
import { getDashborardData } from '../controllers/dashboardController.js';

router.route('/')
    .get(protect, admin, getDashborardData);

export default router;