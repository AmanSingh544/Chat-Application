import React from "react";
import './index.css';

export function MessageItem({ text, senderId, clientId, timeStamp, showUsername }) {
  const isSent = senderId === clientId;

  return (
    <>
      <div className={`message ${isSent ? 'sent' : 'received'}`}>
        <span className="username">
          {!isSent && showUsername &&  `~ ${senderId}`}
        </span>

        <span className="text">{text}</span>

        <span className="time">
          {new Date(timeStamp ?? new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isSent && <span className="ticks" style={{ color: 'red', fontSize: '0.8em', marginLeft: '5px' }} >✓</span>}
        </span>
      </div>
    </>
  );
}