import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Col, Row, Form, Button, Spinner } from 'react-bootstrap';
import { getBrandList } from '../actions/brandAction';

import ErrorScreen from './ErrorScreen';
import Meta from '../components/Meta';
// import Price from '../components/Price';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { addBrandOffer, deleteBrandOffer } from '../actions/brandAction';
import { showErrorAlert } from '../actions/mainAlertActions';
import ConfirmAlert from '../components/ConfirmAlert';

const OffersScreen = () => {
    const dispatch = useDispatch();
    const redirect = useNavigate();
    const [showConfirm, setShowConfirm] = useState({ show: false, message: '' });
    const [date, setDate] = useState({ brand: '', validity: '', discount: '' });

    const brandOfferCreate = useSelector((state) => state.brandOfferCreate);
    const { loading: createLoading, success } = brandOfferCreate;

    const brandOfferDelete = useSelector((state) => state.brandOfferDelete);
    const { loading: deleteLoading } = brandOfferDelete;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const brandList = useSelector((state) => state.brandList);
    let { loading, error, brands } = brandList;
    let offers = brands.reduce((acc, brand) => {
        if (brand.offers && brand.offers.length)
            acc = [
                ...acc,
                ...brand.offers.map(offer => {
                    return {
                        brandId: brand._id,
                        brand: brand.name,
                        ...offer
                    };
                })
            ];
        return acc;
    }, []);
    offers = offers.sort((a, b) => {
        const date = new Date(now());
        const nameA = !a.isDeleted && toDate(a.expireAt) > date,
            nameB = !b.isDeleted && toDate(b.expireAt) > date;

        if (nameA.toString() > nameB.toString()) return -1;
        if (nameA.toString() < nameB.toString()) return 1;

        return 0;
    });

    useEffect(() => {
        if (userInfo && userInfo.isAdmin)
            dispatch(getBrandList());
    }, [dispatch, redirect, userInfo]);


    const inputHandler = (e) => {
        setDate((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            };
        });
    };

    const offerCreateHandler = (e) => {
        e.preventDefault();

        if (!date.validity || !date.discount || !date.brand)
            return dispatch(showErrorAlert('Please proved all the neccessory datas'));

        dispatch(addBrandOffer(date.brand, date.discount, date.validity));
    };

    const offerDeleteHandler = (offerId, brandId) => {
        setShowConfirm({
            show: true,
            message: 'Do you want to delete the offer',
            offerId,
            brandId
        });
    };
    const confirmAction = () => {
        setShowConfirm((prev) => {
            return {
                ...prev,
                show: false,
            };
        });
        dispatch(deleteBrandOffer(showConfirm.offerId, showConfirm.brandId));
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
        if (success)
            setDate({
                brand: '',
                validity: '',
                discount: ''
            });
    }, [success]);

    if (!userInfo || !userInfo.isAdmin)
        return <ErrorScreen />;

    return (
        <>
            <div className="col-12 conainer-fluid mt-3 px-3">
                <Row className='gy-2 d-flex align-items-center'>
                    <Col xs={12} className='d-md-flex align-items-center justify-content-center'>
                        <Form
                            className='d-lg-flex align-items-end justify-content-center col-md-8'>
                            <Form.Group controlId='brand' className='mx-lg-2 mb-2 mb-lg-1'>
                                <Form.Label>Brand</Form.Label>
                                {loading && !brands.length
                                    ? (<>
                                        <Loader width='30px' height='30px' className='mt-1 mb-1' />
                                    </>)
                                    : (<>
                                        <Form.Select
                                            name='brand'
                                            aria-label="Default select example"
                                            onChange={inputHandler}
                                            className='border rounded-2 bg-light w-100'
                                            style={{
                                                paddingTop: '0.4rem',
                                                paddingBottom: '0.4rem',
                                                paddingLeft: '1rem'
                                            }}>
                                            <option key='default-option'>Choose a Brand</option>
                                            {brands.map(brand =>
                                                !brand.isDeleted
                                                    ? <option key={brand._id} value={brand._id}>{brand.name}</option>
                                                    : <></>)}
                                        </Form.Select>
                                    </>)}
                            </Form.Group>

                            <Form.Group controlId='validity' className='mx-lg-2 mb-2 mb-lg-1'>
                                <Form.Label>Validity</Form.Label>
                                <Form.Control
                                    type='date'
                                    name='validity'
                                    value={date.validity}
                                    onChange={inputHandler}
                                    className='border ml-sm-5 bg-light rounded us-input' />
                            </Form.Group>

                            <Form.Group controlId='discount' className='mx-lg-2 mb-2 mb-lg-1'>
                                <Form.Label
                                    style={{ whiteSpace: 'nowrap' }}>
                                    Discount (%)
                                </Form.Label>
                                <Form.Control
                                    type='number'
                                    name='discount'
                                    placeholder='Discount'
                                    value={date.discount}
                                    onChange={inputHandler}
                                    className='border bg-light rounded us-input' />
                            </Form.Group>

                            <Button
                                type='submit'
                                className='us-btn'
                                disabled={createLoading}
                                onClick={!createLoading ? offerCreateHandler : null}
                                style={{
                                    width: 'fit-content',
                                    whiteSpace: 'nowrap'
                                }}>
                                {createLoading ? 'Adding...' : 'Add Offer'}
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </div>
            <div
                className='bg-white shadow border-2 rounded-2 mt-3 p-3'>
                <Col xs={12} className='d-flex align-items-center'>
                    <h3 className='letter-spacing-1 m-0' style={{ fontSize: '24px' }}>
                        Offers
                    </h3>
                </Col>
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
                            <Meta title='Offers | UnityShop' />
                            <Table bordered hover responsive
                                className='table-sm m-0 mt-3'>
                                <thead>
                                    <tr className="table-active border">
                                        <th>ID</th>
                                        <th>BRAND</th>
                                        <th>
                                            <span style={{ whiteSpace: 'nowrap' }}>
                                                DISCOUNT %
                                            </span>
                                        </th>
                                        <th>
                                            <span style={{ whiteSpace: 'nowrap' }}>
                                                VALIDITY
                                            </span>
                                        </th>
                                        <th>
                                            <span style={{ whiteSpace: 'nowrap' }}>
                                                IS VALID
                                            </span>
                                        </th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!offers.length &&
                                        <tr>
                                            <td colSpan={6}>
                                                <Message className='m-0 rounded-2 shadowI'>
                                                    No offers available
                                                </Message>
                                            </td>
                                        </tr>}
                                    {offers.map(offer => (
                                        <tr
                                            key={offer._id}
                                            style={{
                                                verticalAlign: 'center !important'
                                            }}>
                                            <td>{offer._id}</td>
                                            <td><span style={{ whiteSpace: 'nowrap' }}>{offer.brand}</span></td>
                                            <td><span style={{ whiteSpace: 'nowrap' }}>{offer.discount}</span></td>
                                            <td><span style={{ whiteSpace: 'nowrap' }}>{offer.expireAt.substring(0, 10)}</span></td>
                                            <td>
                                                <span style={{ whiteSpace: 'nowrap' }}>
                                                    {!offer.isDeleted && toDate(offer.expireAt) > toDate(now())
                                                        ? (<i className='fas fa-check' style={{ color: 'green' }}></i>)
                                                        : (<i className='fas fa-times' style={{ color: 'red' }}></i>)}
                                                </span>
                                            </td>
                                            <td className='text-center'>
                                                {deleteLoading
                                                    ? <Spinner animation="grow" variant="danger" size='sm' />
                                                    : <span
                                                        className='mx-auto'
                                                        style={{
                                                            display: 'inline-flex'
                                                        }}>
                                                        <Button
                                                            variant='danger'
                                                            disabled={offer.isDeleted || toDate(offer.expireAt) < toDate(now())}
                                                            className='us-delete-btn border'
                                                            onClick={() => offerDeleteHandler(offer._id, offer.brandId)}>
                                                            <i className='fas fa-trash'></i>
                                                        </Button>
                                                    </span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <ConfirmAlert
                                show={showConfirm.show}
                                cancelAction={cancelAction}
                                confirmAction={confirmAction}
                                message={showConfirm.message} />
                        </>)}
            </div>
        </>
    );
};

const now = () => {
    const d = new Date();
    const yy = d.getFullYear();
    const mm = (d.getMonth() + 1 < 10) ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
    const dd = ((d.getDate()) < 10) ? `0${(d.getDate())}` : ((d.getDate()));
    const newDate = `${yy}-${mm}-${dd}`;
    return newDate;
};
const toDate = (incomedate) => {
    const date = new Date(incomedate);
    return date;
};

export default OffersScreen;
