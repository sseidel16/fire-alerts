import React from 'react';
import './Loading.css';

function Loading(props) {
    const {
        message
    } = props;

    return (
        <div className='LoadingContainer'>
            <div className='LoadingSpinner' />
            <p className='LoadingText'>{message}</p>
        </div>
    )
}

export default Loading;