import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const ChatComponent = () => {
  const socket = io();
  const typingTimeout = 500; // milliseconds

  const [toggleButtonText, setToggleButtonText] = useState("Disconnect");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  let typingIndicatorTimeout;

  const toggleConnection = (e) => {
    e.preventDefault();
    if (socket.connected) {
      setToggleButtonText("Connect");
      socket.disconnect();
    } else {
      setToggleButtonText("Disconnect");
      socket.connect();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue) {
      socket.emit("chat message", inputValue);
      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    clearTimeout(typingIndicatorTimeout);
    socket.emit("typing");
    typingIndicatorTimeout = setTimeout(() => {
      socket.emit("stop typing");
    }, typingTimeout);
  };

  const appendMessage = (msg) => {
    const newMessages = [...messages, msg];
    setMessages(newMessages);
    window.scrollTo(0, document.body.scrollHeight);
  };

  const showTypingIndicator = (user) => {
    const indicator = (
      <li key={`typing-${user}`} className="typing-indicator">
        <i className="bi bi-chat-dots"></i> {user} is typing...
      </li>
    );
    setMessages([...messages, indicator]);
    window.scrollTo(0, document.body.scrollHeight);
  };

  const hideTypingIndicator = () => {
    const filteredIndicators = messages.filter(
      (msg) => !msg.props.className || !msg.props.className.includes("typing-indicator")
    );
    setMessages(filteredIndicators);
  };

  const getFormattedTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    socket.on("chat message", (msg) => {
      appendMessage(msg);
    });

    socket.on("typing", (user) => {
      showTypingIndicator(user);
    });

    socket.on("stop typing", () => {
      hideTypingIndicator();
    });

    return () => {
      // Cleanup: disconnect the socket when the component is unmounted
      socket.disconnect();
    };
  }, [socket, messages]);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <div className="card mt-4">
              <div className="card-header bg-dark text-white">Chat</div>
              <ul id="messages" className="list-group">
                {messages.map((msg, index) => (
                  <li key={index} className="list-group-item">
                    {msg}
                  </li>
                ))}
              </ul>
              <div className="card-footer">
                <form id="form" className="form-inline" onSubmit={handleSubmit}>
                  <input
                    id="input"
                    className="form-control"
                    autoComplete="off"
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={handleInputChange}
                  />
                  <button className="btn btn-primary" type="submit">
                    Send
                  </button>
                  <button id="toggle-btn" className="btn btn-danger ml-2" onClick={toggleConnection}>
                    {toggleButtonText}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatComponent;