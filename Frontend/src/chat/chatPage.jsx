import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const ChatComponent = ({ socket }) => {
  const typingTimeout = 500; // milliseconds

  const [toggleButtonText, setToggleButtonText] = useState("Disconnect");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [displayName, setDisplayName] = useState("User"); // Default to "User" if display name is not available
  let typingIndicatorTimeout;

  const toggleConnection = (e) => {
    e.preventDefault();
    if (socket && socket.connected) {
      setToggleButtonText("Connect");
      socket.disconnect();
    } else if (socket) {
      setToggleButtonText("Disconnect");
      socket.connect();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket && inputValue) {
      socket.emit("chat message", inputValue);
      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    clearTimeout(typingIndicatorTimeout);
    if (socket) {
      socket.emit("typing");
      typingIndicatorTimeout = setTimeout(() => {
        socket.emit("stop typing");
      }, typingTimeout);
    }
  };

  const appendMessage = (msg) => {
    const formattedTime = getFormattedTime();
    const newMessage = (
      <li key={messages.length} className="list-group-item">
        <strong>{displayName}</strong>: {msg} ({formattedTime})
      </li>
    );
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    window.scrollTo(0, document.body.scrollHeight);
  };

  const showTypingIndicator = (user) => {
    const indicator = (
      <li key={`typing-${user}`} className="list-group-item typing-indicator">
        <i className="bi bi-chat-dots"></i> {user} is typing...
      </li>
    );
    setMessages((prevMessages) => [...prevMessages, indicator]);
    window.scrollTo(0, document.body.scrollHeight);
  };

  const hideTypingIndicator = () => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => !msg.props || !msg.props.className || !msg.props.className.includes("typing-indicator"))
    );
  };

  const getFormattedTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    // Fetch the user information, including the display name, from the server
    const fetchUserInformation = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("role");

        // Set the display name in the state
        setDisplayName( "User"); // Default to "User" if display name is not available
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUserInformation();

    if (!socket) {
      return;
    }

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
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
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
  );
};

ChatComponent.propTypes = {
  socket: PropTypes.shape({
    connected: PropTypes.bool,
    emit: PropTypes.func,
    on: PropTypes.func,
    disconnect: PropTypes.func,
    connect: PropTypes.func, // Add this line to include the 'connect' method
  }),
};


export default ChatComponent;
