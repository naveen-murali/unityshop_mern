import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUser } from '../actions/userActions';
import { Link } from 'react-router-dom';
import ErrorScreen from './ErrorScreen';
import Meta from '../components/Meta';

const UserEditScreen = () => {
    const dispatch = useDispatch();
    const redirect = useNavigate();
    const { id } = useParams();

    const {
        userLogin: { userInfo },
        userDetails: { error, loading, user },
        userUpdate: { error: updateError, loading: updateLoading }
    } = useSelector(state => state);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        isAdmin: false,
        isBlocked: false,
    });
    const { name, email, phone, isAdmin, isBlocked } = formData;

    const inputHandler = (e) => {
        setFormData(prevData => {
            return { ...prevData, [e.target.name]: e.target.checked };
        });
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (user.isAdmin === isAdmin && user.isBlocked === isBlocked)
            return;

        const newUser = {
            id,
            isAdmin,
            isBlocked
        };
        dispatch(updateUser(newUser));
    };

    useEffect(() => {
        if (user)
            setFormData({
                name: user.name,
                phone: user.phone,
                email: user.email,
                isAdmin: user.isAdmin,
                isBlocked: user.isBlocked,
            });
    }, [user, setFormData]);

    useEffect(() => {
        if (!user || user._id !== id)
            dispatch(getUserDetails(id));
    }, [redirect, dispatch, user, id]);


    if (!userInfo || !userInfo.isAdmin)
        return <ErrorScreen />;

    return (
        <>
            {loading
                ? <Meta title='Loading... | UnityShop' />
                : error
                    ? <Meta title='Error | UnityShop' />
                    : updateLoading
                        ? <Meta title='Updating... | UnityShop' />
                        : updateError
                            ? <Meta title='Error on updating | UnityShop' />
                            : <Meta title={`${user.name} - User Details | UnityShop`} />}
            
            <Link to='/admin/userList' className='mt-3'>
                Go Back
            </Link>
            <Row className='mt-3 g-3 d-flex justify-content-center'>
                <Col xl={6} md={8} xs={12} className='justify-content-center'>
                    <div className='bg-white shadow w-100 p-4 rounded-2'>
                        <h3 className='letter-spacing-1 p-0' style={{ fontSize: '24px' }}>
                            User Details
                        </h3>
                        {loading
                            ? <Loader width='30px' height='30px' />
                            : <Form onSubmit={handleSubmit}>
                                {(error || updateError) && <Message variant='danger'>{error}</Message>}
                                {updateLoading && <Loader width='30px' height='30px' />}
                                <Container fluid>
                                    <Row>
                                        <Form.Group controlId='name' className='mb-2 col-lg-6'>
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='Enter Name'
                                                onChange={inputHandler}
                                                name='name' value={name ? name : ""}
                                                className='border rounded-2'
                                                disabled />
                                        </Form.Group>

                                        <Form.Group controlId='phone' className='mb-2 col-lg-6'>
                                            <Form.Label>Phone</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='Enter phone'
                                                name='phone'
                                                value={phone ? phone : ""}
                                                className='border rounded-2'
                                                disabled />
                                        </Form.Group>

                                        <Form.Group controlId='email' className='mb-2'>
                                            <Form.Label>Email Address</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='Enter email'
                                                name='email'
                                                value={email ? email : ""}
                                                className='border rounded-2'
                                                disabled />
                                        </Form.Group>

                                        <Form.Group controlId='isAdmin' className='mt-2 mb-2 col-lg-6'>
                                            <Form.Check
                                                type='checkbox'
                                                label='Is Admin'
                                                name='isAdmin'
                                                checked={isAdmin ? isAdmin : false}
                                                onChange={inputHandler}
                                                className='rounded-2' />
                                        </Form.Group>
                                        <Form.Group controlId='isBlocked' className='mt-2 mb-2 col-lg-6'>
                                            <Form.Check
                                                type='checkbox'
                                                label='Is Blocked'
                                                name='isBlocked'
                                                checked={isBlocked ? isBlocked : false}
                                                onChange={inputHandler}
                                                className='rounded-2' />
                                        </Form.Group>

                                        <Col md={4}></Col><Col md={4}></Col>

                                        <Col md={4} className='justify-self-end'>
                                            <Button type='submit' variant='dark'
                                                className='us-btn-outline mt-2 p-1'>
                                                update
                                            </Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Form>}
                    </div>
                </Col>
            </Row>
        </ >
    );
};

export default UserEditScreen;
