import React from 'react';
import { Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer>
            <Col className='text-center text-white p-0'>
                Copyright &copy; UnityShop - Developed by{' '}
                <a
                    href='https://naveen-murali.github.io/personal-website/'
                    className='text-info'
                    target='_blank' rel="noreferrer">
                    Naveen Murali
                </a>
            </Col>
        </footer>
    );
};

export default Footer;
