import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalButton } from 'react-paypal-button-v2';

import axios from 'axios';
import Message from '../components/Message';
import Loader from '../components/Loader';
import CheckoutSteps from '../components/CheckoutSteps';
import Price from '../components/Price';
import { createOrder, resetCreateOrder } from '../actions/orderActions';
import { showErrorAlert, showSuccessAlert } from '../actions/mainAlertActions';
import { STATIC_BASE_URL } from '../constants/staticContants';
import Meta from '../components/Meta';
import { logout } from '../actions/userActions';

const PlaceOrderScreen = () => {
    const { userLogin: { userInfo }, cart, orderCreate } = useSelector(state => state);
    const { shippingAddress, paymentMethod, cartItems } = cart;
    const { loading, error, success, order } = orderCreate;

    const dispatch = useDispatch();
    const redirect = useNavigate();
    const [sdkReady, setSdkReady] = useState(false);
    const [coupon, setCoupon] = useState('');
    const [payLoading, setPayLoading] = useState(false);
    const [walletChecked, setWalletChecked] = useState(false);
    const [couponStatus, setCouponStatus] = useState({
        loading: false,
        couponUsed: false,
        coupon: {
            discount: 0
        }
    });

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    cart.itemsPrice = addDecimals(cartItems.reduce((acc, item) =>
        acc + item.price * item.qty, 0)
    );
    cart.totalPrice = Number(cartItems.reduce((acc, item) =>
        acc + parseFloat(item.qty) * (parseFloat(item.price) - (parseFloat(item.price) * (parseFloat(item.discount) / 100)))
        , 0)).toFixed(2) - couponStatus.coupon.discount - (walletChecked ? userInfo.wallet : 0);

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
        
        if (couponStatus.couponUsed)
            order.appiedCoupon = couponStatus.coupon;
        
        if (walletChecked)
            order.wallet = userInfo.wallet;

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
                resolve(script);
            };
            script.onerror = () => {
                resolve(script);
            };
            document.body.appendChild(script);
        });
    };

    const successHandler = (result) => {
        const paymentResult = {
            id: result.id,
            status: result.status,
            update_time: result.update_time,
            email_address: result.payer.email_address
        };
        console.log(paymentResult);
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!coupon)
            return dispatch(showErrorAlert('Please enter a coupon code'));

        try {
            setCouponStatus((prev) => { return { ...prev, loading: true }; });

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.get(`/api/coupons/${coupon}`, config);
            setCouponStatus((prev) => {
                return {
                    ...prev,
                    loading: false,
                    couponUsed: true,
                    coupon: data
                };
            });
        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;

            if (message === 'Not authorized, token failed') {
                dispatch(logout());
            }
            dispatch(showErrorAlert(message));
        }
    };

    useEffect(() => {
        if (!userInfo)
            redirect('/login');

        if (!paymentMethod)
            redirect('/shipping');

        if (success)
            redirect(`/order/${order._id}`);

        if (paymentMethod === 'PayPal') {
            const addPayPalScrip = async () => {
                const { data: clientId } = await axios.get('/api/config/paypal');
                const script = document.createElement('script');
                script.type = 'text/javascript';

                script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=INR`;
                script.async = true;
                script.onerror = (e) => {
                    console.log(e);
                };
                script.onload = () => setSdkReady(true);
                document.body.appendChild(script);
            };

            if (!window.paypal) {
                addPayPalScrip();
            }
            else
                setSdkReady(true);
        }
        if (paymentMethod === 'Razorpay') {
            loadScript("https://checkout.razorpay.com/v1/checkout.js")
                .then(() => setSdkReady(true));
        }

        // eslint-disable-next-line
    }, [userInfo, redirect, paymentMethod]);

    useEffect(() => {
        document.title = 'Order Payment | UnityShop';

        return () => dispatch(resetCreateOrder());
    }, [dispatch]);

    return (
        <>
            <Meta title='Place Your order | UnityShop' />
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
                                                        <Image src={`${STATIC_BASE_URL}${item.image}`} alt={item.name} fluid />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col md={4} className='text-end'>
                                                        {item.qty} x{' '}
                                                        {/* <span style={{ display: 'inline-block' }}>
                                                            <Price price={(parseFloat(item.price) - (parseFloat(item.price) * (parseFloat(item.discount) / 100)))} />
                                                        </span> */}
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
                                                            <Price price={parseFloat(item.qty) * (parseFloat(item.price) - (parseFloat(item.price) * (parseFloat(item.discount) / 100)))} />
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

                        <ListGroup.Item className='border-0 border-bottom'>
                            <Form onSubmit={(e) => e.preventDefault()}>
                                <Form.Group controlId='wallet' className='mt-2 mb-2'>
                                    <Form.Check
                                        type='checkbox'
                                        label={<>Wallet amount <Price price={userInfo.wallet} /></>}
                                        name='wallet'
                                        checked={walletChecked}
                                        onChange={(e) => setWalletChecked(e.target.checked)}
                                        className='rounded-2' />
                                </Form.Group>
                            </Form>
                        </ListGroup.Item>

                        <ListGroup.Item className='border-0 border-bottom'>
                            {couponStatus.couponUsed
                                ? <>
                                    <h5 className='text-success letter-spacing-1 text-center m-0'>
                                        '{couponStatus.coupon.coupon}' is appied
                                    </h5>
                                    <div
                                        style={{
                                            cursor: 'pointer',
                                            userSelect: 'none'
                                        }}
                                        onClick={() => {
                                            setCouponStatus({
                                                loading: false,
                                                couponUsed: false,
                                                coupon: {
                                                    discount: 0
                                                }
                                            });
                                        }}
                                        className='text-danger text-end w-100'>
                                        Clear Coupon
                                    </div>
                                </>
                                : <Form onSubmit={submitHandler}>
                                    <Form.Group controlId='coupon' >
                                        <Form.Label
                                            className='text-secondary'
                                            style={{ whiteSpace: 'nowrap' }}>
                                            Coupon Code
                                        </Form.Label>
                                        <Form.Control
                                            type='text'
                                            name='coupon'
                                            placeholder='Coupon'
                                            value={coupon}
                                            onChange={(e) => {
                                                setCoupon(e.target.value.trim().toUpperCase());
                                            }}
                                            className='border bg-light rounded us-input'
                                            style={{ textTransform: 'uppercase' }} />
                                    </Form.Group>
                                    <div className='d-flex justify-content-end align-items-center w-100'>
                                        <Form.Group controlId='coupon' >
                                            <Form.Control
                                                type='submit'
                                                value='Submit'
                                                className='border rounded us-btn-outline mt-1'
                                                style={{ width: 'fit-content' }} />
                                        </Form.Group>
                                    </div>
                                </Form>}
                        </ListGroup.Item>
                        {cartItems.length === 0
                            ? <Message>
                                Nothing to pay <Link to='/'>Go Back</Link>
                            </Message>
                            : <ListGroup.Item className='border-0 pt-3'>
                                {error && <Message variant='danger'>{error}</Message>}
                                {loading && <Loader width='30px' height='30px' />}
                                {paymentMethod === 'COD'
                                    ? (
                                        <>
                                            <CodBtn
                                                placeOrderHandler={placeOrderHandler} />
                                        </>
                                    )
                                    : !sdkReady
                                        ? <Loader height='30px' width='30px' />
                                        : paymentMethod === 'PayPal'
                                            ? (
                                                <>
                                                    <PayPalButton
                                                        amount={cart.totalPrice}
                                                        onSuccess={successHandler}
                                                        onError={() => { console.log('errorHander'); }}
                                                        currency='INR' />
                                                </>
                                            )
                                            : (
                                                <>
                                                    <Razorpay
                                                        razorpayHandler={razorpayHandler} />
                                                </>
                                            )}
                            </ListGroup.Item>
                        }
                    </Card>
                </Col>
            </Row>
        </>
    );
};

const Razorpay = ({ razorpayHandler }) => {
    return (
        <>
            <Button type='submit' onClick={razorpayHandler}
                variant='dark'
                className='us-btn mt-1'
                style={{ padding: '0.3rem 2.5rem' }}>
                Continue with Razorpay
            </Button>
        </>
    );
};

// const Paypal = ({ cart }) => {
//     const successHandler = (result) => {
//         const paymentResult = {
//             id: result.id,
//             status: result.status,
//             update_time: result.update_time,
//             email_address: result.payer.email_address
//         };
//         console.log(paymentResult);
//     };
//     return (
//         <>
//             <PayPalButton
//                 amount={cart.totalPrice}
//                 onSuccess={successHandler}
//                 onError={() => { console.log('errorHander'); }}
//                 currency='INR' />
//         </>
//     );
// };

const CodBtn = ({ placeOrderHandler }) => {
    return (
        <>
            <Button
                type='button'
                className='btn-block us-btn'
                onClick={() => placeOrderHandler()}>
                Place Order
            </Button>
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
