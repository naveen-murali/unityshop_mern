import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { useFormDataHandler } from '../validation/useFormDataHandler';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';
import { showErrorAlert } from '../actions/mainAlertActions';

const ShippingScreen = () => {
    const {
        userLogin: { userInfo },
        cart: { shippingAddress }
    } = useSelector(state => state);

    const dispatch = useDispatch();
    const redirect = useNavigate();

    const { formData, inputHandler, setFormData } = useFormDataHandler({
        phone: {
            value: shippingAddress.phone
                ? shippingAddress.phone
                : userInfo
                    ? userInfo.phone : ''
        },
        address: { value: shippingAddress.address ? shippingAddress.address : '' },
        city: { value: shippingAddress.city ? shippingAddress.city : '' },
        postalCode: { value: shippingAddress.postalCode ? shippingAddress.postalCode : '' },
        contry: { value: shippingAddress.contry ? shippingAddress.contry : '' },
    });
    const { phone, address, city, postalCode, contry } = formData;

    const handleSubmit = (e) => {
        e.preventDefault();

        let formValues = Object.values(formData);
        if (formValues.some(value => value.error === true))
            return dispatch(showErrorAlert('Please provide valid credential'));

        const shippingAdress = {
            phone: phone.value,
            address: address.value,
            city: city.value,
            postalCode: postalCode.value,
            contry: contry.value
        };
        dispatch(saveShippingAddress(shippingAdress));
        redirect('/payment');
    };

    useEffect(() => {
        if (!userInfo)
            redirect('/login');

        // const keys = Object.keys(shippingAddress);
        // if (!keys.length)
        //     redirect('/login');

    }, [userInfo, redirect]);

    useEffect(() => {
        document.title = 'Shipping | UnityShop';
    }, []);

    return (
        <>
            <div className='mt-3'></div>
            <CheckoutSteps step1 step2 />
            <FormContainer>
                <h3 className='letter-spacing-1 p-0' style={{ fontSize: '24px' }}>
                    Shipping
                </h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='phone' className='mb-2'>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type='text' placeholder='Phone'
                            onChange={inputHandler} value={phone.value ? phone.value : ""}
                            name='phone' required
                            className='border rounded-2' />
                        {phone.error && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', }}>
                            Please enter a valid phone number
                        </em>}
                    </Form.Group>

                    <Form.Group controlId='address' className='mb-2'>
                        <Form.Label>Address</Form.Label>
                        <Form.Control type='text' placeholder='Address'
                            onChange={inputHandler} value={address.value ? address.value : ""}
                            name='address' required
                            className='border rounded-2' />
                        {address.error && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', }}>
                            Address should have min-length of 6
                        </em>}
                    </Form.Group>

                    <Form.Group controlId='city' className='mb-2'>
                        <Form.Label>City</Form.Label>
                        <Form.Control type='text' placeholder='City'
                            onChange={inputHandler} value={city.value ? city.value : ""}
                            name='city' required
                            className='border rounded-2' />
                    </Form.Group>

                    <Form.Group controlId='postalcode' className='mb-2'>
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control type='text' placeholder='Postal Code'
                            onChange={inputHandler} value={postalCode.value ? postalCode.value : ""}
                            name='postalCode' required
                            className='border rounded-2' />
                        {postalCode.error && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', }}>
                            Enter a valid postal code
                        </em>}
                    </Form.Group>

                    <Form.Group controlId='contry' className='mb-2'>
                        <Form.Label>Contry</Form.Label>
                        <Form.Control type='text' placeholder='Contry'
                            onChange={inputHandler} value={contry.value ? contry.value : ""}
                            name='contry' required
                            className='border rounded-2' />
                    </Form.Group>

                    <Button type='submit' variant='dark'
                        className='us-btn-outline btn-outline mt-2' style={{ width: 'fit-content', padding: '0.3rem 2.5rem' }}>
                        Continue
                    </Button>
                </Form>
            </FormContainer>
        </>);
};

export default ShippingScreen;
