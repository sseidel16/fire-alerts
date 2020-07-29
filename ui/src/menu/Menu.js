import React, { useState } from 'react';
import './Menu.css';

function Menu(props) {
    const {
        header,
        options = [],
        optionHandler,
        disabled
    } = props;

    const [expanded, setExpanded] = useState(false);

    const floatingContainerStyles = ['MenuFloatingContainer'];
    if (expanded) floatingContainerStyles.push('MenuFloatingContainerExpanded');

    return (
        <div className='MenuContainer'>
            <button
                disabled={disabled}
                onClick={() => setExpanded(exp => !exp)}
            >{expanded ? 'Cancel' : header}</button>
            <div className='MenuFloatingParent'>
                <div className={floatingContainerStyles.join(' ')}>
                    {options.map((option, index) =>
                        <button
                            key={option}
                            onClick={() => {
                                setExpanded(false);
                                optionHandler(index);
                            }}
                        >{option}</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Menu;