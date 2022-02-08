import React, { useRef } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { STATIC_BASE_URL } from '../constants/staticContants';
import { addToCart } from '../actions/cartActions';
import { removeFromWishlist } from '../actions/wishlistActions';
import Rating from './Rating';
import Price from './Price';

const Product = ({ product, wishlist = false, addToWishlistHandler }) => {
    const dispatch = useDispatch();
    const span = useRef();
    const button = useRef();

    const brandOffer = product.brand.offers ? product.brand.offers.find(offer =>
        !offer.isDeleted && new Date(offer.expireAt) > new Date(now())) : 0;
    const discount = brandOffer ? brandOffer.discount : product.discount;

    const hovering = () =>
        span.current.style.top = '2%';
    const clearHovering = () =>
        span.current.style.top = `-20%`;

    return (
        <Card className='product-card p-3 rounded shadow h-100 position-relative'
            style={{
                overflow: 'hidden',
                minWidth: '250px'
            }}
            onMouseEnter={wishlist ? () => { } : hovering}
            onMouseLeave={wishlist ? () => { } : clearHovering}>
            <Link to={`/product/${product._id}`} className='p-2 d-flex align-items-center justify-content-center'>
                <Card.Img
                    src={`${STATIC_BASE_URL}${product.image[0]}`}
                    style={{
                        width: "200px",
                        height: '250px'
                    }}
                    variant='top' />
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

                <Card.Text as='div' className="pt-2 d-flex transi" style={{ fontWeight: "700" }}>
                    {discount
                        ? (
                            <>
                                <h2 className='product-price transi'>
                                    <Price price={product.price - (product.price * (discount / 100))} />
                                </h2>
                                <del
                                    className='product-price transi px-2 d-flex align-items-center'
                                    style={{ fontSize: '12px' }}>
                                    <Price price={product.price} />
                                </del>
                            </>)
                        : <h2 className='product-price transi'>
                            <Price price={product.price} />
                        </h2>}
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
        </Card >
    );
};

const now = () => {
    const d = new Date();
    const yy = d.getFullYear();
    const mm = (d.getMonth() + 1 < 10) ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
    const dd = ((d.getDate()) < 10) ? `0${(d.getDate())}` : ((d.getDate()));
    const newDate = `${yy}-${mm}-${dd}`;
    return newDate;
};

export default Product;