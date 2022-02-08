import React, { useEffect, useRef } from 'react';
import { Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { hideAlert } from '../actions/mainAlertActions';

const MainAlert = ({ variant, message }) => {
  const ref = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const alert = ref.current;
    setTimeout(() => alert.style.top = '6%', 0);

    const timer = setTimeout(() => {
      dispatch(hideAlert());
    }, 2000);

    // return () => {
    //   setTimeout(() => alert.style.top = '-10%', 0);
    //   clearTimeout(timer);
    // };
  });

  return (
    <Alert variant={variant}
      className='position-fixed shadow rounded-2 col-xl-3 col-md-5 col-11 text-center'
      ref={ref}
      style={{
        top: '-10%',
        left: '50%',
        transform: 'translate(-50%, 0%)',
        transition: 'all 0.5s ease'
      }}>
      {message}
    </Alert>
  );
};

MainAlert.defaultProps = {
  variant: 'info',
};

export default MainAlert;
