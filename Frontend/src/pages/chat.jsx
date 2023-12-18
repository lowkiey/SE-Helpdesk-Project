import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [ticketIds, setTicketIds] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backend_url}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const createNewTicket = async () => {
    try {
      // Modify this API call based on your backend endpoint for creating a ticket
      const response = await axios.post(`${backend_url}/tickets/create`, {
        status: 'open', // Set the desired status for the new ticket
      });

      console.log('New Ticket Created:', response.data);

      // After creating the ticket, fetch the updated ticket IDs
      fetchTicketIds();
    } catch (error) {
      console.error('Error creating a new ticket:', error);
    }
  };

  const fetchTicketIds = async () => {
    try {
      // Modify this API call based on your backend endpoint for fetching tickets by status
      const response = await axios.get(`${backend_url}/tickets/getTicketsByStatus/open`, {
        withCredentials: true,
      });

      console.log('API Response:', response.data);

      const ticketIdsArray = response.data.tickets.map((ticket) => ticket._id);
      setTicketIds(ticketIdsArray);
    } catch (error) {
      console.error('Error fetching ticket IDs:', error);
    }
  };

  useEffect(() => {
    // Fetch ticket IDs when the component mounts
    fetchTicketIds();
  }, [selectedUserId]);

  const handleUserClick = (userId) => {
    setSelectedUserId(String(userId));
  };

  return (
    <>
      <div className="container">
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card chat-app">
              <div className="people-list">
                <ul>
                  {users.map((user) => (
                    <li key={user.id} onClick={() => handleUserClick(user.id)}>
                      {user.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="chats">
                {ticketIds.length > 0 ? (
                  ticketIds.map((ticketId) => (
                    <div key={ticketId}>
                      <p>Ticket ID: {ticketId}</p>
                    </div>
                  ))
                ) : (
                  <p>No ticket IDs available.</p>
                )}
              </div>

              <div className="chat">
                <div className="selected-user">
                  {selectedUserId && (
                    <p>Selected User: {users.find((user) => user.id === selectedUserId)?.name}</p>
                  )}
                </div>

                <div className="chat-history">
                  {/* The chat history section (if needed) */}
                </div>

                <div className="chat-message clearfix">
                  <div className="input-group mb-0">
                    <input type="text" className="form-control" placeholder="Enter text here..." />
                    <button onClick={createNewTicket}>start chat</button>
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
