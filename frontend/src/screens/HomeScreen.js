import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listProducts } from '../actions/productActions';
import { addToWishlist } from '../actions/wishlistActions';

const HomeScreen = () => {
    const { products, loading, error } = useSelector(state => state.productList);
    const { userInfo } = useSelector(state => state.userLogin);
    const dispatch = useDispatch();
    const redirect = useNavigate();

    const addToWishlistHandler = (id, name) => {
        if (!userInfo)
            return redirect(`/login?redirect=wishlist?data=${id}-${name}`);

        return dispatch(addToWishlist(id, name));
    };

    useEffect(() => {
        dispatch(listProducts());
    }, [dispatch]);

    useEffect(() => {
        document.title = 'UnityShop';
    }, []);

    return (
        <>
            <h3 className='py-2 letter-spacing-1' style={{ fontSize: '20px' }}>
                Latest Products
            </h3>

            {loading && products.length === 0
                ? <Loader />
                : error
                    ? <Message variant='danger'>{error}</Message>
                    : <Row className="gy-4">
                        {products && products.map(product => (
                            <Col key={product._id} className='product-col' xs={12} sm={6} md={6} lg={4} xl={3}>
                                <Product product={product}
                                    addToWishlistHandler={addToWishlistHandler} />
                            </Col>
                        ))}
                    </Row>
            }
        </>
    );
};

export default HomeScreen;
