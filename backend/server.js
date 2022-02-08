import path from 'path';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';

// local modules
import { errorHandler, notFound } from './middlewares/errorMiddlewares.js';
import { connectDB } from "./config/db.js";
import { createClient } from './config/twilio.js';
import { setRazorpay } from './config/razorpay.js';

dotenv.config({ path: '.env' });
connectDB();
createClient();
setRazorpay();

import PRODUCTS_ROUTES from './routes/productRoutes.js';
import USERS_ROUTES from './routes/userRoutes.js';
import ORDERS_ROUTES from './routes/orderRoutes.js';
import UPLOAD_ROUTES from './routes/uploadRoutes.js';
import SALES_ROUTES from './routes/salesRoutes.js';
import COUPON_ROUTES from './routes/couponRoutes.js';
import DASHBOARD_ROUTES from './routes/dashboardRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));


app.use('/api/products', PRODUCTS_ROUTES);
app.use('/api/users', USERS_ROUTES);
app.use('/api/orders', ORDERS_ROUTES);
app.use('/api/sales', SALES_ROUTES);
app.use('/api/coupons', COUPON_ROUTES);
app.use('/api/dashboard', DASHBOARD_ROUTES);
app.use('/api/uploads', UPLOAD_ROUTES);

app.get('/api/config/paypal', (req, res) =>
    res.send(process.env.PAYPAL_CLIENT_ID)
);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
} else {
    app.get('/', (req, res) => {
        res.send('API is running....');
    });
}

app.use(notFound);
app.use(errorHandler);

app.listen(
    PORT,
    console.log('\n---------------------------------------------------------------------------------\n',
        `Server running in ${process.env.NODE_ENV} mode on [ http://localhost:3000 ]`.yellow.bold)
);