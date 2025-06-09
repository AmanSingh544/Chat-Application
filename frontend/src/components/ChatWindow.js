import React, { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';
import './index.css';
import { getRelativeDateLabels } from '../utils/dateCalculation';

export function ChatWindow({ messages, clientId }) {
    const meesageEndRef = useRef(null);

    useEffect(() => {
        if(meesageEndRef.current){
            meesageEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [messages]);

    let lastDateLabel = null;

    return (
        <div className="messages" id="messages">
            {messages.map((msg, index) => {
                const currentDateLabel = getRelativeDateLabels(msg.createdAt ?? new Date().toISOString());
                const showDateLabel = currentDateLabel !== lastDateLabel;
                lastDateLabel = currentDateLabel;
                const showUsername = index === 0 || messages[index - 1].senderId !== msg.senderId;

                return (
                    <React.Fragment key={index}>
                        {showDateLabel && (
                            <div className="messageTimelabel">
                                <span className='text'>{currentDateLabel}</span>
                            </div>
                        )}
                        <MessageItem
                            text={msg.text}
                            senderId={msg.senderId}
                            clientId={clientId}
                            timeStamp={msg.createdAt}
                            showUsername={showUsername}
                        />
                    </React.Fragment>
                );
            })}
            <div ref={meesageEndRef} />
        </div>
    );
}
