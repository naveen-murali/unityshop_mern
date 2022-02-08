import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Spinner, Col, Row } from 'react-bootstrap';
import { listProductsAdmin, deleteProduct } from '../actions/productActions';

import ErrorScreen from './ErrorScreen';
import Meta from '../components/Meta';
import Price from '../components/Price';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Pagniate';
import SearchBox from '../components/SearchBox';
import ConfirmAlert from '../components/ConfirmAlert';

const ProductListScreen = () => {
    const dispatch = useDispatch();
    const redirect = useNavigate();
    const { pageNumber, keywordLocal } = useParams();
    const [showConfirm, setShowConfirm] = useState({ show: false, message: '' });

    const productListAdmin = useSelector((state) => state.productListAdmin);
    const { loading, error, products, page, pages } = productListAdmin;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const productDelete = useSelector((state) => state.productDelete);
    const { loading: deleteLoading } = productDelete;

    useEffect(() => {
        if (userInfo && userInfo.isAdmin)
            dispatch(listProductsAdmin(keywordLocal, pageNumber));
    }, [dispatch, redirect, userInfo, pageNumber, keywordLocal]);

    const enterKeyword = (keyword) => {
        if (!keyword)
            return redirect(`/admin/productList`);

        redirect(`/admin/productList/${keyword}/page/1`);
    };

    const deleteHandler = (id, product) => {
        setShowConfirm({
            show: true,
            message: `Do you want to delete ${product}?`,
            idHolder: id,
            productNameHolder: product
        });
    };
    const confirmAction = () => {
        dispatch(deleteProduct(showConfirm.idHolder, showConfirm.productNameHolder));
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

    if (!userInfo || !userInfo.isAdmin)
        return <ErrorScreen />;

    return (
        <>
            <div className='bg-white shadow border-2 rounded-2 mt-3 p-3'>
                <div className="col-12 conainer-fluid">
                    <Row className='gy-2'>
                        <Col lg={4} xs={12} className='d-flex align-items-center'>
                            <h3 className='letter-spacing-1 m-0' style={{ fontSize: '24px' }}>
                                Products List
                            </h3>
                        </Col>
                        <Col lg={4} xs={12} className='d-flex align-items-center justify-content-center'>
                            <SearchBox
                                initialValue={keywordLocal || ''}
                                enterKeyword={enterKeyword} />
                        </Col>
                        <Col lg={4} xs={12} className='text-end'>
                            <LinkContainer to='/admin/productDetails/add' style={{ width: 'fit-content' }}>
                                <Button className='us-btn-outline' style={{ width: 'fit-content' }}>
                                    <i className='fas fa-plus'></i> Add product
                                </Button>
                            </LinkContainer>
                        </Col>
                    </Row>
                </div>
                {loading && !products.length
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
                            <Meta title='Product List | UnityShop' />
                            <Table bordered hover responsive
                                className='table-sm m-0 mt-3'>
                                <thead>
                                    <tr className="table-active border">
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>BRAND</th>
                                        <th>PRICE</th>
                                        <th>STOCKS</th>
                                        <th>
                                            <span style={{ whiteSpace: 'nowrap' }}>
                                                OFFER %
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
                                    {products.map(product => (
                                        <tr key={product._id} style={{ verticalAlign: 'center !important' }}>
                                            <td>{product._id}</td>
                                            <td><span style={{ whiteSpace: 'nowrap' }}>{product.name}</span></td>
                                            <td><span style={{ whiteSpace: 'nowrap' }}>{product.brand.name}</span></td>
                                            <td>
                                                <span style={{ whiteSpace: 'nowrap' }}>
                                                    <Price price={product.price} />
                                                </span>
                                            </td>
                                            <td><span style={{ whiteSpace: 'nowrap' }}>{product.countInStock}</span></td>
                                            <td>
                                                <span style={{ whiteSpace: 'nowrap' }}>
                                                    {product.discount}
                                                </span>
                                            </td>
                                            <td>
                                                {product.isDeleted
                                                    ? (<i className='fas fa-check' style={{ color: 'green' }}></i>)
                                                    : (<i className='fas fa-times' style={{ color: 'red' }}></i>)}
                                            </td>
                                            <td className='text-center'>
                                                {deleteLoading && product._id === showConfirm.idHandler
                                                    ? <Spinner animation="grow" variant="danger" size='sm' />
                                                    : <span className='mx-auto' style={{ display: 'inline-flex' }}>
                                                        <LinkContainer
                                                            to={`/admin/productDetails/edit/${product._id}`}
                                                            className=''>
                                                            <Button
                                                                variant='light'
                                                                className=' us-edit-btn border'>
                                                                <i className='fas fa-edit'></i>
                                                            </Button>
                                                        </LinkContainer>
                                                        <Button
                                                            variant='danger'
                                                            className='us-delete-btn border'
                                                            onClick={() => deleteHandler(product._id, product.name)}>
                                                            <i className='fas fa-trash'></i>
                                                        </Button>
                                                    </span>}
                                            </td>
                                        </tr>))}
                                </tbody>
                            </Table>
                            <Col
                                xs={12}
                                style={{ height: 'fit-content !important' }}
                                className='d-flex justify-content-end mt-3'>
                                <Paginate
                                    page={page}
                                    pages={pages}
                                    path={keywordLocal
                                        ? `/admin/productList/${keywordLocal}`
                                        : '/admin/productList'} />
                            </Col>
                        </>)}
            </div>
            <ConfirmAlert
                show={showConfirm.show}
                cancelAction={cancelAction}
                confirmAction={confirmAction}
                message={showConfirm.message} />
        </>
    );
};

export default ProductListScreen;
