import React, { useState, useEffect } from 'react';
import '../stylesheets/chat.css'; // Replace 'chat.css' with the actual name of your CSS file
import axios from 'axios';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [loggedInAgentId, setLoggedInAgentId] = useState(''); // Set the logged-in agent's ID here
  const [error, setError] = useState(null);

  useEffect(() => {
    // Make an API call to get tickets for the logged-in agent
    const fetchTickets = async () => {
      try {
        // Adjust the API endpoint to match your backend route
        const response = await axios.get('/api/tickets');
        console.log('API Response:', response.data); // Log the response to the console

        const tickets = response.data.tickets.filter(
          (ticket) => ticket.AgentId === loggedInAgentId
        );

        if (tickets.length === 0) {
          setError('No chats found for the logged-in agent.');
        } else {
          setError(null); // Reset error state if there are chats
        }

        setChats(tickets);

        console.log('Chats:', chats); // Log the chats array
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError('Error fetching tickets. Please try again.'); // Set error state for network error
      }
    };

    if (loggedInAgentId) {
      fetchTickets();
    }
  }, [loggedInAgentId]);

  return (
    <>
      <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />

      <div className="container">
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card chat-app">
              <div id="plist" className="people-list">
                
                <div className="input-group">
                  <div className="input-group-prepend"></div>
                </div>
              </div>
              <div className="chat">
                <div className="chat-header clearfix">
                  <div className="row">
                    <div className="col-lg-6">
                      <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                        <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar" />
                      </a>
                      <div className="chat-about"></div>
                    </div>
                  </div>
                </div>
                <div className="chat-history">
                  {/* Display chats here using the 'chats' state */}
                  {error ? (
                    <div className="error-message">{error}</div>
                  ) : (
                    chats.map((chat) => (
                      <div key={chat._id}>{/* Display individual chat items */}</div>
                    ))
                  )}
                </div>
                <div className="chat-message clearfix">
                  <div className="input-group mb-0">
                    <input type="text" className="form-control" placeholder="Enter text here..." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
