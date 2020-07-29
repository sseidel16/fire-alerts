import React from 'react';
import './FloatingWindow.css'

function FloatingWindow(props) {
    return (
        <div className='FloatingWindowContainer'>
            <div className='FloatingWindowCenter'>
                {props.children}
            </div>
        </div>
    );
}

export default FloatingWindow;