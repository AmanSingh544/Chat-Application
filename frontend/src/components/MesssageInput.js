import React, { useState } from 'react';
import Picker from 'emoji-picker-react';
//import './MessageInput.css'; // optional for custom styling

const MessageInput = ({ onSend, emitTyping }) => {
  const [message, setMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
      emitTyping(false);
    }
  };

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    emitTyping(e.target.value.length > 0);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
      <button
        onClick={() => setShowPicker((prev) => !prev)}
        style={{ marginRight: '5px' }}
      >
        😊
      </button>

      {showPicker && (
        <div style={{ position: 'absolute', bottom: '50px', zIndex: 1000 }}>
          <Picker onEmojiClick={onEmojiClick} />
        </div>
      )}

      <input
        type="text"
        value={message}
        onChange={handleChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type a message..."
        style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      <button onClick={handleSend} style={{ marginLeft: '10px' }}>
        Send
      </button>
    </div>
  );
};

export default MessageInput;
