import React, { useMemo } from 'react';
import './SubscribersTable.css';
import Selector, { STATE_UNSELECTED, STATE_SELECTED, STATE_PARTIAL } from '../../selector/Selector';

function SubscribersTable(props) {
    const {
        subscriberData,
        setSelected
    } = props;

    const subscriberDataArr = useMemo(() => Object.keys(subscriberData).map(k => subscriberData[k]), [subscriberData]);

    const headerSelectedState = useMemo(() => {
        let unselected = 0;
        let selected = 0;

        subscriberDataArr.some(subscriber => {
            if (subscriber.selected) selected++;
            else unselected++;
            return selected > 0 && unselected > 0;
        });

        if (selected === 0) return STATE_UNSELECTED;
        else if (unselected === 0) return STATE_SELECTED;
        else return STATE_PARTIAL;
    }, [subscriberDataArr]);

    return (
        <div className='SubscribersTableContainer'>
            <div className='SubscribersTableRow'>
                <Selector
                    state={headerSelectedState}
                    stateHandler={newState => setSelected(Object.keys(subscriberData), newState === STATE_SELECTED)}
                />
                <h3 key={'phone'} className='SubscribersTableHeader'>Phone</h3>
                <h3 key={'name'} className='SubscribersTableHeader'>Name</h3>
                <h3 key={'auth'} className='SubscribersTableHeader'>Auth</h3>
            </div>
            {Object.keys(subscriberData).map(k => (
                <div key={k} className='SubscribersTableRow'>
                    <Selector
                        state={subscriberData[k].selected ? STATE_SELECTED : STATE_UNSELECTED}
                        stateHandler={newState => setSelected([k], newState === STATE_SELECTED)}
                    />
                    <p key={'name'} className='SubscribersTableCell'>{(subscriberData[k].muted ? '🔇' : '') + subscriberData[k].name}</p>
                    <p key={'phone'} className='SubscribersTableCell'>{subscriberData[k].phone}</p>
                    <p key={'auth'} className='SubscribersTableCell'>{subscriberData[k].auth}</p>
                </div>
            ))}
        </div>
    );
}

export default SubscribersTable;