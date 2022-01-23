import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, ListGroup, Card, Button, Container, Form } from 'react-bootstrap';

import Rating from '../components/Rating';
import Price from '../components/Price';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getOneProducts, removeProduct } from '../actions/productActions';

const ProductScreen = () => {
    const [qty, setQty] = useState(1);
    const { id } = useParams();
    const { loading, product, error } = useSelector(state => state.productDetails);
    const dispatch = useDispatch();
    const redirect = useNavigate();

    useEffect(() => {
        dispatch(getOneProducts(id));
        return () => dispatch(removeProduct());
    }, [dispatch, id]);

    const addToCartHandler = () => {
        redirect(`/cart/${id}?qty=${qty}`);
    };

    useEffect(() => {
        document.title = `${product.name ? product.name : ''} | UnityShop`;
    }, [product.name]);

    return (
        <>
            <Link to='/'>
                Go Back
            </Link>
            {loading
                ? <Loader />
                : error
                    ? <Message variant='danger'>{error}</Message>
                    : <Row className='mt-3 gx-4 gy-2 d-flex justify-content-center'>
                        <Col xl={3} lg={3} md={8}>
                            <Container fluid className="bg-white shadow rounded-2 p-4 d-flex justify-content-center">
                                <Image src={product.image} fluid className='p-2' />
                            </Container>
                        </Col>
                        <Col xl={6} lg={5} md={8}>
                            <ListGroup variant='flush' className="bg-white shadow rounded-2 p-4">
                                <ListGroup.Item
                                    className='d-flex align-items-center jutify-content-center letter-spacing-1 border-0 m-0 p-1'
                                    style={{ textTransform: 'capitalize' }}
                                    as="h4">
                                    {product.name}
                                </ListGroup.Item>
                                <ListGroup.Item className='d-flex align-items-center jutify-content-center border-0 p-1'>
                                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                                </ListGroup.Item>
                                <ListGroup.Item
                                    className='d-flex align-items-center jutify-content-center border-0 letter-spacing-1 p-1'>
                                    <span style={{ fontWeight: '600' }}>Price :</span>

                                    <h5
                                        style={{ fontSize: '18px' }}
                                        className='m-0 letter-spacing-1 mx-2'>
                                        <Price price={product.price} />
                                    </h5>
                                </ListGroup.Item>
                                <ListGroup.Item
                                    className='d-flex flex-column jutify-content-center letter-spacing-1 p-1'>
                                    <span
                                        className='py-1'
                                        style={{ fontWeight: '600' }}>
                                        Description :
                                    </span>
                                    {product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col xl={3} lg={4} md={8}>
                            <Card className="bg-white shadow rounded-2 border-0 py-2">
                                <ListGroup variant='flush'>
                                    <ListGroup.Item className='border-bottom-1'>
                                        <Row>
                                            <Col xs={5}>
                                                Price:
                                            </Col>
                                            <Col xs={7} as='h4' className='letter-spacing-1' style={{ fontSize: '20px' }}>
                                                <Price price={product.price} />
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item className='border-bottom-1'>
                                        <Row>
                                            <Col xs={5}>Status:</Col>
                                            <Col xs={7}>
                                                {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col xs={5}>Qty</Col>
                                                <Col xs={7}>
                                                    <Form.Select aria-label="Default select example"
                                                        as='select' className="form-select border py-2 px-4"
                                                        value={qty}
                                                        onChange={(e) => setQty(e.target.value)}>
                                                        {[...Array(product.countInStock).keys()].map(
                                                            (x) => (
                                                                <option key={x + 1} value={x + 1}>
                                                                    {x + 1}
                                                                </option>
                                                            )
                                                        )}
                                                    </Form.Select>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}

                                    <ListGroup.Item>
                                        <Button onClick={addToCartHandler}
                                            className='btn-block w-100 us-btn mt-2'
                                            type='button'
                                            disabled={product.countInStock === 0}>
                                            Add To Cart
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>}

        </>);
};

export default ProductScreen;
