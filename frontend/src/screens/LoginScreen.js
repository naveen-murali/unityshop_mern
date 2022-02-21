import React, { useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { GoogleLogin } from 'react-google-login';

import { googleLogin, login } from '../actions/userActions';
import { EMAIL_CONFIG, PASSWORD_CONFIG } from '../constants/validationConstats';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import Meta from '../components/Meta';

const LoginScreen = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });
    const { email, password } = errors;
    const [query] = useSearchParams();
    const redir = query.get('redirect') ? query.get('redirect') : "/";
    const dispatch = useDispatch();
    const redirect = useNavigate();

    const { userInfo, loading, error } = useSelector(state => state.userLogin);
    const { loading: googleLoading } = useSelector(state => state.googleLogin);

    const onSubmit = data => {
        const { email, password } = data;
        dispatch(login(email, password));
    };

    const googleSuccess = (data) => {
        console.log(data);
        dispatch(googleLogin(data.googleId));
    };
    const googleFailure = (error) => {
        console.log(error);
    };

    useEffect(() => {
        if (userInfo)
            redirect(redir === '/' ? '/' : `/${redir}`);
    }, [redirect, redir, userInfo]);

    useEffect(() => {
        document.title = 'Login | UnityShop';
    }, []);

    return (
        <>
            <Meta title='Login | UnityShop' />
            <FormContainer className=''>
                <h2 className='py-2 letter-spacing-1' style={{ fontSize: '24px' }}>
                    Sign In
                </h2>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {(loading || googleLoading) && <Loader width='30px' height='30px' />}
                    {error && <Message variant='danger'>{error}</Message>}
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

                    <Button type='submit' variant='dark'
                        className='us-btn-outline mt-2 p-1' style={{ width: '10rem' }}>
                        Login
                    </Button>

                    <Row className='py-3'>
                        <Col>
                            New Customer?{' '}
                            <Link to={redir ? `/register?redirect=${redir}` : '/register'}>
                                Register
                            </Link>
                        </Col>
                        <Col className='text-end'>
                            <Link to={redir ? `/forgotPassword?redirect=${redir}` : '/forgotPassword'}>
                                Forgot Password?
                            </Link>
                        </Col>
                    </Row>
                </Form>
                <div className='divider text-muted mb-3'>
                    <span></span>or<span></span>
                </div>
                <div className='text-center mb-3'>
                    <GoogleLogin
                        className='rounded-2 p-1 w-100 border googleBtn'
                        clientId='590560623393-d5g2q4k086mkb35s2gciklp5hgom3psu.apps.googleusercontent.com'
                        buttonText="Login With Google"
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy={'single_host_origin'}
                    />
                </div>
            </FormContainer >
        </>
    );
};

export default LoginScreen;
