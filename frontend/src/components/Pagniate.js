import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Pagniate = ({ pages, page, path }) => {
  return (
    <>
      {pages > 1 && (
        <Pagination className='mb-0'>
          {[...Array(pages).keys()].map(x => (
            <LinkContainer
              key={x + 69}
              to={`${path}/page/${x + 1}`}>
              <Pagination.Item
                active={x + 1 === page}>
                {x + 1}
              </Pagination.Item>
            </LinkContainer>
          ))}
        </Pagination>)}
    </>
  );
};


export default Pagniate;
