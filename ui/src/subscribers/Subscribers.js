import React, { useEffect, useState, useMemo } from 'react';
import './Subscribers.css';
import SyncClient from '../twilio';
import Menu from '../menu/Menu';
import SubscribersTable from './subscribersTable/SubscribersTable';
import ConfirmationWindow from '../floatingWindow/confirmationWindow/ConfirmationWindow';
import LoadingWindow from '../floatingWindow/loadingWindow/LoadingWindow';
import AddSubscribersWindow from '../floatingWindow/addSubscribersWindow/AddSubscribersWindow';
import { from, defer, merge } from 'rxjs';
import { bufferCount, concatMap, map } from 'rxjs/operators';

const parseItem = (item, subscriberData) => {
    const key = item.key;
    const selected = false;
    const phone = item.key;
    const name = item?.value?.name || '';
    const auth = item?.value?.authorized || '';
    const muted = !!item?.value?.muted;
    const group_muted = !!item?.value?.group_muted;

    subscriberData[key] = { selected, phone, name, auth, muted, group_muted };

    return subscriberData;
};

const removeTwilioSubscriber = (key, map) => map.remove(key);

// returns Promise<{ [key]: {subscriber} }>
const setTwilioSubscriber = (key, subscriber, map) =>
    map.set(key, {
        name: subscriber.name,
        phone: subscriber.phone,
        authorized: subscriber.auth,
        muted: subscriber.muted,
        group_muted: subscriber.group_muted
    })
        .then(item => parseItem(item, {}));

const bufferPromises = promiseFactories =>
    from(promiseFactories)
        .pipe(
            map(defer),
            bufferCount(5),
            concatMap(subArray => merge(...subArray))
        )
        .toPromise();

const anis = [
    '+15202010410',
    '+15202105242',
];

function Subscribers(props) {
    const {
        twilioJwt,
        setLoading,
    } = props;

    const [selectedAni, setSelectedAni] = useState(anis[0]);

    // map object from twilio SyncClient
    const [map, setMap] = useState(null);

    // main subscriber state array
    const [subscriberData, setSubscriberData] = useState({});

    // floating window (if any)
    const [floatingWindow, setFloatingWindow] = useState(null);

    const setSubscribers = (subscribers, clobber = false) => {
        setSubscriberData(oldSubscriberData => {
            if (clobber) return { ...subscribers };
            else return { ...oldSubscriberData, ...subscribers };
        });
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
                return bufferPromises(
                    Object.keys(subscribers).map(k => {
                        const newSubscriber = Object.assign({}, subscribers[k], { muted: true });
                        return () => setTwilioSubscriber(k, newSubscriber, map).then(setSubscribers);
                    })
                );
            })
        },
        {
            name: 'Unmute Selected',
            actionHandler: () => confirmedBulkActionHandler('Are you sure you would like to unmute', 'Unmute', subscribers => {
                return bufferPromises(
                    Object.keys(subscribers).map(k => {
                        const newSubscriber = Object.assign({}, subscribers[k], { muted: false });
                        return () => setTwilioSubscriber(k, newSubscriber, map).then(setSubscribers);
                    })
                );
            })
        },
        {
            name: 'Group Mute Selected',
            actionHandler: () => confirmedBulkActionHandler('Are you sure you would like to group mute', 'Group Mute', subscribers => {
                return bufferPromises(
                    Object.keys(subscribers).map(k => {
                        const newSubscriber = Object.assign({}, subscribers[k], { group_muted: true });
                        return () => setTwilioSubscriber(k, newSubscriber, map).then(setSubscribers);
                    })
                );
            })
        },
        {
            name: 'Group Unmute Selected',
            actionHandler: () => confirmedBulkActionHandler('Are you sure you would like to group unmute', 'Group Unmute', subscribers => {
                return bufferPromises(
                    Object.keys(subscribers).map(k => {
                        const newSubscriber = Object.assign({}, subscribers[k], { group_muted: false });
                        return () => setTwilioSubscriber(k, newSubscriber, map).then(setSubscribers);
                    })
                );
            })
        },
        {
            name: 'Make Selected admin',
            actionHandler: () => confirmedBulkActionHandler('Are you sure you would like to make admin', 'Make admin', subscribers => {
                return bufferPromises(
                    Object.keys(subscribers).map(k => {
                        const newSubscriber = Object.assign({}, subscribers[k], { auth: 'admin' });
                        return () => setTwilioSubscriber(k, newSubscriber, map).then(setSubscribers);
                    })
                );
            })
        },
        {
            name: 'Make Selected self',
            actionHandler: () => confirmedBulkActionHandler('Are you sure you would like to make self', 'Make self', subscribers => {
                return bufferPromises(
                    Object.keys(subscribers).map(k => {
                        const newSubscriber = Object.assign({}, subscribers[k], { auth: 'self' });
                        return () => setTwilioSubscriber(k, newSubscriber, map).then(setSubscribers);
                    })
                );
            })
        },
        {
            name: 'Remove Selected',
            actionHandler: () => confirmedBulkActionHandler('Are you sure you would like to remove', 'Remove', subscribers => {
                // call remove API
                return bufferPromises(
                    Object.keys(subscribers).map(k => {
                        return () => removeTwilioSubscriber(k, map).then(() => removeSubscribers([k]));
                    })
                );
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
                        return bufferPromises(
                            Object.keys(subscribers).map(k => {
                                const subscriber = subscribers[k];
                                return () => setTwilioSubscriber(k, subscriber, map).then(setSubscribers);
                            })
                        );
                    }, newSubscribers)}
                />
            )
        }
    ];

    // initial Twilio map grab
    useEffect(() => {
        if (twilioJwt) {
            const syncClient = new SyncClient(twilioJwt);

            syncClient.map(selectedAni)
                .then(setMap, console.error);
        }
    }, [twilioJwt, selectedAni, setLoading]);

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

            map.getItems().then(pageHandler({})).then(subs => setSubscribers(subs, true));
        }
    }, [map]);

    return (
        <>
            {floatingWindow}
            <div className='SubscribersContainer'>
                <div className='SubscribersTitle'>
                    <h2>Subscribers</h2>
                    <select
                        onChange={event => setSelectedAni(event.target.value)}
                        value={selectedAni}
                    >
                        {anis.map(ani => <option value={ani} key={ani}>{ani}</option>)}
                    </select>
                </div>

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