import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button, Card } from 'react-bootstrap';

const ConfirmAlert = (props) => {
    return ReactDOM.createPortal(
        <AlertBox {...props} />,
        document.getElementById('alertMessage')
    );
};

const AlertBox = ({ show, confirmAction, cancelAction, message }) => {
    const [state, setState] = useState(false);
    const [showCard, setShowCard] = useState(false);

    useEffect(() => {
        if (show) {
            setState(true);
            setTimeout(() => {
                setShowCard(true);
            }, 0);
        } else {
            setTimeout(() => {
                setShowCard(false);
            }, 0);
            setTimeout(() => {
                setState(false);
            }, 400);
        }
    }, [show]);

    return (
        <div className={state ? 'confirmAlert show' : 'confirmAlert'}>
            <Card
                className={showCard
                    ? ' border-0 rounded-2 shadow confrimAlert-card p-2 show'
                    : 'border-0 rounded-2 shadow confrimAlert-card p-2 hide'}
                style={{ minWidth: '18rem', maxWidth: '30rem' }}>
                <Card.Body>
                    <Card.Title className='text-center m-0' as='h4'>
                        <div>
                            <i className="far fa-question-circle pb-2" style={{ fontSize: '50px' }}></i>
                        </div>
                        Are You Sure?
                    </Card.Title>
                    <Card.Text
                        className='py-3 text-dark letter-spacing-1 text-center'
                        style={{ textTransform: 'none', display: 'inline-block !important' }}
                        as='h4'>
                        {message}
                    </Card.Text>
                    <div className='d-flex justify-content-evenly'>
                        <Button
                            onClick={confirmAction}
                            className='btn-outline-primary us-btn-outline'
                            style={{ width: 'fit-content' }}>
                            Confrim
                        </Button>
                        <Button
                            onClick={cancelAction}
                            className='btn-danger us-btn-danger-outline'
                            style={{ width: 'fit-content' }}>
                            cancel
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ConfirmAlert;
