import React from 'react';
import './LoadingWindow.css';
import Loading from '../../loading/Loading';
import FloatingWindow from '../FloatingWindow';

function LoadingWindow(props) {
    const {
        message
    } = props;

    return (
        <FloatingWindow>
            <div className='LoadingWindowContainer'>
                <Loading message={message} />
            </div>
        </FloatingWindow>
    );
}

export default LoadingWindow;