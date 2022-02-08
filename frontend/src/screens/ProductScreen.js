import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Card, Button, Form, Image } from 'react-bootstrap';

import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import InnerImageZoom from 'react-inner-image-zoom';

import Rating from '../components/Rating';
import Price from '../components/Price';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
    getOneProducts,
    removeProduct,
    reviewProduct
} from '../actions/productActions';
import { STATIC_BASE_URL } from '../constants/staticContants';
import { showErrorAlert } from '../actions/mainAlertActions';
import Meta from '../components/Meta';

const ProductScreen = () => {
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [imgPreview, setImgPreview] = useState('');
    const [alreadyReviewed, setAlreadyRviewed] = useState(false);

    const { userInfo } = useSelector(state => state.userLogin);
    const { loading, product, error } = useSelector(state => state.productDetails);
    const { loading: reviewLoading, error: reviewError } = useSelector(state => state.productReview);


    const brandOffer = product.brand
        ? product.brand.offers.find(offer =>
            !offer.isDeleted && new Date(offer.expireAt) > new Date(now()))
        : 0;
    const discount = brandOffer ? brandOffer.discount : product.discount;

    const { id } = useParams();
    const dispatch = useDispatch();
    const redirect = useNavigate();

    const addToCartHandler = () => {
        redirect(`/cart/${id}?qty=${qty}`);
    };

    const addReviewHandler = (e) => {
        e.preventDefault();
        if (!rating)
            return dispatch(showErrorAlert('Please choose a rating.'));

        dispatch(reviewProduct(id, { rating, comment }));
    };

    useEffect(() => {
        dispatch(getOneProducts(id));
        return () => dispatch(removeProduct());
    }, [dispatch, id]);

    useEffect(() => {
        if (product.image)
            setImgPreview(product.image[0]);

        if (userInfo && product.reviews.some(review => review.user === userInfo._id))
            setAlreadyRviewed(true);
    }, [product, userInfo]);

    useEffect(() => {
        if (loading)
            document.title = `Loading... | UnityShop`;
        else if (error)
            document.title = `Error | UnityShop`;
        else
            document.title = `${product.name ? product.name : ''} | UnityShop`;
    }, [product, loading, error]);

    return (
        <>
            {loading
                ? <Meta title='Loading... | UnityShop' />
                : error
                    ? <Meta title='Error | UnityShop' />
                    : <Meta title={`${product.name ? product.name : ''} | UnityShop`} />}
            <Link to='/'>
                Go Back
            </Link>
            {loading
                ? <Loader />
                : error
                    ? <Message variant='danger'>{error}</Message>
                    : <>
                        <Row className='mt-3 gx-4 gy-2 d-flex justify-content-center'>
                            <Col lg={4} md={8}>
                                <Col md={12} className="bg-white shadow rounded-2 p-2 d-flex justify-content-center">
                                    <InnerImageZoom
                                        src={imgPreview ? `${STATIC_BASE_URL}${imgPreview}` : ''}
                                        zoomSrc={imgPreview ? `${STATIC_BASE_URL}${imgPreview}` : ''}
                                        fullscreenOnMobile={false}
                                        hasSpacer={true}
                                        zoomScale={1.5}
                                        moveType='pan'
                                        zoomType='hover'
                                        hideHint={true}
                                        fadeDuration={280}
                                        className='p-2' />
                                    {/* <div className='p-2 showImagePreview'>
                                        <Image src={imgPreview ? `${STATIC_BASE_URL}${imgPreview}` : ''} />
                                    </div> */}
                                </Col>

                                <Col
                                    md={12}
                                    className="bg-white shadow rounded-2 d-flex mt-2">
                                    {product.image && product.image.map(img =>
                                        <div
                                            className='position-relative p-2 px-3'
                                            key={img}
                                            style={{
                                                cursor: 'pointer',
                                                height: 'fit-content'
                                            }}
                                            onClick={() => setImgPreview(img)}>

                                            <Image src={`${STATIC_BASE_URL}${img}`} height={60} />
                                        </div>)}
                                </Col>
                            </Col>
                            <Col xl={5} lg={5} md={8}>
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
                                        className='d-flex jutify-content-center letter-spacing-1 p-1'>
                                        <span
                                            className='py-1'
                                            style={{ fontWeight: '600' }}>
                                            Brand : {product.brand ? product.brand.name : ''}
                                        </span>

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
                            <Col xl={3} lg={3} md={8}>
                                <Card className="bg-white shadow rounded-2 border-0 py-2">
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item className='border-bottom-1'>
                                            <Row>
                                                <Col xs={4}>Price:</Col>
                                                <Col xs={8} as='div' className='letter-spacing-1 d-flex d-lg-block' style={{ fontSize: '20px' }}>
                                                    {discount
                                                        ? (
                                                            <>
                                                                <h2 className='product-price transi'>
                                                                    <Price price={product.price - (product.price * (discount / 100))} />
                                                                </h2>
                                                                <del
                                                                    className='product-price text-secondary transi px-2 px-lg-0  d-flex align-items-center'
                                                                    style={{ fontSize: '12px' }}>
                                                                    <Price price={product.price} />
                                                                </del>
                                                            </>)
                                                        : <h2 className='product-price transi'>
                                                            <Price price={product.price} />
                                                        </h2>}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item className='border-bottom-1'>
                                            <Row>
                                                <Col xs={4}>Status:</Col>
                                                <Col xs={8}>
                                                    {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {product.countInStock > 0 && (
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col xs={4}>Qty</Col>
                                                    <Col xs={8}>
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
                        </Row>
                        <Row className='mt-4 justify-content-lg-start justify-content-center'>
                            <Col lg={6} md={8}>
                                <h6 className='letter-spacing-1 p-0' style={{ fontSize: '20px' }}>
                                    Reviews
                                </h6>
                                {product.reviews.length === 0 && <Message>No Reviews</Message>}
                                <ListGroup variant='flush'>
                                    {product.reviews.map(review => (
                                        <ListGroup.Item
                                            className='shadow rounded-2 border-0 mt-2'
                                            key={review.user}>
                                            <span className='d-flex'>
                                                <strong style={{
                                                    marginRight: '0.5rem'
                                                }}>{review.name}</strong>
                                                <Rating value={review.rating} />
                                            </span>

                                            <p className='m-0'>Reviewed At: ({review.createdAt.substring(0, 10)})</p>
                                            <p className='my-2'>{review.comment}</p>
                                        </ListGroup.Item>
                                    ))}
                                    <ListGroup.Item
                                        className='border-0 mt-2 shadow rounded-2 p-3'>
                                        <h6 className='letter-spacing-1 p-0' style={{ fontSize: '18px' }}>
                                            Write a Customer Review
                                        </h6>
                                        {reviewError && <Message>{reviewError}</Message>}
                                        {alreadyReviewed
                                            ? <Message className='mb-0'>You are already reviewed this product</Message>
                                            : userInfo ?
                                                <Form>
                                                    <Form.Group id='rating'>
                                                        {reviewLoading && <Loader height='30px' width='30px' />}
                                                        <Form.Label>Rating</Form.Label>
                                                        <Form.Select
                                                            className='border rounded-2 mb-2'
                                                            aria-label="Default select example"
                                                            onChange={(e) => setRating(e.target.value)}
                                                            value={rating}
                                                            name='brand'>
                                                            <option value=''>Choose a Rating</option>
                                                            <option value='5'>5 - Exelent</option>
                                                            <option value='4'>4 - Very Good</option>
                                                            <option value='3'>3 - Good</option>
                                                            <option value='2'>2 - Failr</option>
                                                            <option value='1'>1 - Poor</option>
                                                        </Form.Select>
                                                    </Form.Group>

                                                    <Form.Group className='mb-2' controlId="description">
                                                        <Form.Label>Description</Form.Label>
                                                        <Form.Control
                                                            name='description'
                                                            placeholder='Enter your comment on this product.'
                                                            as="textarea"
                                                            rows={3}
                                                            onChange={(e) => setComment(e.target.value)}
                                                            value={comment}
                                                            className='border rounded-2' />
                                                    </Form.Group>
                                                    <Form.Group
                                                        className='d-flex justify-content-end'
                                                        controlId="description">
                                                        <Button
                                                            onClick={addReviewHandler}
                                                            type='submit'
                                                            style={{ width: 'fit-content' }}
                                                            className='us-btn-outline'>
                                                            Submit
                                                        </Button>
                                                    </Form.Group>
                                                </Form>
                                                : <Message className='mb-0'>
                                                    Please{' '}
                                                    <Link to={`/login?redirect=product/${id}`}>Sign In</Link>{' '}
                                                    to write a review
                                                </Message>}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                    </>}
        </>);
};

const now = () => {
    const d = new Date();
    const yy = d.getFullYear();
    const mm = (d.getMonth() + 1 < 10) ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
    const dd = ((d.getDate()) < 10) ? `0${(d.getDate())}` : ((d.getDate()));
    const newDate = `${yy}-${mm}-${dd}`;
    return newDate;
};


export default ProductScreen;
