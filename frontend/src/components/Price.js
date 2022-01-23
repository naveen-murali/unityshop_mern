import React from 'react';

const Price = ({ price }) => {
    return (
        <>
            <span style={{ whiteSpace: 'nowrap' }}>
                {`₹ ${new Intl.NumberFormat('en-IN', {
                    currency: 'INR'
                }).format(price)}`}
            </span>
        </>
    );
};

export default Price;
