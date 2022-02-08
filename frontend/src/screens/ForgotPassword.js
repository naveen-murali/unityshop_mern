import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { showErrorAlert, showSuccessAlert } from '../actions/mainAlertActions';
import { useFormDataHandler } from '../validation/useFormDataHandler';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Meta from '../components/Meta';

const ForgotPassword = () => {
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [getOtpLoading, setGetOtpLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otp, setOtp] = useState(false);
    const dispatch = useDispatch();
    const redirect = useNavigate();
    const [query] = useSearchParams();
    const redir = query.get('redirect') ? query.get('redirect') : "/login";

    const { userLogin: { userInfo } } = useSelector(state => state);

    const { formData, inputHandler } = useFormDataHandler({
        phone: { value: '' },
        password: { value: '' },
        confirmPassword: { value: '' }
    });

    const { phone, password, confirmPassword } = formData;

    const sendOtp = async (e) => {
        e.preventDefault();

        if (!phone.value || phone.error)
            return dispatch(showErrorAlert('Please enter a valid phone number'));

        try {
            setGetOtpLoading(true);
            const { data } = await axios.get(`/api/users/otp/${phone.value}`);

            setGetOtpLoading(false);
            dispatch(showSuccessAlert(data.message));
            setShowOtpInput(true);
        } catch (err) {
            setGetOtpLoading(false);
            const message = err.response && err.response.data.message
                ? err.response.data.message
                : err.message;

            dispatch(showErrorAlert(message));
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();

        if (!otp)
            return dispatch(showErrorAlert('Please enter an OTP'));

        if (!password.value || !confirmPassword.value)
            return dispatch(showErrorAlert('Password are required'));

        if (password.error || confirmPassword.error)
            return dispatch(showErrorAlert('Please enter a valied password'));

        if (password.value !== confirmPassword.value)
            return dispatch(showErrorAlert('Password and confirm password are not matching'));

        try {
            setOtpLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const { data } = await axios.post(`/api/users/otp/${phone.value}`,
                { otp, password: password.value }, config);

            setOtpLoading(false);
            dispatch(showSuccessAlert(data.message));
            redirect(redir === '/login' ? '/login' : `/login?redirect=${redir}`);
        } catch (err) {
            setOtpLoading(false);
            const message = err.response && err.response.data.message
                ? err.response.data.message
                : err.message;

            dispatch(showErrorAlert(message));
        }
    };

    useEffect(() => {
        if (userInfo && !redir)
            redirect('/');
    }, [redirect, userInfo, redir]);

    return (
        <>
            <Meta title='Forgot password | UnityShop' />
            <FormContainer>
                <h2 className='py-2 letter-spacing-1' style={{ fontSize: '24px' }}>
                    Forgot Password
                </h2>
                {getOtpLoading && <Loader width='30px' height='30px' />}
                {otpLoading && <Loader width='30px' height='30px' />}
                <Form onSubmit={sendOtp}>
                    <Form.Group controlId='phone' className='mb-2'>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type='text' placeholder='Enter phone number'
                            className='border rounded-2' name='phone' value={phone.value ? phone.value : ""}
                            onChange={inputHandler} />
                        {phone.error && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', lineHeight: 'auto' }}>
                            Please enter a valid phone number</em>}
                    </Form.Group>

                    <Button type='submit' variant='dark'
                        className='us-btn-outline my-2 p-1' style={{ width: '10rem' }}>
                        send otp
                    </Button>
                </Form>

                {showOtpInput && <Form className='mt-3' onSubmit={changePassword}>
                    <Form.Group controlId='OTP' className='mb-2'>
                        <Form.Label>OTP</Form.Label>
                        <Form.Control type='number' placeholder='Enter OTP'
                            className='border rounded-2' value={otp} onChange={(e) => setOtp(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId='password' className='mb-2'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placeholder='Enter Password'
                            name='password' value={password.value ? password.value : ""}
                            onChange={inputHandler}
                            className='border rounded-2' />
                        {password.error && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', lineHeight: 'auto' }}>
                            Password should contain at least 8 characters in length with at least 1 number or special characters
                        </em>}
                    </Form.Group>

                    <Form.Group controlId='confirmPassword' className='mb-2'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type='password' placeholder='Confirm Password'
                            name='confirmPassword' value={confirmPassword ? confirmPassword.value : ""}
                            onChange={inputHandler} className='border rounded-2' />
                        {confirmPassword.error && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', lineHeight: 'auto' }}>
                            Password should contain at least 8 characters in length with at least 1 number or special characters
                        </em>}
                    </Form.Group>

                    <Button type='submit' variant='dark'
                        className='us-btn-outline my-2 p-1' style={{ width: '10rem' }}>
                        submit
                    </Button>
                </Form>}
                <Col>
                    Go Back{' '}
                    <Link to={redir ? `/login?redirect=${redir}` : '/login'}>
                        Login?
                    </Link>
                </Col>
            </FormContainer >
        </>
    );
};

export default ForgotPassword;
