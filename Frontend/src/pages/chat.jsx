import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backend_url = "http://localhost:3000/api/v1";

export default function Chat() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const hardcodedUserIds = ['user1', 'user2', 'user3'];

    useEffect(() => {
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
            } catch (error) {
                console.log("Error fetching user data:", error);
                navigate("/");
            }
        }

        fetchUserData();
    }, [navigate]);

    const handleSelectUser = (userId) => {
        navigate(`/chats`); // Update this with the actual path of your chat page
    };

    return (
        <>
            <div className="chat-container">
                <h1>Chats</h1>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User ID</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hardcodedUserIds.map((userId, index) => (
                            <tr key={userId}>
                                <td>{index + 1}</td>
                                <td>{userId}</td>
                                <td>
                                    <button className="btn btn-primary start-chat-btn" onClick={() => handleSelectUser(userId)}>
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
