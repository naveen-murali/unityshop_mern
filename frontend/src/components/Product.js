import React, { useRef } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { addToCart } from '../actions/cartActions';
import Rating from './Rating';
import Price from './Price';
import { removeFromWishlist } from '../actions/wishlistActions';

const Product = ({ product, wishlist = false, addToWishlistHandler }) => {
    const dispatch = useDispatch();
    const span = useRef();
    const button = useRef();

    const hovering = () =>
        span.current.style.top = '2%';
    const clearHovering = () =>
        span.current.style.top = `-20%`;

    return (
        <Card className='product-card p-3 rounded shadow h-100 position-relative'

            style={{ overflow: 'hidden', minWidth: '250px' }}
            onMouseEnter={wishlist ? () => { } : hovering}
            onMouseLeave={wishlist ? () => { } : clearHovering}>
            <Link to={`/product/${product._id}`} className='p-2 d-flex align-items-center justify-content-center'>
                <Card.Img src={product.image} style={{ width: "200px", height: '249.3px' }} variant='top' />
            </Link>

            <Card.Body
                className="px-2 py-0 pt-2 d-flex transi flex-column align-items-sart justify-content-between">
                <Link to={`/product/${product._id}`} className='transi'>
                    <Card.Title as='div' className='transi'>
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>

                <Card.Text as='div' className='transi'>
                    <Rating
                        value={product.rating}
                        text={`${product.numReviews} reviews`}
                    />
                </Card.Text>

                <Card.Text as='h2' className="pt-2 product-price transi" style={{ fontWeight: "700" }}>
                    <Price price={product.price} />
                </Card.Text>

                <Card.Text as='h2' className="product-cart-btn transi" style={{ fontWeight: "700" }}>
                    <Button className='us-btn'
                        onClick={() => {
                            wishlist && dispatch(removeFromWishlist(product._id, product.name));
                            dispatch(addToCart(product._id, 1));
                        }}>
                        add to cart
                    </Button>
                </Card.Text>

                {wishlist &&
                    <Card.Text as='h2' className="product-cart-btn" style={{ fontWeight: "700" }}>
                        <Button className='btn-danger us-btn-danger-outline'
                            onClick={() => dispatch(removeFromWishlist(product._id, product.name))}>
                            remove
                        </Button>
                    </Card.Text>}

                {!wishlist &&
                    <span ref={span} className='us-wishList'>
                        <button ref={button}
                            style={{ color: '#8E8BF5' }}
                            onClick={() => addToWishlistHandler(product._id, product.name)}>
                            <i className="far fa-heart"></i>
                        </button>
                    </span>}
            </Card.Body>
        </Card>
    );
};

export default Product;