import React from 'react';
import './Selector.css';

export const STATE_UNSELECTED = 0;
export const STATE_PARTIAL = 1;
export const STATE_SELECTED = 2;

function Selector(props) {
    const {
        state,
        stateHandler
    } = props;

    const selectorCenterStyles = ['SelectorCenter'];
    if (state === STATE_UNSELECTED) selectorCenterStyles.push('SelectorCenterUnselected');
    if (state === STATE_PARTIAL) selectorCenterStyles.push('SelectorCenterPartial');
    if (state === STATE_SELECTED) selectorCenterStyles.push('SelectorCenterSelected');

    return (
        <div className='SelectorContainer' onClick={() => stateHandler(state === STATE_SELECTED ? STATE_UNSELECTED : STATE_SELECTED)}>
            <div className={selectorCenterStyles.join(' ')} />
        </div>
    );
}

export default Selector;