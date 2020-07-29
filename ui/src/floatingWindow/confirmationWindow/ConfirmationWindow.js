import React from 'react';
import './ConfirmationWindow.css';
import FloatingWindow from '../FloatingWindow';

function ConfirmationWindow(props) {
    const {
        header,
        message,
        options,
        optionHandler
    } = props;

    return (
        <FloatingWindow>
            <div className='ConfirmationWindowContainer'>
                {header ? <h3>{header}</h3> : null }
                {message ? <p>{message}</p> : null }
                {options.map((option, index) =>
                    <button key={option} onClick={() => optionHandler(index)}>{option}</button>
                )}
            </div>
        </FloatingWindow>
    );
}

export default ConfirmationWindow;