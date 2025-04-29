import { useState, useRef, useEffect } from 'react';
import '../../styles/main.css';

export default function ActivePitchRoom({ room, messages, onSendMessage, userId }) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="active-pitch-room">
      <div className="room-header">
        <h3>{room.name}</h3>
        <p>{room.description}</p>
      </div>
      
      <div className="messages-container">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`message ${msg.senderId === userId ? 'sent' : 'received'}`}
          >
            <div className="message-sender">{msg.senderName}</div>
            <div className="message-text">{msg.text}</div>
            <div className="message-time">
              {new Date(msg.timestamp?.toDate()).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}