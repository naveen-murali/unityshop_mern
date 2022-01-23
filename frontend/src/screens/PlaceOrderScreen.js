import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Message from '../components/Message';
import Loader from '../components/Loader';
import CheckoutSteps from '../components/CheckoutSteps';
import Price from '../components/Price';
import { createOrder } from '../actions/orderActions';
import { showSuccessAlert } from '../actions/mainAlertActions';

const PlaceOrderScreen = () => {
    const { userLogin: { userInfo }, cart, orderCreate } = useSelector(state => state);
    const { shippingAddress, paymentMethod, cartItems } = cart;
    const { loading, error, success, order } = orderCreate;
    const dispatch = useDispatch();
    const redirect = useNavigate();
    const [sdkReady, setSdkReady] = useState(false);
    const [payLoading, setPayLoading] = useState(false);

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    cart.itemsPrice = addDecimals(cartItems.reduce((acc, item) =>
        acc + item.price * item.qty, 0)
    );
    cart.totalPrice = Number(cart.itemsPrice).toFixed(2);

    const placeOrderHandler = (paymentResult) => {
        const order = {
            orderItems: cartItems,
            shippingAddress,
            paymentMethod,
            itemsPrice: Number(cart.itemsPrice),
            totalPrice: Number(cart.totalPrice)
        };
        if (paymentMethod !== 'COD')
            order.paymentResult = paymentResult;

        setPayLoading(false);
        dispatch(createOrder(order));
    };


    const razorpayHandler = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        try {
            setPayLoading(true);
            const { data } = await axios.post('/api/orders/razorpay',
                { totalPrice: Number(cart.totalPrice) }, config);

            const options = {
                key: data.key,
                currency: data.currency,
                amount: data.amount,
                name: userInfo.name,
                description: `Order payment of ${userInfo.name} at ${Date.now()}`,
                order_id: data.id,
                handler: function (response) {
                    const paymentResult = {
                        update_time: Date.now(),
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    };

                    placeOrderHandler(paymentResult);
                },
                prefill: {
                    name: userInfo.name,
                    email: userInfo.email,
                    contact: shippingAddress.phone,
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (err) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            dispatch(showSuccessAlert(message));
        }
    };


    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    useEffect(() => {
        loadScript("https://checkout.razorpay.com/v1/checkout.js")
            .then(setSdkReady(true));
    }, [setSdkReady]);

    useEffect(() => {
        if (!userInfo)
            redirect('/login');

        if (!paymentMethod)
            redirect('/shipping');

        if (success)
            redirect(`/order/${order._id}`);

        // eslint-disable-next-line
    }, [userInfo, redirect, success]);

    useEffect(() => {
        document.title = 'Order Payment | UnityShop';
    }, []);

    return (
        <>
            <div className='mt-3'></div>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row className='mt-3 gy-2 justify-content-center'>
                <Col lg={8} xs={12}>
                    <ListGroup variant='flush' className='bg-white shadow rounded-2 p-2' style={{ overflow: 'hidden' }}>
                        <ListGroup.Item className='py-3'>
                            <h3 className='letter-spacing-1 p-0'
                                style={{ fontSize: '24px' }}>
                                Order summry
                            </h3>
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
                        </ListGroup.Item>
                        <ListGroup.Item className='py-3'>
                            <h3 className='letter-spacing-1 p-0'
                                style={{ fontSize: '24px' }}>
                                Payment Method
                            </h3>
                            <strong className='bold'>Method: </strong>
                            {paymentMethod === 'COD' ? 'Cash On Delivery' : paymentMethod}
                        </ListGroup.Item>
                        <ListGroup.Item className='py-3'>
                            <h3 className='letter-spacing-1 p-0'
                                style={{ fontSize: '24px' }}>
                                Order Items
                            </h3>
                            {cartItems.length === 0
                                ? <Message>Your cart is empty</Message>
                                : (
                                    <ListGroup variant='flash'>
                                        {cartItems.map(item => (
                                            <ListGroup.Item key={item.product} className='mt-1 border rounded-2'>
                                                <Row className='d-flex justify-content-between w-100 align-items-center' >
                                                    <Col lg={1} xs={2}>
                                                        <Image src={item.image} alt={item.name} fluid />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col md={4} className='text-end'>
                                                        {item.qty} x{' '}
                                                        <span style={{ display: 'inline-block' }}>
                                                            <Price price={item.price} />
                                                        </span>{' '}
                                                        ={' '}
                                                        <span style={{ display: 'inline-block' }}>
                                                            <Price price={item.qty * item.price} />
                                                        </span>{' '}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
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
                                    <Price price={cart.itemsPrice} />
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item className='border-0 border-bottom'>
                            <Row>
                                <Col>Total</Col>
                                <Col>
                                    <Price price={cart.totalPrice} />
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        {cartItems.length === 0
                            ? <Message>
                                Nothing to pay <Link to='/'>Go Back</Link>
                            </Message>
                            : paymentMethod === 'COD'
                                ? <ListGroup.Item className='border-0 pt-3'>
                                    {loading
                                        ? <Loader width='30px' height='30px' />
                                        : (
                                            <>
                                                {error && <Message variant='danger'>{error}</Message>}
                                                <Button
                                                    type='button'
                                                    className='btn-block us-btn'
                                                    onClick={() => placeOrderHandler()}>
                                                    Place Order
                                                </Button>
                                            </>)}
                                </ListGroup.Item>
                                : !sdkReady
                                    ? <Loader width='30px' height='30px' />
                                    : <ListGroup.Item className='border-0 pt-3'>
                                        {loading || payLoading
                                            ? <Loader width='30px' height='30px' />
                                            : (
                                                <>
                                                    {error && <Message variant='danger'>{error}</Message>}
                                                    <Button type='submit' onClick={razorpayHandler}
                                                        variant='dark'
                                                        className='us-btn mt-1'
                                                        style={{ padding: '0.3rem 2.5rem' }}>
                                                        Continue with Razorpay
                                                    </Button>
                                                </>)}
                                    </ListGroup.Item>}
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default PlaceOrderScreen;




// const addPayPalScrip = async () => {
//     const { data: clientId } = await axios.get('/api/config/paypal');
//     const script = document.createElement('script');
//     script.type = 'text/javascript';
//     script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=INR`;
//     script.async = true;
//     script.onload = () => setSdkReady(true);
//     document.body.appendChild(script);
// };

// if (!window.paypal) {
//     console.log('hihi');
//     addPayPalScrip();
// }
// else
//     setSdkReady(true);

// paymentMethod === 'PayPal'
//     ? <ListGroup.Item className='border-0 pt-3'>
//         {!sdkReady
//             ? <Loader width='30px' height='30px' />
//             : <PayPalButton
//                 amount={cart.totalPrice}
//                 onSuccess={paySuccessHandler}
//                 onError={errorHander}
//                 currency='INR' />}
//     </ListGroup.Item>
//     :; 


// import { ORDER_CREATE_RESET } from '../constants/orderConstants';
// import { USER_DETAILS_RESET } from '../constants/userConstants';

// cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
// cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
// cart.totalPrice = (
//     Number(cart.itemsPrice) +  Number(cart.shippingPrice)
// ).toFixed(2);

// {/* <ListGroup.Item className='border-0 border-bottom'>
//     <Row>
//         <Col>Shipping</Col>
//         <Col>
//             <Price price={cart.shippingPrice} />
//         </Col>
//     </Row>
// </ListGroup.Item>; */}