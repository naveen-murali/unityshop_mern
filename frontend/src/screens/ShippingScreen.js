import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useFormDataHandler } from '../validation/useFormDataHandler';
import { saveShippingAddress } from '../actions/cartActions';
import { showErrorAlert } from '../actions/mainAlertActions';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';
import { addressSave } from '../actions/userActions';

const ShippingScreen = () => {
    const {
        userLogin: { userInfo },
        cart: { shippingAddress, cartItems }
    } = useSelector(state => state);

    const dispatch = useDispatch();
    const redirect = useNavigate();

    const [saveAddress, setSaveAddress] = useState(false);

    const { formData, inputHandler, setFormData } = useFormDataHandler({
        phone: {
            value: shippingAddress.phone
                ? shippingAddress.phone
                : userInfo
                    ? userInfo.phone : ''
        },
        address: {
            value: shippingAddress.address ? shippingAddress.address : ''
        },
        city: {
            value: shippingAddress.city ? shippingAddress.city : ''
        },
        postalCode: {
            value: shippingAddress.postalCode ? shippingAddress.postalCode : ''
        },
        contry: {
            value: shippingAddress.contry ? shippingAddress.contry : ''
        },
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

        if (saveAddress)
            dispatch(addressSave(shippingAdress));

        dispatch(saveShippingAddress(shippingAdress));
        redirect('/payment');
    };

    useEffect(() => {
        if (!cartItems.length)
            redirect('/');

        if (!userInfo)
            redirect('/login');
    }, [userInfo, redirect, cartItems]);


    return (
        <>
            <Meta title='Shipping | UnityShop' />
            <div className='mt-3'></div>
            <CheckoutSteps step1 step2 />
            {userInfo.address.length !== 0 && <FormContainer>
                <Col>
                    <h3 className='letter-spacing-1 p-0' style={{ fontSize: '24px' }}>
                        Use Address
                    </h3>
                </Col>
                <Col>
                    <ListGroup>
                        {
                            userInfo && userInfo.address.map(add =>
                                <ListGroup.Item
                                    key={add._id}
                                    className='rounded-2 my-1 border'>
                                    <p className='p-0 my-1'>
                                        <strong className='bold'>Phone: </strong>{' '}
                                        {add.phone}
                                    </p>
                                    <p className='p-0 m-0'>
                                        <strong className='bold'>Address: </strong>{' '}
                                        {add.address},{' '}
                                        {add.city},{' '}
                                        {add.postalCode},{' '}
                                        {add.contry}
                                    </p>
                                    <div className='m-0 w-100 text-end'>
                                        <button
                                            className='p-0 m-0 text-info'
                                            onClick={() =>
                                                setFormData({
                                                    phone: { value: add.phone },
                                                    address: { value: add.address },
                                                    city: { value: add.city },
                                                    postalCode: { value: add.postalCode },
                                                    contry: { value: add.contry },
                                                })
                                            }>
                                            USE THIS
                                        </button>
                                    </div>
                                </ListGroup.Item>)
                        }
                    </ListGroup>
                </Col>
            </FormContainer>};

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

        <Form.Group controlId='saveAddress' className='mt-2 mb-2'>
            <Form.Check
                type='checkbox'
                label='Save Address'
                name='saveAddress'
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
                className='rounded-2' />
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
