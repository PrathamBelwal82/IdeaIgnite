import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import '../src/QA.css';
import Cookies from 'js-cookie';

const socket = io('http://localhost:4000'); // Adjust this to your backend URL

function QASession() {
  const { id } = useParams(); // Get the event ID from the URL
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null); // To track which message you are replying to

  useEffect(() => {
    socket.emit('joinRoom', id);
  
    socket.on('loadMessages', (previousMessages) => {
      console.log('Previous Messages:', previousMessages); // Log received messages
      setMessages(previousMessages);
    });
  
    socket.on('newMessage', (msg) => {
      console.log('New Message Received:', msg); // Log new messages
      setMessages((prev) => [...prev, msg]);
    });
  
    socket.on('newReply', (updatedMessage) => {
      console.log('New Reply Received:', updatedMessage); // Log updated message with replies
      setMessages((prevMessages) =>
        prevMessages.map((msg) => 
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });
  
    return () => {
      socket.emit('leaveRoom', id);
    };
  }, [id]);
  

  const sendMessage = () => {
    if (message.trim()) {
      const username = Cookies.get('userName'); // Function to get username from cookies
      socket.emit('qaMessage', { eventId: id, message, username });
      setMessage('');
    }
  };

  const sendReply = () => {
    if (replyMessage.trim() && replyTo) {
      const username = Cookies.get('userName'); // Function to get username from cookies
      socket.emit('newReply', { reply: replyMessage, replyTo, username, eventId: id }); // Include eventId
      setReplyMessage('');
      setReplyTo(null); // Clear the reply target
    }
  };

  const handleReply = (msgId) => {
    setReplyTo(msgId); // Set the message ID you are replying to
  };

  return (
    <div>
      <h3>Q&A Session</h3>
      <div className="message-box">
        {messages.map((msg) => (
          <div key={msg._id}>
            <p><strong>{msg.username}</strong>: {msg.message}</p>
            <button onClick={() => handleReply(msg._id)}>Reply</button>
            {msg.replies && msg.replies.map((reply, replyIndex) => (
              <div key={`${msg._id}-${replyIndex}`} style={{ marginLeft: '20px' }}>
                <p><strong>{reply.username}</strong>: {reply.message}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={replyTo ? replyMessage : message}
        onChange={(e) => replyTo ? setReplyMessage(e.target.value) : setMessage(e.target.value)}
        placeholder={replyTo ? 'Reply...' : 'Ask a question...'}
      />
      <button onClick={replyTo ? sendReply : sendMessage}>{replyTo ? 'Send Reply' : 'Send'}</button>
    </div>
  );
}

export default QASession;
