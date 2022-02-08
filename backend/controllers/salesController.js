import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

const fromDate = (date) => {
    const d = new Date(date);
    d.setUTCHours(0);
    d.setUTCMinutes(0);
    d.setUTCSeconds(0);
    d.setUTCMilliseconds(0);

    return d;
};
const toDate = (date) => {
    const d = new Date(date);
    d.setUTCHours(23);
    d.setUTCMinutes(59);
    d.setUTCSeconds(59);
    d.setUTCMilliseconds(999);

    return d;
};

// @desc    Getting one order
// @rout    GET /api/sales
// @acce    Private
export const getSalesReport = asyncHandler(async (req, res, next) => {
    const condition = (req.query.from && req.query.to)
        ? {
            deliveredAt: {
                $gte: fromDate(req.query.from),
                $lte: toDate(req.query.to)
            },
            isDelivered: true
        }
        : { isDelivered: true };


    const sales = await Order.find(condition)
        .populate({
            path: 'orderItems.product',
            select: 'name brand',
            populate: {
                path: 'brand',
                select: 'name'
            }
        })
        .select('-shippingAddress -paymentResult')
        .sort({ createdAt: -1 });

    if (!sales) {
        res.status(404);
        throw new Error('Order Not found');
    }

    res.json(sales);
});