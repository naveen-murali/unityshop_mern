import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Form, Button, Col, Row, Container, InputGroup, FormControl, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import {
    getOneProducts,
    createProduct,
    removeProduct,
    updateProduct
} from '../actions/productActions';
import { STATIC_BASE_URL } from '../constants/staticContants';
import { getBrandList } from '../actions/brandAction';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import ErrorScreen from './ErrorScreen';
import MyPortal from '../components/MyPortal';
import CropImage from '../components/CropImage';
import { logout } from '../actions/userActions';
import { showErrorAlert, showSuccessAlert } from '../actions/mainAlertActions';

const ProductEditScreen = () => {
    const editRef = useRef();
    const dispatch = useDispatch();
    const { screenAction, id } = useParams();
    const [editedPhoto, setEditedPhoto] = useState({ show: false, src: null });
    const [cropImageSrc, setCropImageSrc] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        brand: '',
        image: [],
        discount: 0,
        countInStock: 0,
        description: '',
        isDeleted: false,
    });

    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const brandList = useSelector((state) => state.brandList);
    const { loading: brandLoading, brands } = brandList;

    const productUpdate = useSelector((state) => state.productUpdate);
    const { loading: loadingUpdate, error: errorUpdate } = productUpdate;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (screenAction === 'edit') {
            let stringProduct = {
                name: product.name,
                price: product.price,
                brand: product.brand,
                image: product.image,
                discount: product.discount,
                countInStock: product.countInStock,
                description: product.description,
                isDeleted: product.isDeleted
            };

            if (JSON.stringify(formData) === JSON.stringify(stringProduct))
                return;

            return dispatch(updateProduct({ id: id, ...formData }));
        }
        dispatch(createProduct(formData));
    };

    const inputHandler = (e) => {
        if (e.target.type === 'checkbox')
            return setFormData(prev => {
                return { ...prev, [e.target.name]: e.target.checked };
            });

        setFormData(prev => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const imageCallback = (image) => {
        setEditedPhoto(prev => {
            return { ...prev, src: image };
        });
        setCropImageSrc(null);
    };
    const closeHander = () => {
        editRef.current.value = '';
        setCropImageSrc(null);
    };

    const updateConfirmHandler = async () => {
        try {
            const imageData = new FormData();
            const filename = editedPhoto.image.split('/')[1];
            imageData.append('image', editedPhoto.src, filename);

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.post('/api/uploads', imageData, config);

            dispatch(showSuccessAlert('Image updated, Please reload to see the change'));
            updateCancelHandler();
        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;

            if (message === 'Not authorized, token failed') {
                dispatch(logout());
            }

            dispatch(showErrorAlert(message));
        }
    };
    const updateCancelHandler = () => {
        closeHander();
        setEditedPhoto({ show: false, src: null });
    };

    useEffect(() => {
        if (!brands.length && !error)
            dispatch(getBrandList());
    }, [brands, dispatch, error]);

    useEffect(() => {
        if (!product.name || product._id !== id)
            dispatch(getOneProducts(id));
        else
            setFormData({
                name: product.name,
                price: product.price,
                brand: product.brand,
                image: product.image,
                discount: product.discount,
                countInStock: product.countInStock,
                description: product.description,
                isDeleted: product.isDeleted
            });

    }, [dispatch, id, product, loading, errorUpdate]);

    useEffect(() => {
        return () => dispatch(removeProduct());
    }, [dispatch]);

    if (!userInfo || !userInfo.isAdmin)
        return <ErrorScreen />;

    return (
        <>
            <Link to='/admin/productList'>
                Go Back
            </Link>
            <Row className='mt-1 g-3 justify-content-lg-unset justify-content-center'>
                <Col xl={6} md={8} xs={12}>
                    <div className='bg-white shadow w-100 p-4 rounded-2'>
                        <h3 className='letter-spacing-1 p-0' style={{ fontSize: '24px' }}>
                            Product Details
                        </h3>
                        {loading && !product._id
                            ? <>
                                <Meta title='Loading... | UnityShop' />
                                <Loader width='30px' height='30px' />
                            </>
                            : error
                                ? (<>
                                    <Meta title='Error - Edit | UnityShop' />
                                    <Message variant='danger'>{error}</Message>
                                </>)
                                : (<>
                                    {loadingUpdate && (<>
                                        <Meta title='Updating... | UnityShop' />
                                        <Loader width='30px' height='30px' />
                                    </>)}
                                    {errorUpdate && (
                                        <>
                                            <Meta title='Error on updating | UnityShop' />
                                            <Message variant='danger'>{errorUpdate}</Message>
                                        </>)}
                                    <Meta title={`${product.name ? product.name : ''} - Edit | UnityShop`} />
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
                                                            placeholder='Price'
                                                            value={formData.price ? formData.price : ""}
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
                                                        <Form.Control placeholder='Number of Stocks'
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

                                                <Form.Group controlId='brand' className='mb-2'>
                                                    <Form.Label>Brand</Form.Label>
                                                    {brandLoading
                                                        ? <Loader width='30px' height='30px' />
                                                        : <Form.Select
                                                            className='border rounded-2'
                                                            aria-label="Default select example"
                                                            onChange={inputHandler}
                                                            name='brand'
                                                            value={formData.brand ? formData.brand._id : ""}>
                                                            {brands.map(brand =>
                                                                <option key={brand._id} value={brand._id}>{brand.name}</option>)}
                                                        </Form.Select>}
                                                </Form.Group>

                                                <Form.Group className='mb-2' controlId="discount">
                                                    <Form.Label>Add an Offer (%)</Form.Label>
                                                    <Form.Control
                                                        name='discount'
                                                        type="number"
                                                        onChange={inputHandler}
                                                        value={formData.discount}
                                                        className='border rounded-2' />
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

                                                <Col md={4} className='justify-self-end'>
                                                    <Button type='submit' variant='dark'
                                                        className='us-btn-outline mt-2 p-1'>
                                                        Confirm
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Form>
                                </>)}
                    </div>
                </Col>
                {!loading && product && product.image &&
                    <Col lg={4} md={8}>
                        <Container fluid>
                            <Row className='gy-2'>
                                <Col md={12}
                                    className="bg-white shadow rounded-2 p-2 d-flex justify-content-center">
                                    <Image src={`${STATIC_BASE_URL}${imgPreview ||product.image[0]}`} fluid className='image-fluid p-2' />
                                </Col>

                                <Col md={12}
                                    className="bg-white shadow rounded-2 d-flex">
                                    {product.image.map(img =>
                                        <div
                                            className='position-relative p-3'
                                            key={img}
                                            style={{
                                                cursor: 'pointer',
                                                height: 'fit-content'
                                            }}
                                        onClick={() => setImgPreview(img)}>

                                            <Image
                                                src={`${STATIC_BASE_URL}${img}`}
                                                height={60} />

                                            <button
                                                className='position-absolute bg-white shadow border d-flex justify-content-center align-items-center'
                                                style={{
                                                    top: '10%',
                                                    right: '10%',
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '50%',
                                                    fontSize: '12px'
                                                }}
                                                onClickCapture={() => {
                                                    setEditedPhoto(prev => {
                                                        return {
                                                            ...prev,
                                                            image: img,
                                                            show: true
                                                        };
                                                    });
                                                }}>
                                                <i className='fas fa-edit p-0 text-info'></i>
                                            </button>
                                        </div>)}
                                </Col>

                                {editedPhoto.show &&
                                    <Col md={12} className='p-0'>
                                        <Form
                                            onSubmit={(e) => e.preventDefault()}
                                            className='bg-white shadow w-100 m-0 rounded-2 p-2'>
                                            <Form.Group
                                                controlId="image">
                                                <Form.Label>Image</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    name='image'
                                                    ref={editRef}
                                                    onChange={(e) => setCropImageSrc(e.target.files[0])}
                                                    className='rounded-2 border'
                                                    accept=".jpg,.jpeg,.png" />
                                            </Form.Group>
                                        </Form>

                                        {editedPhoto.src && <Col md={12}
                                            className="bg-white p-2 d-flex flex-column align-items-center">
                                            <Image
                                                src={URL.createObjectURL(editedPhoto.src)}
                                                fluid
                                                className='image-fluid p-2' />

                                            <div className='m-0'>
                                                <Button
                                                    type="button"
                                                    className='btn-danger us-btn-danger mx-1'
                                                    style={{ width: 'fit-content' }}
                                                    onClick={updateCancelHandler}>
                                                    Cancel
                                                </Button>

                                                <Button
                                                    type="button"
                                                    className='us-btn mx-1'
                                                    style={{ width: 'fit-content' }}
                                                    onClick={updateConfirmHandler}>
                                                    Update
                                                </Button>
                                            </div>
                                        </Col>}

                                    </Col>}
                            </Row>
                        </Container>
                    </Col>}
            </Row>
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

export default ProductEditScreen;
