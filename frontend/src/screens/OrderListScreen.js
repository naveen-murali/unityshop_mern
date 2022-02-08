import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders } from '../actions/orderActions';
import { useNavigate, useParams } from 'react-router-dom';

import ErrorScreen from './ErrorScreen';
import Paginate from '../components/Pagniate';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Price from '../components/Price';
import Meta from '../components/Meta';

const OrderListScreen = () => {
    const dispatch = useDispatch();
    const redirect = useNavigate();
    const { pageNumber } = useParams();
    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders, pages, page } = orderList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (userInfo && userInfo.isAdmin)
            dispatch(listOrders(pageNumber));
    }, [dispatch, redirect, userInfo, pageNumber]);

    if (!userInfo || !userInfo.isAdmin)
        return <ErrorScreen />;

    return (
        <>
            <Meta title='User List | UnityShop' />
            <div className='bg-white shadow border-2 rounded-2 mt-3 p-3'>
                <div className="col-12">
                    <h3 className='letter-spacing-1 m-0' style={{ fontSize: '24px' }}>
                        Orders
                    </h3>
                </div>
                {loading && !orders.length
                    ? <Loader />
                    : !orders.length
                        ? <Message variant='danger' className='mt-2 mb-0'>Your order collection is empty</Message>
                        : error
                            ? <Message variant='danger' className='mt-2 mb-0'>{error}</Message>
                            : (<>
                                <Table bordered hover responsive
                                    className='table-sm m-0 mt-3'>
                                    <thead>
                                        <tr className="table-active border">
                                            <th>ID</th>
                                            <th>USER</th>
                                            <th>DATE</th>
                                            <th>TOTAL</th>
                                            <th>PAID</th>
                                            <th>DELEIVERD</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order._id} style={{ verticalAlign: 'center !important' }}>
                                                <td>{order._id}</td>
                                                <td>
                                                    <span style={{ whiteSpace: 'nowrap' }}>
                                                        {order.user && order.user.name}
                                                    </span>
                                                </td>
                                                <td>{order.createdAt.substring(0, 10)}</td>
                                                <td>
                                                    <Price
                                                        price={order.totalPrice} />
                                                </td>
                                                {/* <td>
                                                    {order.isPaid
                                                        ? (<span style={{ whiteSpace: 'nowrap' }}>
                                                            {order.paidAt.substring(0, 10)}
                                                        </span>)
                                                        : (<i className='fas fa-times' style={{ color: 'red' }}></i>)}
                                                </td>
                                                <td>
                                                    {order.isDeliverd
                                                        ? (<span style={{ whiteSpace: 'nowrap' }}>
                                                            {order.deliverdAt.substring(0, 10)}
                                                        </span>)
                                                        : (<i className='fas fa-times' style={{ color: 'red' }}></i>)}
                                                </td> */}

                                                {order.isCancelled
                                                    ? <td colSpan={2} className='text-center' style={{ verticalAlign: 'center !important' }}>
                                                        <h5 className='text-danger m-0'>CANCELLED</h5>
                                                    </td>
                                                    : <>
                                                        <td>
                                                            {order.isPaid
                                                                ? order.paidAt.substring(0, 10)
                                                                : <i className='fas fa-times text-danger'></i>}
                                                        </td>
                                                        <td>
                                                            {order.isDelivered
                                                                ? order.deliveredAt.substring(0, 10)
                                                                : <i className='fas fa-times text-danger'></i>}
                                                        </td>
                                                    </>}
                                                <td>
                                                    <LinkContainer
                                                        to={`/order/${order._id}`}
                                                        className=''>
                                                        <Button
                                                            variant='light'
                                                            className='us-edit-btn border'>
                                                            details
                                                        </Button>
                                                    </LinkContainer>
                                                </td>
                                            </tr>))}
                                    </tbody>
                                </Table>
                                <Col
                                    xs={12}
                                    style={{ height: 'fit-content !important' }}
                                    className='d-flex justify-content-end mt-3'>
                                    <Paginate
                                        page={page}
                                        pages={pages}
                                        path='/admin/orderList' />
                                </Col>
                            </>)}
            </div>
        </>
    );
};

export default OrderListScreen;
