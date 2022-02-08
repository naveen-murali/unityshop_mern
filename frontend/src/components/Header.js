import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, Badge, DropdownButton, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../actions/userActions';
import SearchBox from './SearchBox';

const Header = () => {
    const { cart, userLogin } = useSelector(state => state);
    const { cartItems } = cart;
    const { userInfo } = userLogin;
    const disapatch = useDispatch();
    const redirect = useNavigate();
    const { keyword } = useParams();

    const logoutHandler = () => {
        disapatch(logout());
    };

    const enterKeyword = (keyword) => {
        if (!keyword)
            return redirect('/');
        redirect(`/search/${keyword}`);
    };

    return (
        <header className='bg-white'>
            <Navbar bg='white' variant='' expand='lg' collapseOnSelect
                className="shadow p-0">
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand className="brand-text">
                            Unity<span>S</span>hop
                        </Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls='basic-navbar-nav' className='p-2 border rounded-1'>
                        <i className="fas fa-bars us-navToggler"></i>
                    </Navbar.Toggle>
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <SearchBox
                            initialValue={keyword || ''}
                            enterKeyword={enterKeyword} />
                        <Nav style={{ margin: "0 0 0 auto" }}>
                            {userInfo
                                && (<>
                                    <LinkContainer to="/wishlist" >
                                        <Nav.Link className='mx-lg-2 py-auto'>
                                            <OverlayTrigger
                                                placement='bottom'
                                                overlay={<Tooltip className='rounded-2 d-md-block d-none' id='tooltip-bottom'>
                                                    <strong className='rounded-2'>Wishlist</strong>
                                                </Tooltip>}>
                                                <span className='position-relative'>
                                                    <i className="fas fa-heart"></i>
                                                    {userInfo.wishlistCount > 0 && <Badge pill bg="warning" text="light"
                                                        className='position-absolute shadow' style={{ top: '-40%', right: '-80%' }} >
                                                        {userInfo.wishlistCount}
                                                    </Badge>}
                                                </span>
                                            </OverlayTrigger>
                                        </Nav.Link>
                                    </LinkContainer>
                                </>)}

                            <LinkContainer to="/cart" >
                                <Nav.Link className='mx-lg-2 py-auto'>
                                    <OverlayTrigger className='rounded-2'
                                        placement='bottom'
                                        overlay={<Tooltip className='rounded-2 d-md-block' id='tooltip-bottom'>
                                            <strong className='rounded-2'>Cart</strong>
                                        </Tooltip>}>
                                        <span className='position-relative'>
                                            <i className='fas fa-shopping-cart px-0'></i>
                                            Cart
                                            {cartItems.length > 0 && <Badge pill bg="warning" text="light"
                                                className='position-absolute shadow' style={{ top: '-30%', right: '-20%' }} >
                                                {cartItems.length}
                                            </Badge>}
                                        </span>
                                    </OverlayTrigger>
                                </Nav.Link>
                            </LinkContainer>

                            {userInfo
                                ? (<>
                                    <DropdownButton align="end"
                                        title={userInfo.name}
                                        id="dropdown-menu-align-end"
                                        className='text-dark nav-drop prfile py-lg-0 py-3 us-ml'>
                                        <LinkContainer to="/profile">
                                            <Dropdown.Item>Profile</Dropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to="/myOrders">
                                            <Dropdown.Item>My Orders</Dropdown.Item>
                                        </LinkContainer>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={logoutHandler}>LogOut</Dropdown.Item>
                                    </DropdownButton>
                                </>)
                                : <LinkContainer to="/login" className='us-ml'>
                                    <Nav.Link>
                                        <i className='fas fa-user px-1'></i>
                                        Sign In
                                    </Nav.Link>
                                </LinkContainer>}

                            {userInfo && userInfo.isAdmin
                                && (<DropdownButton align="end"
                                    title='ADMIN'
                                    id="dropdown-menu-align-end"
                                    className='text-dark nav-drop prfile admin py-lg-0 py-3 us-ml'>
                                    <LinkContainer to="/admin/dashboard">
                                        <Dropdown.Item>Dashboard</Dropdown.Item>
                                    </LinkContainer>
                                    <Dropdown.Divider />
                                    <LinkContainer to="/admin/userList">
                                        <Dropdown.Item>User List</Dropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/productList">
                                        <Dropdown.Item>Product List</Dropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/orderList">
                                        <Dropdown.Item>Order List</Dropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/brandList">
                                        <Dropdown.Item>Brand List</Dropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/salesList">
                                        <Dropdown.Item>Sales List</Dropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/offers">
                                        <Dropdown.Item>Offers</Dropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/coupons">
                                        <Dropdown.Item>Coupons</Dropdown.Item>
                                    </LinkContainer>
                                </DropdownButton>)}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header >
    );
};

export default Header;
