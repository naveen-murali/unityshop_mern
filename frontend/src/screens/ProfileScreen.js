import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container, OverlayTrigger, Tooltip, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    FacebookShareButton,
    TwitterShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    RedditShareButton,
} from 'react-share';
import { GoogleLogin } from 'react-google-login';

import {
    getUserDetails,
    updateUserProfile,
    addressUpdate,
    addressSave,
    linkGoogle
} from '../actions/userActions';
import { useFormDataHandler } from '../validation/useFormDataHandler';
import { showErrorAlert } from '../actions/mainAlertActions';
import ConfirmAlert from '../components/ConfirmAlert';
import MyPortal from '../components/MyPortal';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Price from '../components/Price';
import Meta from '../components/Meta';

const RegisterScreen = () => {
    const dispatch = useDispatch();
    const redirect = useNavigate();
    const [copied, setCopied] = useState(false);
    const [show, setShow] = useState({ status: false, id: '' });
    const [showConfirm, setShowConfirm] = useState({ show: false, message: '' });

    const {
        userLogin: { userInfo },
        userDetails: { error, user },
        googleLink
    } = useSelector(state => state);

    const { formData, inputHandler, setFormData } = useFormDataHandler({
        name: { value: userInfo ? userInfo.name : '' },
        phone: { value: userInfo ? userInfo.phone : '' },
        email: { value: userInfo ? userInfo.email : '' },
        password: { value: '' },
        confirmPassword: { value: '' }
    });
    const { name, email, phone, password, confirmPassword } = formData;

    const { formData: addressData, inputHandler: addressHandler, setFormData: setAddress } = useFormDataHandler({
        phoneA: {
            value: ''
        },
        address: {
            value: ''
        },
        city: {
            value: ''
        },
        postalCode: {
            value: ''
        },
        contry: {
            value: ''
        },
    });
    const { phoneA, address, city, postalCode, contry } = addressData;

    const { loading: googleLinkLoading, success: googleLinkSuccess } = googleLink;

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
            newUser.password = password.value;

        dispatch(updateUserProfile(newUser));
        setFormData(prev => {
            return {
                ...prev,
                password: { value: '' },
                confirmPassword: { value: '' }
            };
        });
    };

    const updateHandler = (e) => {
        e.preventDefault();
        const updateAddress = {
            phone: phoneA.value,
            address: address.value,
            city: city.value,
            postalCode: postalCode.value,
            contry: contry.value
        };

        const emptyExist = Object.values(updateAddress).some(value => !value);
        if (emptyExist)
            return dispatch(showErrorAlert('Provide all the fields'));

        if (show.id === 'add')
            dispatch(addressSave(updateAddress));
        else
            dispatch(addressUpdate(show.id, updateAddress));
        setShow({ status: false, id: '' });
    };

    const googleSuccess = (data) => {
        const email = data.profileObj.email;
        const googleId = data.googleId;

        if (email !== userInfo.email)
            return setShowConfirm({
                message: "If you continue your email will be permanently changed.",
                show: true,
                dataHolder: { email, googleId },
                case: "linkGoogle"
            });

        dispatch(linkGoogle(email, googleId));
    };
    const googleFailure = () => { };

    const confirmAction = () => {
        switch (showConfirm.case) {
            case "deleteAddress":
                dispatch(addressUpdate(showConfirm.dataHolder, {}, true));
                break;

            case "linkGoogle":
                const { email, googleId } = showConfirm.dataHolder;
                dispatch(linkGoogle(email, googleId));
                break;

            default:
                break;
        }
        setShowConfirm((prev) => {
            return {
                ...prev,
                show: false,
            };
        });
    };
    const cancelAction = () => {
        setShowConfirm((prev) => {
            return {
                ...prev,
                show: false,
            };
        });
    };

    useEffect(() => {
        if (!userInfo)
            return redirect('/login');

        dispatch(getUserDetails('profile'));
    }, [redirect, userInfo, dispatch]);

    useEffect(() => {
        if (googleLinkSuccess)
            setFormData((prev) => {
                return {
                    ...prev,
                    email: { value: userInfo.email }
                };
            });
        
        // eslint-disable-next-line
    }, [googleLinkSuccess]);

    return (
        <>
            {error
                ? <Meta title='Error | UnityShop' />
                : <Meta title={`${userInfo.name} - Profile | UnityShop`} />}

            <Row className='mt-3 g-3 justify-content-xl-start justify-content-center'>
                <Col xl={6} md={8} xs={12} className='justify-content-center'>
                    <div className='bg-white shadow w-100 p-4 rounded-2'>
                        <h3 className='letter-spacing-1 p-0' style={{ fontSize: '24px' }}>
                            Profile
                        </h3>
                        <Form onSubmit={handleSubmit}>
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
                                            className='border rounded-2'
                                            disabled={userInfo.googleId ? true : false} />
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

                        {googleLinkLoading
                            ? <Loader width='30px' height='30px' />
                            : !userInfo.googleId && <>
                                <div
                                    className='w-100 text-center mt-4 px-3'>
                                    <GoogleLogin
                                        className='rounded-2 p-1 border w-100 googleBtn'
                                        clientId='590560623393-d5g2q4k086mkb35s2gciklp5hgom3psu.apps.googleusercontent.com'
                                        buttonText="Link Google Account"
                                        onSuccess={googleSuccess}
                                        onFailure={googleFailure}
                                        cookiePolicy={'single_host_origin'}
                                    />
                                </div>
                            </>}
                    </div>
                </Col>

                <Col xl={6} md={8} xs={12} className='justify-content-center'>
                    <div className='bg-white shadow w-100 p-4 rounded-2'>
                        <div className='m-0 w-100 d-flex justify-content-between mb-2'>
                            <h4 className='letter-spacing-1 p-0' style={{ fontSize: '24px' }}>
                                address
                            </h4>

                            <Button
                                onClick={() => {
                                    setAddress({
                                        phoneA: {
                                            value: ''
                                        },
                                        address: {
                                            value: ''
                                        },
                                        city: {
                                            value: ''
                                        },
                                        postalCode: {
                                            value: ''
                                        },
                                        contry: {
                                            value: ''
                                        },
                                    });
                                    setShow({ status: true, id: 'add' });
                                }}
                                className='us-btn m-0'
                                style={{ width: 'fit-content' }}>
                                Add Address
                            </Button>
                        </div>
                        <ListGroup>
                            {(userInfo && userInfo.address.length === 0) &&
                                <Message className='m-0'>No Stored Address</Message>}
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
                                                className='p-0 m-0 mx-2 text-danger'
                                                onClick={() => {
                                                    setShowConfirm({
                                                        message: "Do you want to delete this address?",
                                                        show: true,
                                                        case: "deleteAddress",
                                                        dataHolder: add._id
                                                    });
                                                }}>
                                                DELETE
                                            </button>
                                            <button
                                                className='p-0 m-0 text-info'
                                                onClick={() => {
                                                    setShow({ status: true, id: add._id });
                                                    setAddress({
                                                        phoneA: { value: add.phone },
                                                        address: { value: add.address },
                                                        city: { value: add.city },
                                                        postalCode: { value: add.postalCode },
                                                        contry: { value: add.contry },
                                                    });
                                                }}>
                                                EDIT
                                            </button>
                                        </div>
                                    </ListGroup.Item>)
                            }
                        </ListGroup>
                    </div>
                </Col>

                <Col xl={6} md={8} xs={12} className='justify-content-center'>
                    <div className='w-100 my-3 container-fluid'>
                        <Row className='g-2'>
                            <Col>
                                <div className='border-1 rounded-2 shadow p-3 bg-white d-flex flex-column align-items-center justify-content-center'>
                                    <h5 className='letter-spacing-1'>Referrals</h5>
                                    <p className='m-0'>{(user && user.referralNum) || userInfo.referralNum || 0}</p>
                                </div>
                            </Col>
                            <Col>
                                <div className='border-1 rounded-2 shadow p-3 bg-white d-flex flex-column align-items-center justify-content-center'>
                                    <h5 className='letter-spacing-1'>Wallet</h5>
                                    <p className='m-0'><Price price={(user && user.wallet) || userInfo.wallet || 0} /></p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col xl={6} md={8} xs={12}></Col>
                <Col xl={6} md={8} xs={12} className='justify-content-center'>
                    <div className='bg-white shadow w-100 p-4 rounded-2'>
                        <h3 className='letter-spacing-1 p-0' style={{ fontSize: '18px' }}>
                            Referral Link
                        </h3>
                        <div
                            className='d-flex w-100 position-relative refferal-container'>
                            <p
                                className='m-0 border w-100 refferal rounded'
                                style={{ padding: '0.5rem 0.5rem 3rem 0.5rem !important' }}>
                                {`${window.location.protocol}//${window.location.host}/referral?referralId=${userInfo.phone}`}
                            </p>
                            <OverlayTrigger
                                placement="left"
                                delay={{ show: 250, hide: 400 }}
                                overlay={<Tooltip
                                    id="button-tooltip-copied"
                                    className={copied ? '' : 'd-md-block d-none'}>
                                    {copied ? <>Copied</> : <>Copy Refferal Link</>}
                                </Tooltip>}>

                                <span
                                    className='position-absolute px-2 py-1 mx-1 bg-success rounded-2 text-white refferal-copy'
                                    style={{
                                        position: 'absolute',
                                        userSelect: 'none',
                                        cursor: 'pointer',
                                        right: '0',
                                        top: '50%',
                                        transform: 'translate(0, -50%)'
                                    }}
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/referral?referralId=${userInfo.phone}`);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 1000);
                                    }}>
                                    {copied
                                        ? <i className="fas fa-check"></i>
                                        : <i className="far fa-copy"></i>}
                                </span>
                            </OverlayTrigger>
                        </div>
                        <p
                            className='m-0 mt-2 text-center text-info letter-spacing-1'
                            style={{
                                fontFamily: 'Poppins, sans-serif'
                            }}>
                            Refer a friend and earn <strong><Price price={200} /></strong> each.
                        </p>
                        <p
                            className='m-0 mt-2 text-center text-secondary letter-spacing-1'
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '14px'
                            }}>
                            Share on:
                        </p>
                        <div className='m-0 text-center text-info letter-spacing-1'>
                            <WhatsappShareButton
                                url={`${window.location.protocol}//${window.location.host}/referral?referralId=${userInfo.phone}`}
                                className='text-success m-0 px-1'
                                style={{ fontSize: '20px' }}>
                                <i className="fab fa-whatsapp"></i>
                            </WhatsappShareButton>

                            <FacebookShareButton
                                url={`${window.location.protocol}//${window.location.host}/referral?referralId=${userInfo.phone}`}
                                className='text-info m-0 px-1'
                                style={{ fontSize: '20px' }}>
                                <i className="fab fa-facebook"></i>
                            </FacebookShareButton>

                            <TwitterShareButton
                                url={`${window.location.protocol}//${window.location.host}/referral?referralId=${userInfo.phone}`}
                                className='text-info m-0 px-1'
                                style={{ fontSize: '20px' }}>
                                <i className="fab fa-twitter"></i>
                            </TwitterShareButton>

                            <TelegramShareButton
                                url={`${window.location.protocol}//${window.location.host}/referral?referralId=${userInfo.phone}`}
                                className='text-info m-0 px-1'
                                style={{ fontSize: '20px' }}>
                                <i className="fab fa-telegram"></i>
                            </TelegramShareButton>

                            <RedditShareButton
                                url={`${window.location.protocol}//${window.location.host}/referral?referralId=${userInfo.phone}`}
                                className='text-danger m-0 px-1'
                                style={{ fontSize: '20px' }}>
                                <i className="fab fa-reddit"></i>
                            </RedditShareButton>

                        </div>
                    </div>
                </Col>
            </Row>

            <ConfirmAlert
                show={showConfirm.show}
                cancelAction={cancelAction}
                confirmAction={confirmAction}
                message={showConfirm.message} />

            {show.status && <MyPortal>
                <div className='d-flex align-items-center justify-content-center position-fixed'
                    style={{
                        width: '100vw',
                        minHeight: '100vh',
                        top: '0',
                        left: '0',
                        backgroundColor: '#1a1a1a54'
                    }}>
                    <Col xl={6} md={8} xs={12} className='justify-content-center'>
                        <Form
                            onSubmit={updateHandler}
                            className='p-4 bg-white shadow rounded-2'>
                            <h4 className='letter-spacing-1 p-0' style={{ fontSize: '24px' }}>
                                Profile
                            </h4>
                            <Form.Group controlId='phoneA' className='mb-2'>
                                <Form.Label>Phone</Form.Label>
                                <Form.Control type='text' placeholder='Phone'
                                    onChange={addressHandler} value={phoneA.value ? phoneA.value : ""}
                                    name='phoneA' required
                                    className='border rounded-2' />
                                {phone.error && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', }}>
                                    Please enter a valid phone number
                                </em>}
                            </Form.Group>

                            <Form.Group controlId='address' className='mb-2'>
                                <Form.Label>Address</Form.Label>
                                <Form.Control type='text' placeholder='Address'
                                    onChange={addressHandler} value={address.value ? address.value : ""}
                                    name='address' required
                                    className='border rounded-2' />
                                {address.error && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', }}>
                                    Address should have min-length of 6
                                </em>}
                            </Form.Group>

                            <Form.Group controlId='city' className='mb-2'>
                                <Form.Label>City</Form.Label>
                                <Form.Control type='text' placeholder='City'
                                    onChange={addressHandler} value={city.value ? city.value : ""}
                                    name='city' required
                                    className='border rounded-2' />
                            </Form.Group>

                            <Form.Group controlId='postalcode' className='mb-2'>
                                <Form.Label>Postal Code</Form.Label>
                                <Form.Control type='text' placeholder='Postal Code'
                                    onChange={addressHandler} value={postalCode.value ? postalCode.value : ""}
                                    name='postalCode' required
                                    className='border rounded-2' />
                                {postalCode.error && <em className='text-danger letter-spacing-0' style={{ fontSize: '14px', fontWeight: '600', }}>
                                    Enter a valid postal code
                                </em>}
                            </Form.Group>

                            <Form.Group controlId='contry' className='mb-4'>
                                <Form.Label>Contry</Form.Label>
                                <Form.Control type='text' placeholder='Contry'
                                    onChange={addressHandler} value={contry.value ? contry.value : ""}
                                    name='contry' required
                                    className='border rounded-2' />
                            </Form.Group>
                            <div className='w-100 m-0 text-end'>
                                <span
                                    className='btn-danger us-btn-danger mx-3'
                                    onClick={() => setShow({ status: false, id: '' })}
                                    style={{
                                        userSelect: 'none',
                                        width: 'fit-content',
                                        padding: '0.3rem 2.5rem',
                                        cursor: 'pointer'
                                    }}>
                                    Cancel
                                </span>
                                <Button type='submit'
                                    variant='dark'
                                    className='us-btn-outline btn-outline mt-0'
                                    style={{ width: 'fit-content', padding: '0.3rem 2.5rem' }}>
                                    {show.id === 'add' ? 'Add' : 'Update'}
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </div>
            </MyPortal>}
        </ >
    );
};

export default RegisterScreen;