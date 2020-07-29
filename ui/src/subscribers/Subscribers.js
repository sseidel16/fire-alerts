import React, { useEffect, useState, useMemo } from 'react';
import './Subscribers.css';
import SyncClient from '../twilio';
import Menu from '../menu/Menu';
import SubscribersTable from './subscribersTable/SubscribersTable';
import ConfirmationWindow from '../floatingWindow/confirmationWindow/ConfirmationWindow';
import LoadingWindow from '../floatingWindow/loadingWindow/LoadingWindow';
import AddSubscribersWindow from '../floatingWindow/addSubscribersWindow/AddSubscribersWindow';

const parseItem = (item, subscriberData) => {
    const key = item.key;
    const selected = false;
    const phone = item.key;
    const name = item?.value?.name || '';
    const auth = item?.value?.authorized || '';
    const muted = (item?.value?.muted || '').toString();
    const group_muted = (item?.value?.group_muted || '').toString();

    subscriberData[key] = { selected, phone, name, auth, muted, group_muted };

    return subscriberData;
};

const removeTwilioSubscriber = (key, map) => map.remove(key);
const setTwilioSubscriber = (key, subscriber, map) =>
    map.set(key, { name: subscriber.name, phone: subscriber.phone })
        .then(item => parseItem(item, {}));

function Subscribers(props) {
    const {
        twilioJwt
    } = props;

    // map object from twilio SyncClient
    const [map, setMap] = useState(null);

    // main subscriber state array
    const [subscriberData, setSubscriberData] = useState({});

    // floating window (if any)
    const [floatingWindow, setFloatingWindow] = useState(null);

    const setSubscribers = subscribers => {
        setSubscriberData(oldSubscriberData => Object.assign({}, oldSubscriberData, subscribers));
    };

    const removeSubscribers = keys => {
        setSubscriberData(oldSubscriberData => {
            const newSubscriberData = { ...oldSubscriberData };
            keys.forEach(key => delete newSubscriberData[key]);
            return newSubscriberData;
        });
    };

    // set subscriber selected flags for keys
    const setSelected = (keys, selected) => {
        setSubscriberData(oldSubscriberData => {
            const newSubscriberData = { ...oldSubscriberData };
            keys.forEach(k => newSubscriberData[k] = { ...newSubscriberData[k], selected });
            return newSubscriberData;
        });
    };

    const getSelected = () => {
        const selectedSubscriberData = {};
        Object.keys(subscriberData)
            .filter(k => subscriberData[k].selected)
            .forEach(k => selectedSubscriberData[k] = subscriberData[k]);
        return selectedSubscriberData;
    }

    // enable bulk actions menu if anybody is selected
    const bulkActionsEnabled = useMemo(() =>
        Object.keys(subscriberData).map(k => subscriberData[k])
            .some(subscriber => subscriber.selected),
        [subscriberData]
    );

    const confirmedBulkActionHandler = (question, action, confirmedActionHandler, selectedSubscribers) => {
        if (!selectedSubscribers) selectedSubscribers = getSelected();
        const selectedNum = Object.keys(selectedSubscribers).length;
        const subject = `${selectedNum} subscriber${selectedNum === 1 ? '' : 's'}`;
        setFloatingWindow(
            <ConfirmationWindow
                header={`${action} Confirmation`}
                message={`${question} ${subject}?`}
                options={[`${action} ${subject}`, 'Cancel']}
                optionHandler={optionIndex => {
                    Promise.resolve()
                        .then(() => setFloatingWindow(<LoadingWindow message='Loading' />))
                        .then(() => {
                            if (optionIndex === 0) return confirmedActionHandler(selectedSubscribers);
                        })
                        .finally(() => setFloatingWindow(null));
                }}
            />
        );
    };
    const bulkActions = [
        {
            name: 'Mute Selected',
            actionHandler: () => confirmedBulkActionHandler('Are you sure you would like to mute', 'Mute', subscribers => {
                // call mute API
                return Promise.all(
                    Object.keys(subscribers).map(k => {
                        const subscriber = subscribers[k];
                        subscriber.muted = true;
                        return setTwilioSubscriber(k, subscriber, map)
                    })
                )
                    .then(arr => Object.assign(...arr))
                    .then(setSubscribers);
            })
        },
        {
            name: 'Unmute Selected',
            actionHandler: () => confirmedBulkActionHandler('Are you sure you would like to unmute', 'Unmute', subscribers => {
                // call unmute API
                return Promise.all(
                    Object.keys(subscribers).map(k => {
                        const subscriber = subscribers[k];
                        subscriber.muted = false;
                        return setTwilioSubscriber(k, subscriber, map)
                    })
                )
                    .then(arr => Object.assign(...arr))
                    .then(setSubscribers);
            })
        },
        {
            name: 'Remove Selected',
            actionHandler: () => confirmedBulkActionHandler('Are you sure you would like to remove', 'Remove', subscribers => {
                // call remove API
                return Promise.all(
                    Object.keys(subscribers).map(k => {
                        return removeTwilioSubscriber(k, map).then(() => k)
                    })
                )
                    .then(removeSubscribers);
            })
        },
    ];

    const globalActions = [
        {
            name: 'Add Subscribers',
            actionHandler: () => setFloatingWindow(
                <AddSubscribersWindow
                    cancelHandler={() => setFloatingWindow(null)}
                    addHandler={newSubscribers => confirmedBulkActionHandler('Are you sure you would like to add', 'Add', subscribers => {
                        console.log(subscribers);
                        // call add API
                        return Promise.all(
                            Object.keys(subscribers).map(k => {
                                const subscriber = subscribers[k];
                                return setTwilioSubscriber(k, subscriber, map)
                            })
                        )
                            .then(arr => Object.assign(...arr))
                            .then(setSubscribers);
                    }, newSubscribers)}
                />
            )
        }
    ];

    // initial Twilio map grab
    useEffect(() => {
        if (twilioJwt) {
            const syncClient = new SyncClient(twilioJwt);

            syncClient.map('+15202010410').then(setMap, console.error);
        }
    }, [twilioJwt]);

    // initial Twilio data grab
    useEffect(() => {
        if (map) {
            const pageHandler = subscriberObj => paginator => {
                paginator.items.forEach(item => {
                    console.log(item);

                    parseItem(item, subscriberObj);
                });
                return paginator.hasNextPage ? paginator.nextPage().then(pageHandler(subscriberObj)) : subscriberObj;
            };

            map.getItems().then(pageHandler({})).then(setSubscribers);
        }
    }, [map]);

    return (
        <>
            {floatingWindow}
            <div className='SubscribersContainer'>
                <h2>Subscribers</h2>

                <div className='SubscribersBanner'>
                    <div className='SubscribersBannerLeft'>
                        <Menu
                            disabled={!bulkActionsEnabled}
                            header={'Actions'}
                            options={bulkActions.map(bulkAction => bulkAction.name)}
                            optionHandler={optionIndex => bulkActions[optionIndex].actionHandler()}
                        />
                    </div>
                    <div className='SubscribersBannerRightFixed'>
                        <Menu
                            header={'More'}
                            options={globalActions.map(globalAction => globalAction.name)}
                            optionHandler={optionIndex => globalActions[optionIndex].actionHandler()}
                        />
                    </div>
                </div>

                <SubscribersTable
                    subscriberData={subscriberData}
                    setSelected={setSelected}
                />
            </div>
        </>
    );
}

export default Subscribers;