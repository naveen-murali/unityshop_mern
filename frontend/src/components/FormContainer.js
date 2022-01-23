import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';

const FormContainer = ({ children, ...rest }) => {
    return (
        <Container className='mt-4'>
            <Row style={{ justifyContent: 'center' }}>
                <Col md={7} lg={5} className='bg-white shadow rounded-2 px-4 py-3'>
                    {children}
                </Col>
            </Row>
        </Container>
    );
};

export default FormContainer;
