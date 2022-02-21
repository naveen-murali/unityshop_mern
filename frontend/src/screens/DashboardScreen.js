import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Bar, BarChart, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie } from 'recharts';
import { getDashboardData } from '../actions/dashboardActions';
import numeral from 'numeral';
import moment from 'moment';

import ErrorScreen from './ErrorScreen';
import Meta from '../components/Meta';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Price from '../components/Price';

const numberFormatter = (item) => numeral(item).format("0,0");
const dateFormatter = (item) => moment(new Date(item)).format("MMM DD");

const DashboardScreen = () => {
    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const dashboard = useSelector((state) => state.dashboard);
    const {
        loading,
        error,
        thisWeekOrders: data,
        allOrders,
        newOrders,
        allUsers,
        newUsers,
        brandStatus,
        totalRevenue,
        todaysRevenue
    } = dashboard;

    useEffect(() => {
        if (userInfo && userInfo.isAdmin)
            dispatch(getDashboardData());
    }, [dispatch, userInfo]);

    if (!userInfo || !userInfo.isAdmin)
        return <ErrorScreen />;

    return (
        <>
            <Row className='g-3 mt-4'>
                {loading && !data.length
                    ? <>
                        <Meta title='Loading...' />
                        <Loader />
                    </>
                    : error
                        ? <>
                            <Meta title='Error | UnityShop' />
                            <Message variant='danger'>{error}</Message>
                        </>
                        : <>
                            <Meta title='Dashboard - Admin | UnityShop' />
                            <Col md={3} xs={12}>
                                <div className='border-1 rounded-2 shadow p-3 bg-white d-flex flex-column align-items-center justify-content-center'>
                                    <h5 className='letter-spacing-1'>New Users</h5>
                                    <p className='m-0'>{newUsers}</p>
                                </div>
                            </Col>
                            <Col md={3} xs={12}>
                                <div className='border-1 rounded-2 shadow p-3 bg-white d-flex flex-column align-items-center justify-content-center'>
                                    <h5 className='letter-spacing-1'>Total Users</h5>
                                    <p className='m-0'>{allUsers}</p>
                                </div>
                            </Col>
                            <Col md={3} xs={12}>
                                <div className='border-1 rounded-2 shadow p-3 bg-white d-flex flex-column align-items-center justify-content-center'>
                                    <h5 className='letter-spacing-1'>New Orders</h5>
                                    <p className='m-0'>{newOrders}</p>
                                </div>
                            </Col>
                            <Col md={3} xs={12}>
                                <div className='border-1 rounded-2 shadow p-3 bg-white d-flex flex-column align-items-center justify-content-center'>
                                    <h5 className='letter-spacing-1'>Total Orders</h5>
                                    <p className='m-0'>{allOrders}</p>
                                </div>
                            </Col>
                            <Col md={6} xs={12}>
                                <div className='border-1 rounded-2 shadow p-3 bg-white d-flex flex-column align-items-center justify-content-center'>
                                    <h5 className='letter-spacing-1'>Monthly Sales</h5>
                                    <Price price={totalRevenue} />
                                </div>
                            </Col>
                            <Col md={6} xs={12}>
                                <div className='border-1 rounded-2 shadow p-3 bg-white d-flex flex-column align-items-center justify-content-center'>
                                    <h5 className='letter-spacing-1'>Today's Sales</h5>
                                    <Price price={todaysRevenue} />
                                </div>
                            </Col>
                            <Col lg={5}>
                                <div
                                    className='bg-white shadow rounded-2 py-4'>
                                    <h3 className='letter-spacing-1 px-4 mb-4' style={{ fontSize: '24px' }}>
                                        Brand Details
                                    </h3>
                                    <ResponsiveContainer
                                        width="100%"
                                        minHeight={380}
                                        className='d-flex align-items-center justify-content-center'>
                                        <PieChart>
                                            <Pie
                                                data={brandStatus}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({
                                                    cx,
                                                    cy,
                                                    midAngle,
                                                    innerRadius,
                                                    outerRadius,
                                                    value,
                                                    index
                                                }) => {
                                                    const RADIAN = Math.PI / 180;
                                                    // eslint-disable-next-line
                                                    const radius = 25 + innerRadius + (outerRadius - innerRadius);
                                                    // eslint-disable-next-line
                                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                    // eslint-disable-next-line
                                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                                    return (
                                                        <text
                                                            x={x}
                                                            y={y}
                                                            fill="#8884d8"
                                                            textAnchor={x > cx ? "start" : "end"}
                                                            dominantBaseline="central"
                                                        >
                                                            {brandStatus[index].name} ({value})
                                                        </text>
                                                    );
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Col>
                            <Col lg={7}>
                                <div
                                    className='bg-white shadow rounded-2 py-4'>
                                    <h3 className='letter-spacing-1 px-4 mb-4' style={{ fontSize: '24px' }}>
                                        Orders
                                    </h3>
                                    <ResponsiveContainer minHeight={380}>
                                        <BarChart data={data}>

                                            <XAxis
                                                tickFormatter={dateFormatter}
                                                dataKey="createdAt" />
                                            <YAxis
                                                tickFormatter={numberFormatter} />

                                            <Bar
                                                stackId="a"
                                                dataKey="createdOrders"
                                                name="Created Orders"
                                                fill="#7DB3FF" />
                                            <Bar
                                                stackId="a"
                                                dataKey="deliverd"
                                                name="Delivered"
                                                fill="#49457B" />

                                            <Legend />
                                            <Tooltip
                                                formatter={numberFormatter} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Col>
                        </>}
            </Row>
        </>
    );
};

export default DashboardScreen;
