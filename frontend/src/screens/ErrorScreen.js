import React from 'react';
import { Link } from 'react-router-dom';

const ErrorScreen = () => {
    return (
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
    );
};

export default ErrorScreen;
