import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { useFormDataHandler } from '../validation/useFormDataHandler';
import { showErrorAlert } from '../actions/mainAlertActions';
const RegisterScreen = () => {
    const dispatch = useDispatch();
    const redirect = useNavigate();

    const {
        userLogin: { userInfo },
        userDetails: { error, loading, user },
    } = useSelector(state => state);

    const { formData, inputHandler, setFormData } = useFormDataHandler({
        name: { value: userInfo ? userInfo.name : '' },
        phone: { value: userInfo ? userInfo.phone : '' },
        email: { value: userInfo ? userInfo.email : '' },
        password: { value: '' },
        confirmPassword: { value: '' }
    });
    const { name, email, phone, password, confirmPassword } = formData;


    const handleSubmit = e => {
        e.preventDefault();
        if (password.value && (password.value !== confirmPassword.value))
            return dispatch(showErrorAlert("Password and Confirm password don't match"));

        if (name.error || email.error || phone.error || password.error || confirmPassword.error)
            return dispatch(showErrorAlert('Can not update profile with invalied data'));

        let newUser = {
            name: name.value,
            phone: phone.value,
            email: email.value
        };
        if (!password.value &&
            JSON.stringify(newUser) === JSON.stringify({
                name: user.name, phone: user.phone, email: user.email
            }))
            return;

        if (password.value)
            user.password = password.value;

        dispatch(updateUserProfile(newUser));
        setFormData(prev => { return { ...prev, password: { value: '' }, confirmPassword: { value: '' } }; });
    };


    useEffect(() => {
        if (!userInfo)
            return redirect('/login');

        dispatch(getUserDetails('profile'));
    }, [redirect, userInfo, dispatch]);


    useEffect(() => {
        document.title = `${userInfo.name} - Profile | UnityShop`;
    }, [userInfo.name]);

    return (
        <>
            <Row className='mt-3 g-3 d-flex justify-content-center'>
                <Col xl={6} md={8} xs={12} className='justify-content-center'>
                    {/* <Row className='gy-3'> */}
                    <div className='bg-white shadow w-100 p-4 rounded-2'>
                        <h3 className='letter-spacing-1 p-0' style={{ fontSize: '24px' }}>
                            Profile
                        </h3>
                        <Form onSubmit={handleSubmit}>
                            {loading && <Loader width='30px' height='30px' />}
                            {error && <Message variant='danger'>{error}</Message>}
                            <Container fluid>
                                <Row>
                                    <Form.Group controlId='name' className='mb-2 col-lg-6'>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type='text' placeholder='Enter Name'
                                            onChange={inputHandler}
                                            name='name' value={name.value ? name.value : ""}
                                            className='border rounded-2' />
                                        {name.error && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', }}>
                                            Name should have min-length of 3
                                        </em>}
                                    </Form.Group>

                                    <Form.Group controlId='phone' className='mb-2 col-lg-6'>
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control type='text' placeholder='Enter phone'
                                            onChange={inputHandler}
                                            name='phone' value={phone.value ? phone.value : ""}
                                            className='border rounded-2' />
                                        {phone.error && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', }}>
                                            Please enter a valid phone number
                                        </em>}
                                    </Form.Group>

                                    <Form.Group controlId='email' className='mb-2'>
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control type='text' placeholder='Enter email'
                                            onChange={inputHandler}
                                            name='email' value={email.value ? email.value : ""}
                                            className='border rounded-2' />
                                        {email.error && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', }}>
                                            Please enter a valid email address
                                        </em>}
                                    </Form.Group>

                                    <Form.Group controlId='password' className='mb-2 col-lg-6'>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type='password' placeholder='Enter Password'
                                            name='password' value={password.value ? password.value : ""}
                                            onChange={(e) => {
                                                if (e.target.value)
                                                    inputHandler(e);
                                                else
                                                    setFormData(prevDate => { return { ...prevDate, password: { value: '', error: false } }; });
                                            }}
                                            className='border rounded-2' />
                                        {password.error && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', lineHeight: 'auto' }}>
                                            Password should contain at least 8 characters in length with at least 1 number or special characters
                                        </em>}
                                    </Form.Group>

                                    <Form.Group controlId='confirmPassword' className='mb-2 col-lg-6'>
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control type='password' placeholder='Confirm Password'
                                            name='confirmPassword' value={confirmPassword ? confirmPassword.value : ""}
                                            onChange={(e) => {
                                                if (e.target.value)
                                                    inputHandler(e);
                                                else
                                                    setFormData(prevDate => { return { ...prevDate, confirmPassword: { value: '', error: false } }; });
                                            }}
                                            className='border rounded-2' />
                                        {confirmPassword.error && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', lineHeight: 'auto' }}>
                                            Password should contain at least 8 characters in length with at least 1 number or special characters
                                        </em>}
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
                        </Form>
                    </div>
                    {/* </Row> */}
                </Col>
            </Row>
        </ >
    );
};

export default RegisterScreen;


/* <div className='col-12 d-flex justify-content-center w-100'>
<div className=' bg-white d-flex justify-content-center align-items-center shadow'
    style={{ width: '132px', height: '132px', borderRadius: '50%' }}>
    <i className="far fa-user-circle icon-user"></i>
    <img src="https://images.pexels.com/photos/2449543/pexels-photo-2449543.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        style={{ width: '120px', height: '120px', borderRadius: '50%' }}
        alt="" />
</div>
</div> */