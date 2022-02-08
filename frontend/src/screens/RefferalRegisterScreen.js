import React, { useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import FormContainer from '../components/FormContainer';
import { register as registerAction } from '../actions/userActions';
import {
    EMAIL_CONFIG,
    PASSWORD_CONFIG,
    PHONE_CONFIG,
    NAME_CONFIG
} from '../constants/validationConstats';

const RegisterScreen = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });
    const { name, phone, email, password } = errors;
    const [query] = useSearchParams();
    const redir = query.get('redirect') ? query.get('redirect') : "/";
    const referralId = query.get('referralId')
    const dispatch = useDispatch();
    const redirect = useNavigate();
    
    const { userRegister, userLogin: { userInfo } } = useSelector(state => state);
    const { error, loading, userInfo: userInfoReg } = userRegister;

    const onSubmit = data => {
        const { name, phone, email, password } = data;
        dispatch(registerAction(name, phone, email, password, referralId));
    };

    useEffect(() => {
        if (userInfoReg || userInfo)
            redirect(redir === '/' ? '/' : `/${redir}`);
    }, [redirect, redir, userInfoReg, userInfo]);

    return (
        <>
            <Meta title='Register User | UnityShop' />
            <FormContainer className=''>
                <h2 className='py-2 letter-spacing-1' style={{ fontSize: '24px' }}>
                    Sign Up
                </h2>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {loading && <Loader width='30px' height='30px' />}
                    {error && <Message variant='danger'>{error}</Message>}

                    <Form.Group controlId='name' className='mb-2'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='text' placeholder='Enter Name'
                            className='border rounded-2'
                            {...register("name", NAME_CONFIG)} isInvalid={name} />
                        {name && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', }}>
                            Name should have min-length of 3
                        </em>}
                    </Form.Group>

                    <Form.Group controlId='phone' className='mb-2'>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type='text' placeholder='Enter phone'
                            className='border rounded-2'
                            {...register("phone", PHONE_CONFIG)} isInvalid={phone} />
                        {phone && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', }}>
                            Please enter a valid phone number
                        </em>}
                    </Form.Group>

                    <Form.Group controlId='email' className='mb-2'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type='text' placeholder='Enter email'
                            className='border rounded-2'
                            {...register("email", EMAIL_CONFIG)} isInvalid={email} />
                        {email && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', }}>
                            Please enter a valid email address
                        </em>}
                    </Form.Group>

                    <Form.Group controlId='password' className='mb-2'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placeholder='Enter Password'
                            className='border rounded-2'
                            {...register("password", PASSWORD_CONFIG)} isInvalid={password} />
                        {password && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', lineHeight: 'auto' }}>
                            Password should contain at least 8 characters in length with at least 1 number or special characters
                        </em>}
                    </Form.Group>

                    {referralId &&
                        <div className='text-center my-2 mt-3'>
                            <h5 className='text-success m-0'>Refferal Is applied</h5>
                        </div>}

                    <Button type='submit' variant='dark'
                        className='us-btn-outline mt-2 p-1' style={{ width: '10rem' }}>
                        signup
                    </Button>

                    <Row className='py-3'>
                        <Col>
                            Already a Customer?{' '}
                            <Link to={redir ? `/login?redirect=${redir}` : '/login'}>
                                Log In
                            </Link>
                        </Col>
                    </Row>
                </Form>
            </FormContainer >
        </>
    );
};

export default RegisterScreen;
