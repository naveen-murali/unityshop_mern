import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { listMyOrders } from '../actions/orderActions';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Price from '../components/Price';
import Meta from '../components/Meta';

const RegisterScreen = () => {
    const dispatch = useDispatch();
    const redirect = useNavigate();

    const {
        userLogin: { userInfo },
        orderListMine: { orders, loading: ordersLoading, error: ordersError }
    } = useSelector(state => state);


    useEffect(() => {
        if (userInfo)
            dispatch(listMyOrders());
    }, [userInfo, dispatch]);


    useEffect(() => {
        if (!userInfo)
            return redirect('/login');
    }, [userInfo, redirect]);

    return (
        <>
            <Meta title={`${userInfo ? userInfo.name : ''} - Orders | UnityShop`} />
            <Row className='mt-3 g-3 d-flex justify-content-center'>
                <Col xs={12} >
                    <div className="bg-white shadow rounded-2 p-3">
                        <h3 className='letter-spacing-1 m-0' style={{ fontSize: '24px' }}>
                            My orders
                        </h3>
                        {ordersLoading
                            ? <Loader width='50px' height='50px' />
                            : ordersError
                                ? <Message className='m-0 mt-3' variant='danger'>{ordersError}</Message>
                                : !orders.length
                                    ? <Message className='m-0 mt-3'>No orders Yet.. <Link to='/'>Go Back</Link></Message>
                                    : (<>
                                        <Table striped bordered hover responsive
                                            className='table-sm m-0 mt-3'>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>DATE</th>
                                                    <th>TOTAL</th>
                                                    <th>METHOD</th>
                                                    <th>PAID</th>
                                                    <th>DELIVERED</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map(order => (
                                                    <tr key={order._id} style={{ verticalAlign: 'center !important' }}>
                                                        <td>{order._id}</td>
                                                        <td>{order.createdAt.substring(0, 10)}</td>
                                                        <td style={{ display: 'inline-block !important' }}>
                                                            <span style={{ display: 'inline-flex !important' }}>
                                                                <Price price={order.totalPrice} />
                                                            </span>
                                                        </td>
                                                        <td>{order.paymentMethod}</td>
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
                                                        <td >
                                                            <LinkContainer to={`/order/${order._id}`}>
                                                                <Button className='us-btn-outline py-1 btn-sm'>DETAILS</Button>
                                                            </LinkContainer>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </>)}
                    </div>
                </Col>
            </Row>
        </ >
    );
};

export default RegisterScreen;
