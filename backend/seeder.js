import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Brand from './models/brandModel.js';
import Order from './models/orderModel.js';
import { getOrders } from './data/order.js';
import { connectDB } from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    const orders = getOrders();
    await Order.insertMany(orders);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Brand.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
