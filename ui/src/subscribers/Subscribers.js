import React, { useEffect, useState } from 'react';
import './Subscribers.css';
import SyncClient from 'twilio-sync';

function Subscribers(props) {
    const {
        twilioJwt
    } = props;

    const [subscriberData, setSubscriberData] = useState([]);

    useEffect(() => {
        if (twilioJwt) {
            const syncClient = new SyncClient(twilioJwt);

            syncClient.map('+15202010410').then(map => {
                const pageHandler = subscriberArray => paginator => {
                    paginator.items.forEach(item => {
                        // This leaks various sids...
                        console.log(item);

                        const phone = item.key;
                        const name = item?.value?.name || '';
                        const auth = item?.value?.authorized || '';
                        // Is there a better way to handle converting a boolean
                        // to a string while also handling 'undefined'?
                        const muted = (item?.value?.muted || '').toString();
                        const group_muted = (item?.value?.group_muted || '').toString();

                        subscriberArray.push(
                            { phone, name, auth, muted, group_muted })
                    });
                    return paginator.hasNextPage ?
                        paginator.nextPage().then(pageHandler(subscriberArray)) :
                        subscriberArray.sort((a, b) => a.name.localeCompare(b.name));
                };
                return map.getItems({ order: 'asc' })
                    .then(pageHandler([]))
                    .then(setSubscriberData);
            }, console.error);
        }
    }, [twilioJwt]);

    const tableHeaders = [
        { name: 'Phone', key: 'phone' },
        { name: 'Name', key: 'name' },
        { name: 'Auth', key: 'auth' },
        { name: 'Muted', key: 'muted' },
        { name: 'Group muted', key: 'group_muted'}
    ];

    return (
        <div className='SubscribersContainer'>
            <h2>Subscribers</h2>
            <div className='SubscribersTable'>
                <div className='SubscribersTableRow'>
                    {tableHeaders.map(header => <h3 key={header.key} className='SubscribersTableHeader'>{header.name}</h3>)}
                </div>
                {subscriberData.map(subscriber => (
                    <div key={subscriber.phone} className='SubscribersTableRow'>
                        {tableHeaders.map(header => <p key={header.key} className='SubscribersTableCell'>{subscriber[header.key]}</p>)}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Subscribers;