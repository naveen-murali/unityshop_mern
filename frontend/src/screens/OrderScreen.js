import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { STATIC_BASE_URL } from '../constants/staticContants';
import {
    getOrder,
    resetOrder,
    cancelMyOrder,
    deliverOrder
} from '../actions/orderActions';

import Message from '../components/Message';
import Loader from '../components/Loader';
import Price from '../components/Price';
import ConfirmAlert from '../components/ConfirmAlert';
import Meta from '../components/Meta';

const OrderScreen = () => {
    const dispatch = useDispatch();
    const redirect = useNavigate();
    const [showConfirm, setShowConfirm] = useState({
        show: false,
        message: ''
    });
    const { id } = useParams();

    const {
        userLogin: { userInfo },
        orderDetails: { order, loading, error },
        cancelMyOrder: { loading: cancelLoading, error: cancelError },
        deliverOrder: { loading: deliverLoading, error: deliverError }
    } = useSelector(state => state);
    const {
        shippingAddress,
        orderItems,
        totalPrice,
        paymentMethod,
        user,
        isCancelled,
        cancelledAt,
        appiedCoupon,
        wallet
    } = order || {};

    const cancelOrder = () => {
        setShowConfirm({
            show: true,
            type: 'cancel',
            message: 'Do you want to cancel this order ?'
        });
    };
    const deliverOrderHander = () => {
        setShowConfirm({
            show: true,
            type: 'deliver',
            message: 'Do you want to mark this order as delivered ?'
        });
    };
    const confirmAction = () => {
        if (showConfirm.type === 'cancel')
            dispatch(cancelMyOrder(id));
        else
            dispatch(deliverOrder(id));

        setShowConfirm((prevData) => {
            return { ...prevData, show: false };
        });
    };
    const cancelAction = () => {
        setShowConfirm((prevData) => {
            return { ...prevData, show: false };
        });
    };

    useEffect(() => {
        if (!order || order._id !== id)
            dispatch(getOrder(id));
    }, [dispatch, order, id]);

    useEffect(() => {
        if (!userInfo)
            redirect('/login');
        // eslint-disable-next-line
    }, [userInfo]);

    useEffect(() => {
        dispatch(getOrder(id));
        return () => dispatch(resetOrder());
    }, [dispatch, id]);

    return (
        <>
            <div className='mt-3'></div>
            {loading
                ? <Loader />
                : error
                    ? <Message variant='danger'>{error}</Message>
                    : (<>
                        <Meta title={`Order - ${order.user ? order.user.name : ''} | UnityShop`} />
                        <Row className='mt-3 gy-2 justify-content-center'>
                            <Col lg={8} xs={12}>
                                <ListGroup variant='flush' className='bg-white shadow rounded-2 p-2' style={{ overflow: 'hidden' }}>
                                    <ListGroup.Item className='py-3'>
                                        <h3 className='letter-spacing-1 p-0'
                                            style={{ fontSize: '24px' }}>
                                            order details
                                        </h3>
                                        <p className='p-0 my-2'>
                                            <strong className='bold'>Name: </strong>{' '}
                                            {user && user.name}
                                        </p>
                                        <p className='p-0 my-2'>
                                            <strong className='bold'>Email: </strong>{' '}

                                            {user && user.email}
                                        </p>
                                        <p className='p-0 my-2'>
                                            <strong className='bold'>Phone: </strong>{' '}
                                            {shippingAddress && shippingAddress.phone}
                                        </p>
                                        <p className='p-0 my-2'>
                                            <strong className='bold'>Address: </strong>{' '}
                                            {shippingAddress && shippingAddress.address},{' '}
                                            {shippingAddress && shippingAddress.city},{' '}
                                            {shippingAddress && shippingAddress.postalCode},{' '}
                                            {shippingAddress && shippingAddress.country}
                                        </p>
                                        <p className='p-0 my-2'>
                                            <strong className='bold'>Delivery Status: </strong>{' '}
                                        </p>
                                        {isCancelled
                                            ? <Message className='m-0 mt-1 rounded-1' variant='danger'>Order is Cancelled At: {cancelledAt}</Message>
                                            : order.isDelivered
                                                ? <Message className='m-0 mt-1 rounded-1'>Deliverd At: {order.deliveredAt}</Message>
                                                : <Message className='m-0 mt-1 rounded-1' variant='danger'>Not Delivered</Message>}
                                    </ListGroup.Item>
                                    <ListGroup.Item className='py-3'>
                                        <h3 className='letter-spacing-1 p-0'
                                            style={{ fontSize: '24px' }}>
                                            Payment Method
                                        </h3>
                                        <strong className='bold'>Method: </strong>
                                        {paymentMethod === 'COD' ? 'Cash On Delivery' : paymentMethod}

                                        {isCancelled
                                            ? <Message className='m-0 mt-1 rounded-1' variant='danger'>Order is Cancelled At: {cancelledAt}</Message>
                                            : order.isPaid
                                                ? <Message className='m-0 mt-1 rounded-1'>Paid At: {order.paidAt}</Message>
                                                : <Message className='m-0 mt-1 rounded-1' variant='danger'>Not Paid</Message>}
                                    </ListGroup.Item>
                                    <ListGroup.Item className='py-3'>
                                        <h3 className='letter-spacing-1 p-0'
                                            style={{ fontSize: '24px' }}>
                                            Order Items
                                        </h3>
                                        <ListGroup variant='flash'>
                                            {orderItems.map(item => (
                                                <ListGroup.Item key={item.product._id} className='mt-1 border rounded-2'>
                                                    <Row className='d-flex justify-content-between w-100 align-items-center' >
                                                        <Col lg={1} xs={2}>
                                                            <Image src={`${STATIC_BASE_URL}${item.product.image[0]}`} alt={item.product.name} fluid />
                                                        </Col>
                                                        <Col>
                                                            <Link to={`/product/${item.product._id}`}>
                                                                {item.product.name}
                                                            </Link>
                                                        </Col>
                                                        <Col md={4} className='text-end'>
                                                            {item.qty} x{' '}

                                                            {!item.discount
                                                                ? <span style={{ display: 'inline-block' }}>
                                                                    <Price price={item.price} />
                                                                </span>
                                                                : <>
                                                                    [<span style={{ display: 'inline-block' }}>
                                                                        <Price price={item.price} />
                                                                    </span>
                                                                    -{' '}
                                                                    <span style={{ display: 'inline-block' }}>
                                                                        <Price price={parseFloat(item.price) * (parseFloat(item.discount) / 100)} />
                                                                    </span>]
                                                                </>}

                                                            {' '}={' '}
                                                            <span style={{ display: 'inline-block' }}>
                                                                {/* <Price price={item.qty * item.price} /> */}
                                                                <Price price={parseFloat(item.qty) * (parseFloat(item.price) - (parseFloat(item.price) * (parseFloat(item.discount) / 100)))} />
                                                            </span>{' '}
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>

                            <Col lg={4} md={7}>
                                <Card className='p-3 border-0 shadow rounded-2'>
                                    <ListGroup variant='flush' className='border-0 border-bottom'>
                                        <h3 className='letter-spacing-1 p-0'
                                            style={{ fontSize: '24px' }}>
                                            Order Summary
                                        </h3>
                                    </ListGroup>
                                    <ListGroup.Item className='border-0 border-bottom'>
                                        <Row>
                                            <Col>Items</Col>
                                            <Col>
                                                <Price price={order.itemsPrice} />
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {appiedCoupon &&
                                        <>
                                            <ListGroup.Item className='border-0 border-bottom'>
                                                <Row>
                                                    <Col>Discount</Col>
                                                    <Col>
                                                        - <Price price={appiedCoupon.discount} />
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        </>}
                                    {wallet !== 0 &&
                                        <>
                                            <ListGroup.Item className='border-0 border-bottom'>
                                                <Row>
                                                    <Col>Wallet</Col>
                                                    <Col>
                                                        - <Price price={wallet} />
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        </>}
                                    <ListGroup.Item className='border-0 border-bottom'>
                                        <Row>
                                            <Col>Total</Col>
                                            <Col>
                                                <Price price={totalPrice} />
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {appiedCoupon &&
                                        <>
                                            <ListGroup.Item className='border-0 border-bottom'>
                                                <h5 className='text-success letter-spacing-1 text-center m-0'>
                                                    '{appiedCoupon.coupon}' is appied
                                                </h5>
                                            </ListGroup.Item>
                                        </>}
                                    {(!order.isDelivered && !isCancelled) && <>
                                        <ListGroup.Item className='border-0 pt-3'>
                                            {cancelLoading ?
                                                <Loader height='30px' width='30px' />
                                                : <>
                                                    {cancelError && <Message variant='danger'>{cancelError}</Message>}
                                                    <Button
                                                        type='button'
                                                        onClick={() => cancelOrder(order._id)}
                                                        className='btn-danger btn-block us-btn-danger letter-spacing-1'>
                                                        Cancel
                                                    </Button>
                                                </>}
                                        </ListGroup.Item>
                                        {userInfo.isAdmin && <ListGroup.Item className='border-0 pt-3'>
                                            {deliverLoading ?
                                                <Loader height='30px' width='30px' />
                                                : <>
                                                    {deliverError && <Message variant='danger'>{deliverError}</Message>}
                                                    <Button
                                                        type='button'
                                                        onClick={() => deliverOrderHander(order._id)}
                                                        className='btn-danger btn-block us-btn-outline letter-spacing-1'>
                                                        Mark As Deliverd
                                                    </Button>
                                                </>}
                                        </ListGroup.Item>}
                                    </>}

                                    {isCancelled && <ListGroup.Item className='border-0 pt-3'>
                                        <h4 className='text-danger m-0 text-center letter-spacing-1'>
                                            ORDER CANCELLED
                                        </h4>
                                    </ListGroup.Item>}
                                </Card>
                            </Col>
                        </Row >
                    </>)}
            <ConfirmAlert
                show={showConfirm.show}
                cancelAction={cancelAction}
                confirmAction={confirmAction}
                message={showConfirm.message} />
        </>);
};

export default OrderScreen;
