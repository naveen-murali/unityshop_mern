import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = ({ width, height, className }) => {
    return (
        <Spinner
            animation='border'
            role='status'
            style={{
                width,
                height,
                margin: 'auto',
                display: 'block',
            }}
            className={className}
        >
            <span className='sr-only'>Loading...</span>
        </Spinner>
    );
};

Loader.defaultProps = {
    width: '100px',
    height: '100px'
};

export default Loader;
