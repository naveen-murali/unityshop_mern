import React from 'react';
import { Link } from 'react-router-dom';
import Meta from '../components/Meta';

const ErrorScreen = () => {
    return (
        <>
            <Meta title='Not Found' />
            <header className="error-page">
                <div>
                    <h1>oops it's a dead end</h1>
                    <Link
                        className="btn us-btn"
                        to="/" style={{ width: 'fit-content' }}>
                        back home
                    </Link>
                </div>
            </header>
        </>
    );
};

export default ErrorScreen;
