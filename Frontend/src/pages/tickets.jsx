import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Tickets = () => {
  const navigate = useNavigate();
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [issueData, setIssueData] = useState([]);
  const [TicketData, setTicketData] = useState([]);
  const [tickets, setTickets] = useState([]);


  useEffect(() => {
    async function fetchIssueData() {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/updateTicket/issues");
        setIssueData(response.data); // Update state with fetched issue data
      } catch (error) {
        console.error('Error fetching issue data:', error);
        // Handle errors, such as displaying an error message
      }
    }
    async function fetchTickets() {
        try {
            const response = await axios.get(`${backend_url}/tickets`, {
                withCredentials: true,
              });                          
          console.log("response", response);
  
          setTickets(response.data.tickets);
        } catch (error) {
          console.log("Error fetching user data:", error);
          navigate("/"); // Redirect to login page on error
        }
      }
    fetchTickets();
    fetchIssueData();
  }, []);

  const handleCreateTicketClick = () => {
    setTicketModalVisible(true);
  };

  const handleCloseModal = () => {
    setTicketModalVisible(false);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);

    switch (selectedCategory) {
      case '1': // Hardware
        setSubCategoryOptions(['Desktops', 'Laptops', 'Printers', 'Servers', 'Networking equipment']);
        break;
      case '2': // Software
        setSubCategoryOptions(['Operating system', 'Application software', 'Custom software', 'Integration issues']);
        break;
      case '3': // Network
        setSubCategoryOptions(['Email issues', 'Internet connection problems', 'Website errors']);
        break;
      default:
        setSubCategoryOptions([]);
        break;
    }
  };

  return (
    <>
      <h2 style={{ textAlign: 'center', margin: '20px 0' }}>Previous Tickets</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Status</th>
            <th>Subcategory</th>
            {/* Add more columns if needed */}
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id}>
              <td>{ticket._id}</td>
              <td>{ticket.category}</td>
              <td>{ticket.status}</td>
              <td>{ticket.subCategory}</td>
              {/* Render other ticket data in respective columns */}
            </tr>
          ))}
        </tbody>
</table>
      <div>
        <button onClick={handleCreateTicketClick}>Create New Ticket</button>
        {ticketModalVisible && (
          <div className="ticket-modal">
            <div className="input-group mb-3">
              <span className="input-group-text">@</span>
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInputGroup1"
                  placeholder="Username"
                />
                <label htmlFor="floatingInputGroup1">Username</label>
              </div>
            </div>
            <div className="input-group mb-3">
              <label className="input-group-text" htmlFor="inputGroupSelect01">
                Category 
              </label>
              <select className="form-select" id="inputGroupSelect01" onChange={handleCategoryChange}>
                <option value="">Choose...</option>
                <option value="1">Hardware</option>
                <option value="2">Software</option>
                <option value="3">Network</option>
              </select>
            </div>
            {selectedCategory && (
              <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="inputGroupSelect02">
                  Sub-Category
                </label>
                <select className="form-select" id="inputGroupSelect02">
                  <option value="">Choose...</option>
                  {subCategoryOptions.map((subOption, index) => (
                    <option key={index} value={subOption}>
                      {subOption}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-floating">
              <textarea
                className="form-control"
                placeholder="Leave a comment here"
                id="floatingTextarea2"
                style={{ height: '100px' }}
              ></textarea>
              <label htmlFor="floatingTextarea2">Comments</label>
            </div>
            <button onClick={handleCloseModal}>Save</button>
            <button onClick={handleCloseModal}>Cancel</button>
          </div>
        )}
      </div>
    </>
  );
};
export default Tickets;

//previous ticket table
//workflow correct