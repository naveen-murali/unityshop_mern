// import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Col, Row, Container, InputGroup, FormControl, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { createProduct, createProductReset } from '../actions/productActions';
import { showErrorAlert } from '../actions/mainAlertActions';
import { getBrandList } from '../actions/brandAction';
import ConfirmAlert from '../components/ConfirmAlert';
import CropImage from '../components/CropImage';
import MyPortal from '../components/MyPortal';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import ErrorScreen from './ErrorScreen';

const ProductCreateScreen = () => {
    const redirect = useNavigate();
    const dispatch = useDispatch();
    const ref = useRef();

    const [imgPreview, setImgPreview] = useState(null);
    const [cropImageSrc, setCropImageSrc] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        brand: '',
        countInStock: 0,
        description: '',
        isDeleted: false,
        image: []
    });
    const [showConfirm, setShowConfirm] = useState({
        show: false,
        message: ''
    });

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const brandList = useSelector((state) => state.brandList);
    let { loading: brandLoading, brands } = brandList;
    brands = brands.sort((a, b) => {
        const nameA = a.name.toUpperCase(),
            nameB = b.name.toUpperCase();

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;

        return 0;
    });

    const productCreate = useSelector((state) => state.productCreate);
    const { loading, error, success, product } = productCreate;


    const handleSubmit = (e) => {
        e.preventDefault();
        const { image, name, price, brand } = formData;

        if (!image.length || !name || !price || !brand)
            return dispatch(showErrorAlert('Invalid Credentials'));

        setShowConfirm({ show: true, message: `Do you want to create product named ${name}` });
    };
    const confirmAction = () => {
        dispatch(createProduct(formData));
        setShowConfirm((prevData) => { return { ...prevData, show: false }; });
    };
    const cancelAction = () => {
        setShowConfirm((prevData) => { return { ...prevData, show: false }; });
    };

    const inputHandler = (e) => {
        if (e.target.type === 'checkbox')
            return setFormData(prev => {
                return {
                    ...prev,
                    [e.target.name]: e.target.checked
                };
            });

        setFormData(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            };
        });
    };

    const imageUploadHndler = (e) => {
        if (formData.image.length === 3) {
            ref.current.value = '';
            dispatch(showErrorAlert('only 3 images are allowed'));
            return;
        }

        const inputedImage = e.target.files[0];
        setCropImageSrc(inputedImage);
    };
    const closeHander = () => {
        ref.current.value = '';
        setCropImageSrc(null);
    };
    const imageCallback = (image) => {
        setFormData((prevData) => {
            return {
                ...prevData,
                image: [...prevData.image, image]
            };
        });

        ref.current.value = '';
        setImgPreview(image);
        setCropImageSrc(null);
    };

    useEffect(() => {
        if (success) {
            dispatch(createProductReset());
            redirect(`/admin/productDetails/edit/${product._id}`);
        }
    }, [dispatch, success, redirect, product]);

    useEffect(() => {
        if (!brands.length)
            dispatch(getBrandList());
    }, [brands, dispatch]);

    if (!userInfo || !userInfo.isAdmin)
        return <ErrorScreen />;

    return (
        <>
            <Meta title='Add Product to UnityShop | UnityShop' />
            <Link to='/admin/productList'>
                Go Back
            </Link>
            <Row className='mt-1 g-3 justify-content-center'>
                <Col xl={6} md={8} xs={12}>
                    <div className='bg-white shadow w-100 p-4 rounded-2'>
                        <h3 className='letter-spacing-1 p-0' style={{ fontSize: '24px' }}>
                            Product Details
                        </h3>
                        {loading && <Loader width='30px' height='30px' />}
                        {error && <Message variant='danger'>{error}</Message>}

                        <Form onSubmit={handleSubmit}>
                            <Container fluid>
                                <Row>
                                    <Form.Group controlId='name' className='mb-2'>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type='text' placeholder='Enter Name'
                                            onChange={inputHandler}
                                            name='name' value={formData.name ? formData.name : ""}
                                            className='border rounded-2' />
                                    </Form.Group>

                                    <Form.Group controlId='price' className='mb-2'>
                                        <Form.Label>Price</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>₹</InputGroup.Text>
                                            <FormControl
                                                type='number'
                                                name='price'
                                                value={formData.price ? formData.price : ""}
                                                placeholder='Price'
                                                onChange={(e) => {
                                                    if (e.target.value >= 0)
                                                        inputHandler(e);
                                                }}
                                                className='border rounded-2' />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group controlId='price' className='mb-2'>
                                        <Form.Label>Stocks</Form.Label>
                                        <InputGroup>
                                            <Form.Control placeholder='Number of Stock'
                                                type='number'
                                                name='countInStock'
                                                value={formData.countInStock ? formData.countInStock : ""}
                                                onChange={(e) => {
                                                    if (e.target.value >= 0)
                                                        inputHandler(e);
                                                }}
                                                className='border rounded-2' />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group controlId="image" className="mb-3">
                                        <Form.Label>Image</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name='image'
                                            ref={ref}
                                            onChange={imageUploadHndler}
                                            accept=".jpg,.jpeg,.png,"
                                            className='border rounded-2' />
                                    </Form.Group>

                                    <Form.Group controlId='brand' className='mb-2'>
                                        <Form.Label>Brand</Form.Label>
                                        {brandLoading
                                            ? <Loader width='30px' height='30px' />
                                            : <Form.Select
                                                className='border rounded-2'
                                                aria-label="Default select example"
                                                onChange={inputHandler}
                                                name='brand'>
                                                <option key='default-option'>Choose a Brand</option>
                                                {brands.map(brand =>
                                                    !brand.isDeleted
                                                        ? <option key={brand._id} value={brand._id}>{brand.name}</option>
                                                        : <></>)}
                                            </Form.Select>}
                                    </Form.Group>

                                    <Form.Group className='mb-2' controlId="description">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            name='description'
                                            as="textarea"
                                            rows={8}
                                            onChange={inputHandler}
                                            value={formData.description ? formData.description : ""}
                                            className='border rounded-2' />
                                    </Form.Group>

                                    <Form.Group controlId='isDeleted' className='mt-2 mb-2'>
                                        <Form.Check
                                            type='checkbox'
                                            label='Is Deleted'
                                            name='isDeleted'
                                            checked={formData.isDeleted ? formData.isDeleted : false}
                                            onChange={inputHandler}
                                            className='rounded-2' />
                                    </Form.Group>

                                    <Col md={4}></Col><Col md={4}></Col>

                                    {!brandLoading && <Col md={4} className='justify-self-end'>
                                        <Button type='submit' variant='dark'
                                            className='us-btn-outline mt-2 p-1'>
                                            Confirm
                                        </Button>
                                    </Col>}
                                </Row>
                            </Container>
                        </Form>
                    </div>
                </Col>
                {formData.image.length !== 0 &&
                    <Col lg={4} md={8}>
                        <Container fluid>
                            <Row className='gy-2'>
                                <Col md={12} className="bg-white shadow rounded-2 p-2 d-flex justify-content-center">
                                    <Image
                                        src={imgPreview ? URL.createObjectURL(imgPreview) : ''}
                                        fluid
                                        style={{
                                            // width: "200px",
                                            height: '249.3px'
                                        }}
                                        className='image-fluid p-2' />
                                </Col>
                                <Col
                                    md={12}
                                    className="bg-white shadow rounded-2 d-flex">
                                    {formData.image.map((img, index) =>
                                        <div
                                            className='position-relative p-3'
                                            key={index + 1999}
                                            style={{
                                                cursor: 'pointer',
                                                height: 'fit-content'
                                            }}
                                            onClick={() => setImgPreview(img)}>
                                            <Image
                                                src={URL.createObjectURL(img)}
                                                height={50} />

                                            <button
                                                className='position-absolute bg-white shadow d-flex justify-content-center align-items-center'
                                                style={{
                                                    top: '10%',
                                                    right: '10%',
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '50%'
                                                }}
                                                onClickCapture={() => {
                                                    setFormData(prevData => {
                                                        return {
                                                            ...prevData,
                                                            image: prevData.image.filter(data => data !== img)
                                                        };
                                                    });

                                                    setImgPreview(formData.image[0]);
                                                }
                                                }>
                                                <i className='fas fa-times p-0' style={{ color: 'red' }}></i>
                                            </button>
                                        </div>)}
                                </Col>
                            </Row>
                        </Container>
                    </Col>}
            </Row>

            <ConfirmAlert
                show={showConfirm.show}
                cancelAction={cancelAction}
                confirmAction={confirmAction}
                message={showConfirm.message} />

            {cropImageSrc && (
                <MyPortal id='cropper-portal'>
                    <CropImage
                        src={cropImageSrc}
                        imageCallback={imageCallback}
                        closeHander={closeHander} />
                </MyPortal>)}
        </>
    );
};


export default ProductCreateScreen;

