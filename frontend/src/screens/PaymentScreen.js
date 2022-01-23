import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { Form, Button, Col } from 'react-bootstrap';
import { savePaymentMethod } from '../actions/cartActions';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentScreen = () => {
    const {
        userLogin: { userInfo },
        cart: { shippingAddress }
    } = useSelector(state => state);

    const dispatch = useDispatch();
    const redirect = useNavigate();


    if (!shippingAddress)
        redirect('/shipping');

    const [paymentMethod, setPaymentMethod] = useState('Razorpay');

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        redirect('/placeOrder');
    };

    useEffect(() => {
        if (!userInfo)
            redirect('/login');
    }, [userInfo, redirect]);

    return (
        <>
            <div className='mt-3'></div>
            <CheckoutSteps step1 step2 step3 />
            <FormContainer>
                <h3 className='letter-spacing-1 p-0' style={{ fontSize: '24px' }}>
                    Payment Methods
                </h3>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='phone' className='mb-2'>
                        <Form.Label as='legend'
                            className='m-0 text-secondary letter-spacing-1'
                            style={{ textTransform: 'capitalize', fontWeight: '500' }}>
                            Select Method
                        </Form.Label>
                        <Col className='py-2'>
                            {/* <Form.Check
                                id='paypal'
                                type='radio'
                                label='PayPal or Credit Card'
                                name='paymentMethod'
                                value='PayPal'
                                checked
                                className='letter-spacing-1' style={{ fontSize: '16px' }}
                                onChange={(e) => setPaymentMethod(e.target.value)} /> */}

                            <Form.Check
                                id='razorpay'
                                type='radio'
                                label='Razorpay'
                                name='paymentMethod'
                                value='Razorpay'
                                checked
                                className='letter-spacing-1' style={{ fontSize: '16px' }}
                                onChange={(e) => setPaymentMethod(e.target.value)} />

                            <Form.Check
                                id='cod'
                                type='radio'
                                label='Cash On Delivary'
                                name='paymentMethod'
                                value='COD'
                                className='letter-spacing-1' style={{ fontSize: '16px' }}
                                onChange={(e) => setPaymentMethod(e.target.value)} />
                        </Col>

                    </Form.Group>
                    <Button type='submit' variant='dark'
                        className='us-btn-outline btn-outline mt-1'
                        style={{ width: 'fit-content', padding: '0.3rem 2.5rem' }}>
                        Continue
                    </Button>
                </Form>
            </FormContainer>
        </>
    );
};

export default PaymentScreen;
