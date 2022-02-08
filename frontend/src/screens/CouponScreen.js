import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Col, Row, Form, Button, Spinner } from 'react-bootstrap';

import ErrorScreen from './ErrorScreen';
import Meta from '../components/Meta';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listCoupon, createCoupon, deleteCoupon } from '../actions/couponActions';
import { showErrorAlert } from '../actions/mainAlertActions';
import ConfirmAlert from '../components/ConfirmAlert';

const CouponScreen = () => {
    const dispatch = useDispatch();
    const [showConfirm, setShowConfirm] = useState({ show: false, message: '' });
    const [date, setDate] = useState({ coupon: '', validity: '', discount: '' });

    const couponCreate = useSelector((state) => state.couponCreate);
    const { loading: createLoading, success } = couponCreate;

    const couponDelete = useSelector((state) => state.couponDelete);
    const { loading: deleteLoading } = couponDelete;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const couponList = useSelector((state) => state.couponList);
    let { loading, error, coupons } = couponList;

    coupons = coupons.sort((a, b) => {
        const date = new Date(now());
        const nameA = !a.isDeleted && toDate(a.expireAt) > date,
            nameB = !b.isDeleted && toDate(b.expireAt) > date;

        if (nameA.toString() > nameB.toString()) return -1;
        if (nameA.toString() < nameB.toString()) return 1;

        return 0;
    });

    useEffect(() => {
        if (userInfo && userInfo.isAdmin)
            dispatch(listCoupon());
    }, [dispatch, userInfo]);


    const inputHandler = (e) => {
        if (e.target.name === 'coupon')
            return setDate((prev) => {
                return {
                    ...prev,
                    [e.target.name]: e.target.value.trim()
                };
            });
        setDate((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            };
        });
    };

    const offerCreateHandler = (e) => {
        e.preventDefault();

        if (!date.validity || !date.discount || !date.coupon)
            return dispatch(showErrorAlert('Please proved all the neccessory data'));

        date.coupon = date.coupon.toUpperCase();
        dispatch(createCoupon(date.coupon, date.discount, date.validity));
    };

    const couponDeleteHandler = (id) => {
        setShowConfirm({
            show: true,
            message: 'Do you want to delete the coupon ?',
            id
        });
    };
    const confirmAction = () => {
        setShowConfirm((prev) => {
            return {
                ...prev,
                show: false,
            };
        });
        dispatch(deleteCoupon(showConfirm.id));
    };
    const cancelAction = () => {
        console.log(showConfirm);
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
                coupon: '',
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

                            <Form.Group controlId='coupon' className='mx-lg-2 mb-2 mb-lg-1'>
                                <Form.Label
                                    style={{ whiteSpace: 'nowrap' }}>
                                    Coupon Code
                                </Form.Label>
                                <Form.Control
                                    type='text'
                                    name='coupon'
                                    placeholder='Coupon'
                                    value={date.coupon}
                                    onChange={inputHandler}
                                    className='border bg-light rounded us-input'
                                    style={{ textTransform: 'uppercase' }} />
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
                                    Discount
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
                {loading && !coupons.length
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
                            <Meta title='Coupons | UnityShop' />
                            <Table bordered hover responsive
                                className='table-sm m-0 mt-3'>
                                <thead>
                                    <tr className="table-active border">
                                        <th>ID</th>
                                        <th>COUPON</th>
                                        <th>
                                            <span style={{ whiteSpace: 'nowrap' }}>
                                                DISCOUNT
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
                                        <th>
                                            <span style={{ whiteSpace: 'nowrap' }}>
                                                IS DELETED
                                            </span>
                                        </th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!coupons.length &&
                                        <tr>
                                            <td colSpan={6}>
                                                <Message className='m-0 rounded-2 shadowI'>
                                                    No coupons are available
                                                </Message>
                                            </td>
                                        </tr>}
                                    {coupons.map(coupon => (
                                        <tr
                                            key={coupon._id}
                                            style={{
                                                verticalAlign: 'center !important'
                                            }}>
                                            <td>{coupon._id}</td>
                                            <td><span style={{ whiteSpace: 'nowrap' }}>{coupon.coupon}</span></td>
                                            <td><span style={{ whiteSpace: 'nowrap' }}>{coupon.discount}</span></td>
                                            <td><span style={{ whiteSpace: 'nowrap' }}>{coupon.expireAt.substring(0, 10)}</span></td>
                                            <td>
                                                <span style={{ whiteSpace: 'nowrap' }}>
                                                    {!coupon.isDeleted && toDate(coupon.expireAt) > now()
                                                        ? (<i className='fas fa-check' style={{ color: 'green' }}></i>)
                                                        : (<i className='fas fa-times' style={{ color: 'red' }}></i>)}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ whiteSpace: 'nowrap' }}>
                                                    {coupon.isDeleted
                                                        ? (<i className='fas fa-check' style={{ color: 'green' }}></i>)
                                                        : (<i className='fas fa-times' style={{ color: 'red' }}></i>)}
                                                </span>
                                            </td>
                                            <td className='text-center'>
                                                {deleteLoading && showConfirm.id === coupon._id
                                                    ? <Spinner animation="grow" variant="danger" size='sm' />
                                                    : <span
                                                        className='mx-auto'
                                                        style={{
                                                            display: 'inline-flex'
                                                        }}>
                                                        <Button
                                                            variant='danger'
                                                            disabled={coupon.isDeleted || toDate(coupon.expireAt) < now()}
                                                            className='us-delete-btn border'
                                                            onClick={() => couponDeleteHandler(coupon._id)}>
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
    const newDate = new Date(`${yy}-${mm}-${dd}`);

    return newDate;
};

const toDate = (incomedate) => {
    const date = new Date(incomedate);
    return date;
};

export default CouponScreen;
