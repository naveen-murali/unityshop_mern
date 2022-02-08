import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Spinner, Col, Row, Card, Form } from 'react-bootstrap';
import { getBrandList, editBrand, createBrand } from '../actions/brandAction';

import ErrorScreen from './ErrorScreen';
import Meta from '../components/Meta';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ConfirmAlert from '../components/ConfirmAlert';
import { showErrorAlert } from '../actions/mainAlertActions';

const BrandListScreen = () => {
    const dispatch = useDispatch();
    const redirect = useNavigate();
    const [showConfirm, setShowConfirm] = useState({ show: false, message: '' });
    const [showAddEditBrand, setShowAddEditBrand] = useState({ show: false });
    const [brand, setBrand] = useState({});

    const listOrders = useSelector((state) => state.brandList);
    let { loading, error, brands } = listOrders;
    
    brands = brands.sort((a, b) => {
        const nameA = a.name.toUpperCase(),
            nameB = b.name.toUpperCase();

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;

        return 0;
    });

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const productDelete = useSelector((state) => state.productDelete);
    const { loading: deleteLoading } = productDelete;

    useEffect(() => {
        if (userInfo && userInfo.isAdmin)
            dispatch(getBrandList());
    }, [dispatch, redirect, userInfo]);


    const addHandler = (e) => {
        e.preventDefault();
        if (!brand)
            return dispatch(showErrorAlert('Please enter a brand name'));

        dispatch(createBrand(brand.name));
        setShowAddEditBrand({ show: false });
    };
    const editHandler = (e) => {
        e.preventDefault();
        if (!brand.name)
            return dispatch(showErrorAlert('Please enter a brand name'));

        dispatch(editBrand(brand.id, brand.name, null, brand.isDeleted));
        setShowAddEditBrand({ show: false });
    };

    const deleteHandler = (id, brand) => {
        setShowConfirm({
            show: true,
            message: `Do you want to delete ${brand}?`,
            idHolder: id,
            productNameHolder: brand
        });
    };
    const confirmAction = () => {
        setShowConfirm((prev) => {
            return {
                ...prev,
                show: false,
            };
        });

        dispatch(editBrand(showConfirm.idHolder, '', null, true));
    };
    const cancelAction = () => {
        setShowConfirm((prev) => {
            return {
                ...prev,
                show: false,
            };
        });
    };

    if (!userInfo || !userInfo.isAdmin)
        return <ErrorScreen />;

    return (
        <>
            <div className='bg-white shadow border-2 rounded-2 mt-3 p-3'>
                <div className="col-12 conainer-fluid">
                    <Row className='gy-2'>
                        <Col lg={6} xs={12} className='d-flex align-items-center'>
                            <h3 className='letter-spacing-1 m-0' style={{ fontSize: '24px' }}>
                                Products List
                            </h3>
                        </Col>
                        {/* <Col lg={4} xs={12} className='d-flex align-items-center justify-content-center'>
                            <SearchBox
                                initialValue={''}
                                enterKeyword={enterKeyword} />
                        </Col> */}
                        <Col lg={6} xs={12} className='text-end'>
                            <Button
                                className='us-btn-outline'
                                onClick={() => setShowAddEditBrand({ show: true, type: 'add', title: 'add brand' })}
                                style={{ width: 'fit-content' }}>
                                <i className='fas fa-plus'></i> Add Brand
                            </Button>
                        </Col>
                    </Row>
                </div>
                {loading && !brands.length
                    ? (<>
                        <Meta title='Loding... | UnityShop' />
                        <Loader />
                    </>)
                    : error
                        ? (<>
                            <Meta title='Error | UnityShop' />
                            <Message variant='danger' className='mt-3 mb-0'>{error}</Message>
                        </>)
                        : (<>
                            <Meta title='Brand List | UnityShop' />
                            <Table bordered hover responsive
                                className='table-sm m-0 mt-3'>
                                <thead>
                                    <tr className="table-active border">
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>
                                            <span style={{ whiteSpace: 'nowrap' }}>
                                                PRODUCTS
                                            </span>
                                        </th>
                                        <th>
                                            <span style={{ whiteSpace: 'nowrap' }}>
                                                IS DELETED
                                            </span>
                                        </th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {brands.map(brand => (
                                        <tr key={brand._id} style={{ verticalAlign: 'center !important' }}>
                                            <td>{brand._id}</td>
                                            <td><span style={{ whiteSpace: 'nowrap' }}>{brand.name}</span></td>
                                            <td><span style={{ whiteSpace: 'nowrap' }}>{brand.productCount}</span></td>
                                            <td>
                                                {brand.isDeleted
                                                    ? (<i className='fas fa-check' style={{ color: 'green' }}></i>)
                                                    : (<i className='fas fa-times' style={{ color: 'red' }}></i>)}
                                            </td>
                                            <td className='text-center'>
                                                {deleteLoading && brand._id === showConfirm.idHandler
                                                    ? <Spinner animation="grow" variant="danger" size='sm' />
                                                    : <span className='mx-auto' style={{ display: 'inline-flex' }}>
                                                        <Button
                                                            variant='light'
                                                            onClick={() => {
                                                                setBrand({ name: brand.name, id: brand._id, isDeleted: brand.isDeleted });
                                                                setShowAddEditBrand({ show: true, type: 'edit', title: 'edit brand' });
                                                            }}
                                                            className=' us-edit-btn border'>
                                                            <i className='fas fa-edit'></i>
                                                        </Button>
                                                        <Button
                                                            variant='danger'
                                                            disabled={brand.isDeleted}
                                                            className='us-delete-btn border'
                                                            onClick={() => deleteHandler(brand._id, brand.name)}>
                                                            <i className='fas fa-trash'></i>
                                                        </Button>
                                                    </span>}
                                            </td>
                                        </tr>))}
                                </tbody>
                            </Table>
                        </>)}
            </div>
            <ConfirmAlert
                show={showConfirm.show}
                cancelAction={cancelAction}
                confirmAction={confirmAction}
                message={showConfirm.message} />

            <div className={showAddEditBrand.show
                ? 'brandCreateDelete show'
                : 'brandCreateDelete'}>
                <Card
                    className={showAddEditBrand.show
                        ? ' border-0 rounded-2 shadow confrimAlert-card p-2 show'
                        : 'border-0 rounded-2 shadow confrimAlert-card p-2 hide'}
                    // className={' border-0 rounded-2 shadow confrimAlert-card  p-2 show'}
                    style={{ minWidth: '20rem', maxWidth: '30rem' }}>
                    <Card.Body className=' position-relative'>
                        <h3 className='letter-spacing-1 p-0' style={{ fontSize: '24px' }}>
                            {showAddEditBrand.title}
                        </h3>
                        <Form onSubmit={showAddEditBrand.type === 'add'
                            ? addHandler
                            : editHandler}>
                            <Form.Group controlId='name' className='mb-2'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type='text' placeholder='Enter Name'
                                    onChange={(e) => setBrand((prev) => {
                                        return { ...prev, [e.target.name]: e.target.value };
                                    })}
                                    value={brand.name ? brand.name : ""}
                                    name='name'
                                    className='border rounded-2' />
                            </Form.Group>
                            <Form.Group controlId='isDeleted' className='mt-2 mb-2'>
                                <Form.Check
                                    type='checkbox'
                                    label='Is Deleted'
                                    name='isDeleted'
                                    checked={brand.isDeleted ? brand.isDeleted : false}
                                    onChange={(e) => setBrand((prev) => {
                                        return { ...prev, [e.target.name]: e.target.checked };
                                    })}
                                    className='rounded-2' />
                            </Form.Group>
                            <Button type='submit' variant='dark'
                                className='us-btn-outline mt-2 p-1'>
                                confirm
                            </Button>
                        </Form>
                        <button
                            onClick={() => setShowAddEditBrand({ show: false, type: '' })}
                            className='position-absolute'
                            style={{ top: '0', right: '0', color: 'gray' }}>
                            <i className="fas fa-times"></i>
                        </button>
                    </Card.Body>
                </Card>

            </div>
        </>
    );
};

export default BrandListScreen;
