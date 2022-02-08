import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

const getDate = (index = 0) => {
    const date = new Date();
    return date.setDate(date.getDate() - index);
};
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

// @desc    Getting datas for dashboard
// @rout    GET /api/dashboard
// @acce    Private/Admin
export const getDashborardData = asyncHandler(async (req, res, next) => {
    const week = new Array(7);
    const thisWeekOrders = [];

    for (let i = 0; i < week.length; i++) {
        const date = getDate(i);
        const weelkyOrder = {};
        weelkyOrder.createdAt = fromDate(date);
        weelkyOrder.createdOrders = await Order.countDocuments({
            createdAt: {
                $gte: fromDate(date),
                $lte: toDate(date)
            }
        });
        weelkyOrder.deliverd = await Order.countDocuments({
            deliveredAt: {
                $gte: fromDate(date),
                $lte: toDate(date)
            },
        });

        thisWeekOrders.push(weelkyOrder);
    }
    thisWeekOrders.reverse();

    const [
        allOrders,
        newOrders,
        allUsers,
        newUsers,
        brandStatus,
        totalRevenue,
        todaysRevenue
    ] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({
            createdAt: {
                $gte: fromDate(getDate()),
                $lte: toDate(getDate())
            },
        }),
        User.countDocuments(),
        User.countDocuments({
            createdAt: {
                $gte: fromDate(getDate()),
                $lte: toDate(getDate())
            },
        }),
        Product.aggregate([
            {
                $lookup: {
                    from: 'brands',
                    foreignField: '_id',
                    localField: 'brand',
                    as: 'brand'
                }
            },
            {
                $unwind: '$brand'
            },
            {
                $group: {
                    _id: {
                        name: '$brand.name'
                    },
                    value: { $sum: 1 }
                }
            },
            {
                $project: {
                    name: '$_id.name',
                    value: 1
                }
            }
        ]),
        Order.aggregate([
            {
                $match: {
                    deliveredAt: {
                        $gte: fromDate(getDate(7)),
                        $lte: toDate(getDate(0))
                    },
                    isDelivered: true
                }
            },
            {
                $group: {
                    _id: true,
                    totalRevenue: {
                        $sum: '$totalPrice'
                    }
                }
            }
        ]),
        Order.aggregate([
            {
                $match: {
                    deliveredAt: {
                        $gte: fromDate(getDate(0)),
                        $lte: toDate(getDate(0))
                    },
                    isDelivered: true
                }
            },
            {
                $group: {
                    _id: true,
                    todaysRevenue: {
                        $sum: '$totalPrice'
                    }
                }
            }
        ])
    ]);

    res.json({
        thisWeekOrders,
        allOrders,
        newOrders,
        allUsers,
        newUsers,
        brandStatus,
        totalRevenue: totalRevenue[0] ? totalRevenue[0].totalRevenue : 0,
        todaysRevenue: todaysRevenue[0] ? todaysRevenue[0].todaysRevenue : 0,
    });
});