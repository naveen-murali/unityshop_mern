import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Spinner, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers, deleteUser } from '../actions/userActions';
import { useNavigate } from 'react-router-dom';

import ErrorScreen from './ErrorScreen';
import Meta from '../components/Meta';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Pagniate';
import SearchBox from '../components/SearchBox';
import ConfirmAlert from '../components/ConfirmAlert';

const UserListScreen = () => {
    const dispatch = useDispatch();
    const redirect = useNavigate();
    const { pageNumber, keywordLocal } = useParams();

    const [showConfirm, setShowConfirm] = useState({ show: false, message: '' });

    const userList = useSelector((state) => state.userList);
    const { loading, error, users, page, pages } = userList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userDelete = useSelector((state) => state.userDelete);
    const { success: successDelete, loading: deleteLoading } = userDelete;

    useEffect(() => {
        if (userInfo && userInfo.isAdmin)
            dispatch(listUsers(keywordLocal, pageNumber));

    }, [dispatch, redirect, userInfo, successDelete, keywordLocal, pageNumber]);

    const enterKeyword = (keyword) => {
        if (!keyword)
            return redirect(`/admin/userList`);

        redirect(`/admin/userList/${keyword}/page/1`);
    };

    const deleteHandler = (id, email) => {
        setShowConfirm({
            show: true,
            message: `Do you want to delete ${email}?`,
            idHolder: id,
            emailHolder: email
        });
    };
    const confirmAction = () => {
        dispatch(deleteUser(showConfirm.idHolder, showConfirm.emailHolder));
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
            {loading
                ? <Meta title='Loading... | UnityShop' />
                : error
                    ? <Meta title='Error | UnityShop' />
                    : <Meta title='User List | UnityShop' />}

            <div className='bg-white shadow border-2 rounded-2 mt-3 p-3'>
                <div className="col-12 container-fluid">
                    <Row className='gy-2'>
                        <Col lg={6} xs={12} className='d-flex align-items-center'>
                            <h3 className='letter-spacing-1 m-0' style={{ fontSize: '24px' }}>
                                Users
                            </h3>
                        </Col>
                        <Col lg={6} xs={12} className='d-flex align-items-center justify-content-end'>
                            <SearchBox
                                initialValue={keywordLocal || ''}
                                enterKeyword={enterKeyword} />
                        </Col>
                    </Row>
                </div>
                {loading && !users.length
                    ? <Loader />
                    : error
                        ? <Message variant='danger' className='mt-2 mb-0'>{error}</Message>
                        : (<>
                            <Table bordered hover responsive
                                className='table-sm m-0 mt-3'>
                                <thead>
                                    <tr className="table-active border">
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>PHONE</th>
                                        <th>EMAIL</th>
                                        <th>ADMIN</th>
                                        <th>BLOCKED</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id} style={{ verticalAlign: 'center !important' }}>
                                            <td>{user._id}</td>
                                            <td><span style={{ whiteSpace: 'nowrap' }}>{user.name}</span></td>
                                            <td>{user.phone}</td>
                                            <td>
                                                <a
                                                    href={`mailto:${user.email}`}
                                                    target="_blank"
                                                    rel="noreferrer">
                                                    {user.email}
                                                </a>
                                            </td>
                                            <td>
                                                {user.isAdmin
                                                    ? (<i className='fas fa-check' style={{ color: 'green' }}></i>)
                                                    : (<i className='fas fa-times' style={{ color: 'red' }}></i>)}
                                            </td>
                                            <td>
                                                {user.isBlocked
                                                    ? (<i className='fas fa-check' style={{ color: 'green' }}></i>)
                                                    : (<i className='fas fa-times' style={{ color: 'red' }}></i>)}
                                            </td>
                                            {userInfo._id === user._id
                                                ? <td >
                                                    <LinkContainer to={`/profile`}>
                                                        <Button className='us-btn-outline py-1 btn-sm'>profile</Button>
                                                    </LinkContainer>
                                                </td>
                                                : <td className='text-center'>
                                                    {deleteLoading && user._id === showConfirm.idHandler
                                                        ? <Spinner animation="grow" variant="danger" size='sm' />
                                                        : <span className='mx-auto' style={{ display: 'inline-flex' }}>
                                                            <LinkContainer
                                                                to={`/admin/user/${user._id}/edit`}
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
                                                                onClick={() => deleteHandler(user._id, user.email)}>
                                                                <i className='fas fa-trash'></i>
                                                            </Button>
                                                        </span>}
                                                </td>}
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
                                        ? `/admin/userList/${keywordLocal}`
                                        : '/admin/userList'} />
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

export default UserListScreen;
