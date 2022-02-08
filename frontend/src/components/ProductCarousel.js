import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Carousel, Col, Container, Image, Row } from 'react-bootstrap';
import { listTopProduct } from '../actions/productActions';
import { STATIC_BASE_URL } from '../constants/staticContants';
import Loader from './Loader';
import Message from './Message';
import Price from './Price';

const ProductCarousel = () => {
    const dispatch = useDispatch();

    const { loading, error, products } = useSelector(state => state.productTopRatted);

    useEffect(() => {
        dispatch(listTopProduct());
    }, [dispatch]);

    return (
        <>
            {loading && !products.length
                ? <Loader />
                : error
                    ? <Message variant='danger'>{error}</Message>
                    : (<>
                        <Carousel pause='hover' className='p-5 rounded-2 bg-dark'>
                            {products.map(product =>
                                <Carousel.Item key={product._id}>
                                    <Link to={`/product/${product._id}`}>
                                        <Container>
                                            <Row className='g-2 justify-content-center'>
                                                <Col md={4} className='p-3 bg-white mr-1 rounded-2' style={{ width: 'fit-content' }}>
                                                    <Image
                                                        src={`${STATIC_BASE_URL}${product.image[0]}`}
                                                        alt={product.name}
                                                        fluid
                                                        style={{
                                                            width: "200px",
                                                            height: '250px'
                                                        }} />
                                                </Col>
                                                <Col md={6} className='bg-light d-flex flex-column ml-1 rounded-2'>
                                                    {/* <Carousel.Caption className='carousel-caption'> */}
                                                    <div className='m-auto text-center'>
                                                        <h4 className='letter-spacing-1'>{product.name}</h4>
                                                        <h4 className='letter-spacing-1'><Price price={product.price} /></h4>
                                                    </div>
                                                    {/* </Carousel.Caption> */}
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Link>
                                </Carousel.Item>)}
                        </Carousel>
                    </>)}

        </>
    );
};

export default ProductCarousel;
