import React, { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { listProducts } from '../actions/productActions';
import { addToWishlist } from '../actions/wishlistActions';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Pagniate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {
    const dispatch = useDispatch();
    const redirect = useNavigate();
    const { keyword, pageNumber = 1 } = useParams();

    const { products, pages, page, loading, error } = useSelector(state => state.productList);
    const { userInfo } = useSelector(state => state.userLogin);

    const addToWishlistHandler = (id, name) => {
        if (!userInfo)
            return redirect(`/login?redirect=wishlist?data=${id}-${name}`);

        return dispatch(addToWishlist(id, name));
    };

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber));
    }, [dispatch, keyword, pageNumber]);

    return (
        <>
            <Meta />
            {!keyword
                ? <ProductCarousel />
                : <Link to='/'>Go Back</Link>}
            <h3
                className='py-2 letter-spacing-1 mt-3'
                style={{
                    fontSize: '20px'
                }}>
                Products
            </h3>

            {loading
                ? <Loader />
                : error
                    ? <Message variant='danger'>{error}</Message>
                    : <>
                        <Row className="gy-4">
                            {products && products.map(product => (
                                <Col key={product._id} className='product-col' xs={12} sm={6} md={6} lg={4} xl={3}>
                                    <Product
                                        product={product}
                                        addToWishlistHandler={addToWishlistHandler} />
                                </Col>
                            ))}
                        </Row>
                        <Col xs={12} className='d-flex justify-content-end mt-5'>
                            <Paginate
                                page={page}
                                pages={pages}
                                path={keyword ? `/search/${keyword}` : ''} />
                        </Col>
                    </>
            }
        </>
    );
};

export default HomeScreen;
