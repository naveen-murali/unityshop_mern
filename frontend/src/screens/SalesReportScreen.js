import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Col, Row, Form, Button } from 'react-bootstrap';
import { getSalesList } from '../actions/salesActions';
import { showErrorAlert } from '../actions/mainAlertActions';

import { useReactToPrint } from 'react-to-print';
import ErrorScreen from './ErrorScreen';
import Meta from '../components/Meta';
import Price from '../components/Price';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ExportToExcel from '../components/ExportToExcel';

const SalesReportScreen = () => {
    const dispatch = useDispatch();
    const redirect = useNavigate();
    const ref = useRef();
    const [date, setDate] = useState({ from: getToday(), to: getToday() });

    const salesList = useSelector((state) => state.salesList);
    const { loading, error, sales } = salesList;

    const salesReport = sales.reduce((acc, sale) => {
        const newSales = sale.orderItems.map(item => {
            return {
                ID: item.product._id,
                Product: item.product.name,
                'Created At': sale.createdAt.substring(0, 10),
                Quantity: item.qty,
                Price: Number(item.qty) * Number(item.price) - ((Number(item.qty) * Number(item.price)) * (item.discount / 100))
            };
        });
        acc = [...acc, ...newSales];

        return acc;
    }, []);
    const fileName = `salesReport-${new Date()}`;

    const totalSalePrice = sales.reduce((acc, item) => acc + item.totalPrice, 0);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (!date.from || !date.to)
            return dispatch(showErrorAlert('Please provide from and a to date'));

        if (userInfo && userInfo.isAdmin)
            dispatch(getSalesList(date.from, date.to));
    }, [dispatch, redirect, userInfo, date.from, date.to]);

    const handlePrint = useReactToPrint({
        content: () => ref.current,
    });

    const inputHandler = (e) => {
        setDate((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            };
        });
    };

    if (!userInfo || !userInfo.isAdmin)
        return <ErrorScreen />;

    return (
        <>
            <div
                ref={ref}
                className='bg-white shadow border-2 rounded-2 mt-3 p-3'>
                <div className="col-12 conainer-fluid">
                    <Row className='d-flex align-items-center'>
                        <Col lg={4} xs={12} className='d-flex align-items-center'>
                            <h3 className='letter-spacing-1 m-0 w-100' style={{ fontSize: '24px' }}>
                                Sales Report
                            </h3>
                        </Col>

                        <Col lg={4} xs={12} className='d-flex align-items-center justify-content-center' style={{ zIndex: '10000' }}>
                            <Form
                                className='d-md-flex align-items-center justify-content-center onPrint w-100'>
                                <Form.Group controlId='from' className='d-md-flex align-items-center mx-md-2 mb-2 mb-md-0 onPrint-date'>
                                    <Form.Label className='px-md-2'>From</Form.Label>
                                    <Form.Control
                                        type='date'
                                        name='from'
                                        value={date.from}
                                        onChange={inputHandler}
                                        className='border ml-sm-5 search-input' />
                                </Form.Group>
                                <Form.Group controlId='to' className='d-md-flex align-items-center mx-md-2 mb-2 mb-md-0 onPrint-date'>
                                    <Form.Label className='px-md-2'>To</Form.Label>
                                    <Form.Control
                                        type='date'
                                        name='to'
                                        value={date.to}
                                        onChange={inputHandler}
                                        className='border ml-sm-5 search-input' />
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col xs={12} className='d-flex align-items-center justify-content-between d-none onPrint-display'>
                            <h4
                                className='letter-spacing-1 m-0 border p-2 mx-2 rounded shadow'
                                style={{
                                    fontSize: '20px',
                                    fontWeight: '400',
                                    textTransform: 'capitalize'
                                }}>
                                Total Revenue : <Price price={totalSalePrice} />
                            </h4>
                            <h4
                                className='letter-spacing-1 m-0 border p-2 rounded shadow'
                                style={{
                                    fontSize: '20px',
                                    fontWeight: '400',
                                    textTransform: 'capitalize'
                                }}>
                                Total Products Soled : {sales.reduce((acc, sale) =>
                                    sale.orderItems.reduce((acc, item) => item.qty + acc, 0) + acc, 0)}
                            </h4>
                        </Col>

                        <Col lg={4} xs={12} className='text-end reportDownloadBtn'>
                            <ExportToExcel
                                apiData={salesReport}
                                fileName={fileName}
                                className='us-btn-outline mx-1'
                                style={{ width: 'fit-content' }}
                                disabled={loading || sales.length === 0} />
                            <Button
                                onClick={handlePrint}
                                className='us-btn-outline'
                                style={{ width: 'fit-content' }}
                                disabled={loading || sales.length === 0}>
                                <i className="fas fa-download"></i> pdf
                            </Button>
                        </Col>
                    </Row>
                </div>
                {loading && !sales.length
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
                            <Meta title='Sales Report | UnityShop' />
                            <Table bordered hover responsive
                                className='table-sm m-0 mt-3'>
                                <thead>
                                    <tr className="table-active border">
                                        <th>ID</th>
                                        <th>PRODUCT</th>
                                        <th>
                                            <span style={{ whiteSpace: 'nowrap' }}>
                                                ORDERD AT
                                            </span>
                                        </th>
                                        <th>
                                            <span style={{ whiteSpace: 'nowrap' }}>
                                                QUANTITY
                                            </span>
                                        </th>
                                        <th>
                                            <span style={{ whiteSpace: 'nowrap' }}>
                                                TOTAL
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!sales.length && <tr>
                                        <td colSpan={5}>
                                            <Message className='m-0 rounded-2 shadowI'>
                                                No sales from: {date.from} to:{date.to}
                                            </Message>
                                        </td>
                                    </tr>}
                                    {sales.map(sale => (
                                        sale.orderItems.map(item => (
                                            <tr key={item._id + sale._id} style={{ verticalAlign: 'center !important' }}>
                                                <td>{item.product._id}</td>
                                                <td><span style={{ whiteSpace: 'nowrap' }}>{item.product.name}</span></td>
                                                <td><span style={{ whiteSpace: 'nowrap' }}>{sale.createdAt.substring(0, 10)}</span></td>
                                                <td>{item.qty}</td>
                                                <td><Price price={Number(item.qty) * Number(item.price) - ((Number(item.qty) * Number(item.price)) * (item.discount / 100))} /></td>
                                            </tr>
                                        ))
                                    ))}
                                </tbody>
                            </Table>
                        </>)}
            </div>
        </>
    );
};

const getToday = (number = 0) => {
    const d = new Date();
    const yy = d.getFullYear();
    const mm = (d.getMonth() + 1 < 10) ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
    const dd = ((d.getDate() - number) < 10) ? `0${(d.getDate() - number)}` : ((d.getDate() - number));
    const newDate = `${yy}-${mm}-${dd}`;
    return newDate;
};

export default SalesReportScreen;
