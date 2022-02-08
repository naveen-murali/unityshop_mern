import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keyword }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='keyword' content={keyword} />
        </Helmet>
    );
};

Meta.defaultProps = {
    title: 'Welcome to UnityShop',
    keyword: 'smartphones, buy smartphones, cheap smartphones, unityshop',
    description: 'We sell smartphones with best price you can have'
};

export default Meta;
