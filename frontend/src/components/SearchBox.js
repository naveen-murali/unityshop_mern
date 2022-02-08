import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const SearchBox = ({ enterKeyword, initialValue }) => {
    const [keyword, setKeyword] = useState(initialValue);

    const submitHandler = (e) => {
        e.preventDefault();
        if (!keyword)
            enterKeyword('');
        if (keyword.trim())
            enterKeyword(keyword);
        return;
    };

    return <>
        <Form
            onSubmit={submitHandler}
            className='d-flex align-items-center search'>

            <Form.Control
                type='text'
                name='keyword'
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder='Search'
                className='mr-sm-2 border ml-sm-5 search-input' />
            <Button
                type='submit'
                className='us-btn search-btn rounded-0'
                style={{ width: 'fit-content' }}
            >Search</Button>
        </Form>
    </>;
};

export default SearchBox;
