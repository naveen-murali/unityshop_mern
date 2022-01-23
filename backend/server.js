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

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));


app.use('/api/products', PRODUCTS_ROUTES);
app.use('/api/users', USERS_ROUTES);
app.use('/api/orders', ORDERS_ROUTES);

app.get('/api/config/paypal', (req, res) =>
    res.send(process.env.PAYPAL_CLIENT_ID)
);

app.use(notFound);
app.use(errorHandler);

app.listen(
    PORT,
    console.log('\n---------------------------------------------------------------------------------\n',
        `Server running in ${process.env.NODE_ENV} mode on [ http://localhost:3000 ]`.yellow.bold)
);