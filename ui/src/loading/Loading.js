import React from 'react';
import './Loading.css';

function Loading(props) {
    const {
        message
    } = props;

    return (
        <div className='LoadingContainer'>
            <div className='LoadingSpinner' />
            {message ? <p className='LoadingText'>{message}</p> : null}
        </div>
    )
}

export default Loading;