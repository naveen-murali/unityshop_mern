import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { addToWishlist, getWishlist } from '../actions/wishlistActions';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const WhishlistScreen = () => {
    const { wishlistItems, loading, error } = useSelector(state => state.wishlist);
    const { userInfo } = useSelector(state => state.userLogin);
    const dispatch = useDispatch();
    const redirect = useNavigate();
    const [query] = useSearchParams();
    const redir = query.get('data') || null;

    useEffect(() => {
        if (!userInfo)
            redirect('/login?redirect=wishlist');

        if (redir) {
            const [id, product] = redir.split('-');
            dispatch(addToWishlist(id, product));
            return redirect('/wishlist');
        }

        dispatch(getWishlist());
    }, [dispatch, userInfo, redirect, redir]);

    useEffect(() => {
        document.title = 'Wishlist | UnityShop';
    }, []);

    return (
        <>
            <h3 className='py-2 letter-spacing-1' style={{ fontSize: '20px' }}>
                Wishlist
            </h3>
            {loading && wishlistItems.length === 0
                ? <Loader />
                : error
                    ? <Message variant='danger'>{error}</Message>
                    : (
                        <>
                            {wishlistItems.length === 0
                                && <Message>
                                    Your wishlist is empty <Link to='/'>Go Back</Link>
                                </Message>}
                            <Row className="gy-4">
                                {wishlistItems && wishlistItems.map(product => (
                                    <Col key={product._id} className='product-col' xs={12} sm={6} md={6} lg={4} xl={3}>
                                        <Product
                                            product={product}
                                            wishlist />
                                    </Col>))}
                            </Row>
                        </>)
            }
        </>
    );
};

export default WhishlistScreen;
