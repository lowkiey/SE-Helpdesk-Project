// ChatBox.jsx

import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const ChatBox = ({ agentId, chatMessages, onSendMessage, onClose }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Chat with Agent {agentId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
          {chatMessages.map((msg, index) => (
            <p key={index}>
              <strong>{msg.sender}:</strong> {msg.message}
            </p>
          ))}
        </div>
        <Form>
          <Form.Control
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChatBox;
