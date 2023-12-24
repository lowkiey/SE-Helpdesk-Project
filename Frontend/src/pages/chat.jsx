import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backend_url = "http://localhost:3000/api/v1";

export default function Chat() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [availableUsers, setAvailableUsers] = useState([]);
    const [userId, setUserId] = useState(""); // New state to hold the user ID

    useEffect(() => {
        async function fetchAvailableUsers() {
            try {
                const response = await axios.get(`${backend_url}/users/availableUsers`, {
                    withCredentials: true,
                });
                console.log("Available users:", response.data.availableUser)
                setAvailableUsers(response.data.availableUser); // Assuming the response contains an array of user objects
            } catch (error) {
                console.log("Error fetching available users:", error);
                // Handle error accordingly
            }
        };

        async function fetchUserData() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.log("No token found, redirecting to login");
                    navigate("/");
                    return;
                }

                const uid = localStorage.getItem("userId");
                const response = await axios.get(`${backend_url}/users/${uid}`, {
                    withCredentials: true,
                });
                setUserName(response.data.displayName);
                setUserId(uid); // Set the user ID state
            } catch (error) {
                console.log("Error fetching user data:", error);
                navigate("/");
            }
        }

        fetchUserData();
        fetchAvailableUsers();
    }, [navigate]);

    const handleSelectUser = (userId) => {
        navigate(`/chats/${userId}`); // Navigate to chat page with the selected user ID
    };

    return (
        <>
            <div className="chat-container">
                <h1>Chats</h1>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Display Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availableUsers.map((availableUser, index) => (
                            <tr key={index}>
                                <td>{availableUser._id}</td>
                                <td>{availableUser.displayName}</td>
                                <td>
                                    <button
                                        className="btn btn-primary start-chat-btn"
                                        onClick={() => handleSelectUser(availableUser._id)}
                                        style={{ backgroundColor: "purple", border: "purple" }}
                                    >
                                        Start Chat
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
