import React, { useState, useMemo } from 'react';
import './AddSubscribersWindow.css';
import FloatingWindow from '../FloatingWindow';

const ADD_STAGE_INPUT = 0;
const ADD_STAGE_CONFIRM = 1;

const subscriberRegex = /(?:\+?(\d{1,3}))? ?\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})\s+"([\w ]+)"/g;

function AddSubscribersWindow(props) {
    const {
        cancelHandler,
        addHandler
    } = props;

    const [stage, setStage] = useState(ADD_STAGE_INPUT);
    const [textValue, setTextValue] = useState('');

    const newSubscribers = useMemo(() => {
        const newSubscribersObj = {};
        subscriberRegex.lastIndex = 0;

        while (true) {
            const match = subscriberRegex.exec(textValue);
            if (match) {
                const phone = `+${match[1] || 1}${match[2]}${match[3]}${match[4]}`;
                const name = match[5];
                const auth = 'self';
                const muted = false;
                const group_muted = false;

                const key = phone;
                newSubscribersObj[key] = { phone, name, auth, muted, group_muted };
            } else break;
        }

        return newSubscribersObj;
    }, [textValue]);

    const confirmText = () => setStage(ADD_STAGE_CONFIRM);

    return (
        <FloatingWindow>
            <div className='AddSubscribersWindowContainer'>
                <h3>Add Subscribers</h3>
                {stage === ADD_STAGE_INPUT ? (
                    <textarea
                        placeholder={'1 234 567 8901 "FirstLast"\n1 123 456 7890 "First_Last"'}
                        onChange={event => setTextValue(event.target.value)}
                        value={textValue}
                    />
                ) : null}
                {stage === ADD_STAGE_CONFIRM ? (
                    <div className='AddSubscribersWindowConfirmTable'>
                        {Object.keys(newSubscribers).map(k => (
                            <div key={k} className='AddSubscribersWindowConfirmTableRow'>
                                <p>{newSubscribers[k].phone}</p>
                                <p>{newSubscribers[k].name}</p>
                            </div>
                        ))}
                    </div>
                ) : null}
                <div className='AddSubscribersWindowButtons'>
                    {stage === ADD_STAGE_INPUT ? (
                        <>
                            <button onClick={cancelHandler}>Cancel</button>
                            <button onClick={confirmText}>Next</button>
                        </>
                    ) : null}
                    {stage === ADD_STAGE_CONFIRM ? (
                        <>
                            <button onClick={() => setStage(ADD_STAGE_INPUT)}>Back</button>
                            <button onClick={() => addHandler(newSubscribers)}>Add Subscribers</button>
                        </>
                    ) : null}
                </div>
            </div>
        </FloatingWindow>
    )
}

export default AddSubscribersWindow;