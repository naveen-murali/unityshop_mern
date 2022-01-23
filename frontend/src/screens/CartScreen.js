import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import { addToCart, removeFromCart } from '../actions/cartActions';

import Message from '../components/Message';
import Price from '../components/Price';
import Loader from '../components/Loader';

const CartScreen = () => {
    const redirect = useNavigate();
    const dispatch = useDispatch();
    const { cartItems, loading } = useSelector(state => state.cart);
    const { id } = useParams();
    const qty = useSearchParams()[0].get('qty');

    useEffect(() => {
        if (id && qty)
            dispatch(addToCart(id, qty));
    }, [dispatch, id, qty]);

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
        redirect('/cart');
    };

    const checkoutHandler = () => {
        redirect('/login?redirect=shipping');
    };

    useEffect(() => {
        document.title = 'Cart User | UnityShop';
    }, []);


    if (loading)
        return <Loader />;

    return (
        <Row className='mt-3'>
            <Col lg={8}>
                <h3 className='py-2 letter-spacing-1' style={{ fontSize: '20px' }}>
                    Shopping Cart
                </h3>
                {cartItems.length === 0
                    ? <Message>
                        Your cart is empty <Link to='/'>Go Back</Link>
                    </Message>
                    : (<ListGroup variant='flush'>
                        {cartItems.map((item) =>
                            <ListGroup.Item key={item.product} className='shadow rounded-2 mb-3'>
                                <Row className='justify-content-between align-items-center'>
                                    <Col md={2} xs={4}>
                                        <Image src={item.image} alt={item.name} fluid rounded style={{ height: '100px' }} />
                                    </Col>

                                    <Col md={5} xs={8} className='d-flex flex-column align-items-start m-0 letter-spacing-0'>
                                        <Col md={3} as='h4'
                                            className='m-0 letter-spacing-1 d-inline-block w-100 pb-2'
                                            style={{ textTransform: 'capitalize', fontWeight: '400' }}>
                                            <Link to={`/product/${item.product}`}>
                                                {item.name}
                                            </Link>
                                        </Col>
                                        <Col md={2} as='h4' className='m-0 letter-spacing-1 d-inline-block w-100'>
                                            <Price price={item.price} />
                                        </Col>
                                    </Col>

                                    <Col md={2} xs={3}>
                                        <Form.Select aria-label="Default select example"
                                            as='select' className="form-select border py-1 px-3 rounded-1"
                                            value={item.qty}
                                            onChange={(e) =>
                                                dispatch(
                                                    addToCart(item.product, Number(e.target.value), false)
                                                )}>
                                            {[...Array(item.countInStock).keys()].map(
                                                (x) =>
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>)}
                                        </Form.Select>
                                    </Col>

                                    <Col md={2} xs={3}>
                                        <Button
                                            type='button' variant='light' style={{ width: 'fit-content' }}
                                            onClick={() => removeFromCartHandler(item.product)}>
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>)}
                    </ListGroup>)}
            </Col>

            <Col lg={4} md={6}>
                <Card className='border-0'>
                    <Card.Body className='shadow rounded-2'>
                        <Card.Title>
                            <h4 className='letter-spacing-1' style={{ fontWeight: '400' }}>
                                Subtotal
                                <span className='mx-2' style={{ fontWeight: '600', fontSize: '22px' }}>
                                    {cartItems.reduce((acc, item) => acc + parseInt(item.qty), 0)}
                                </span>
                                items
                            </h4>
                        </Card.Title>

                        <Card.Title className='border-bottom py-2'>
                            <h4 className='letter-spacing-1'>
                                <Price price={cartItems.reduce((acc, item) =>
                                    acc + parseFloat(item.qty) * parseFloat(item.price), 0)} />
                            </h4>
                        </Card.Title>

                        <Card.Text>
                            <Button
                                type='button'
                                className='btn-block us-btn'
                                disabled={cartItems.length === 0}
                                onClick={checkoutHandler}>
                                Proceed To Checkout
                            </Button>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default CartScreen;
