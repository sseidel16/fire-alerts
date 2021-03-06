import React, { useMemo } from 'react';
import './SubscribersTable.css';
import Selector, { STATE_UNSELECTED, STATE_SELECTED, STATE_PARTIAL } from '../../selector/Selector';

const sortKey = 'name';
const sortDir = 1;

function SubscribersTable(props) {
    const {
        subscriberData,
        setSelected
    } = props;

    const subscriberDataArr = useMemo(() => {
        return Object.keys(subscriberData)
            .map(k => ({ ...subscriberData[k], key: k }))
            .sort((a, b) => {
                const upperA = String(a[sortKey]).toLocaleUpperCase();
                const upperB = String(b[sortKey]).toLocaleUpperCase();
                return sortDir * upperA.localeCompare(upperB);
            });
    }, [subscriberData]);

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
            {subscriberDataArr.map(subscriber => {
                const { key, selected, name, phone, auth, muted, group_muted } = subscriber;

                const nameStyles = ['SubscribersTableCell'];
                if (group_muted) nameStyles.push('SubscribersTableCellGroupMuted');
                return (<div key={key} className='SubscribersTableRow'>
                    <Selector
                        state={selected ? STATE_SELECTED : STATE_UNSELECTED}
                        stateHandler={newState => setSelected([key], newState === STATE_SELECTED)}
                    />
                    <p key={'name'} className={nameStyles.join(' ')}>{(muted ? '🔇' : '') + name}</p>
                    <p key={'phone'} className='SubscribersTableCell'>{phone}</p>
                    <p key={'auth'} className='SubscribersTableCell'>{auth}</p>
                </div>);
            })}
        </div>
    );
}

export default SubscribersTable;