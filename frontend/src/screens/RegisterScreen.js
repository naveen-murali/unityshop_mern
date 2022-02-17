import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { GoogleLogin } from 'react-google-login';

import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import MyPortal from '../components/MyPortal';
import FormContainer from '../components/FormContainer';
import { googleRegister, register as registerAction } from '../actions/userActions';
import {
    EMAIL_CONFIG,
    PASSWORD_CONFIG,
    PHONE_CONFIG,
    NAME_CONFIG
} from '../constants/validationConstats';
import { showErrorAlert } from '../actions/mainAlertActions';

const RegisterScreen = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });
    const { name, phone, email, password } = errors;
    const [query] = useSearchParams();
    const redir = query.get('redirect') ? query.get('redirect') : "/";
    const dispatch = useDispatch();
    const redirect = useNavigate();
    
    const [googleData, setGoogleData] = useState(null);
    const [regPhone, setRegPhone] = useState('');
    const [showPhone, setShowPhone] = useState(false);

    const { userRegister, userLogin: { userInfo } } = useSelector(state => state);
    const { error, loading, userInfo: userInfoReg } = userRegister;

    const onSubmit = data => {
        const { name, phone, email, password } = data;
        dispatch(registerAction(name, phone, email, password));
    };

    const googleSuccess = (data) => {
        console.log(data);
        setGoogleData({
            name: data.profileObj.name,
            email: data.profileObj.email,
            googleId: data.googleId,
        });
        setShowPhone(true);
    };
    const googleFailure = (data) => { 
        console.log(data);
    };

    const googlePhoneRegSubmit = (e) => {
        e.preventDefault();

        if (regPhone.length !== 10)
            return dispatch(showErrorAlert('Invalied Phone number'));

        dispatch(googleRegister(
            googleData.name,
            regPhone,
            googleData.email,
            googleData.googleId,
        ));
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
                    />
                </div>
            </FormContainer>

            {showPhone && <MyPortal id='regPhoneId'>
                <div className='regPhone'>
                    <Form
                        className='regPhone-form bg-white rounded-2 shadow p-4'
                        onSubmit={(e) => googlePhoneRegSubmit(e)}>
                        <h4 className='py-0 letter-spacing-1' style={{ fontSize: '24px' }}>
                            Provide a phone number
                        </h4>
                        <Form.Group controlId='phoneReg' className='mb-2'>
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type='number'
                                value={regPhone}
                                onChange={(e) => setRegPhone(e.target.value)}
                                placeholder='Enter phone'
                                className='border rounded-2' />
                        </Form.Group>
                        <div className='d-flex justify-content-evenly'>
                            <a
                                href='/'
                                onClick={(e) => {
                                    e.preventDefault();
                                    setGoogleData(null);
                                    setRegPhone('')
                                    setShowPhone(false);
                                }}
                                variant='dark'
                                className='btn btn-danger us-btn-danger-outline mt-2 p-1 px-2' style={{ width: 'fit-content' }}>
                                close
                            </a>
                            <Button type='submit' variant='dark'
                                className='us-btn-outline mt-2 p-1 px-2' style={{ width: 'fit-content' }}>
                                register
                            </Button>
                        </div>
                    </Form>
                </div>
            </MyPortal>}
        </>
    );
};

export default RegisterScreen;
