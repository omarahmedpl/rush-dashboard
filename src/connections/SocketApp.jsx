import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SocketApp = () => {
  const [message, setMessage] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    console.log('Hello');
    
    // Connect to the Flask WebSocket server
    const socket = io(`${import.meta.env.VITE_BASE_URL}`); // Adjust the URL if your Flask app is hosted elsewhere

    // Listen for the 'message' event from Flask
    socket.on("message", (data) => {
      console.log(data);
      setMessage(data.data);
    });

    // Listen for the 'server_message' event from Flask
    socket.on("server_message", (data) => {
      console.log(data);
      setServerMessage(data.data);
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to send a message to the Flask server
  const sendMessage = () => {
    const socket = io(`${import.meta.env.VITE_BASE_URL}`);
    socket.emit("client_message", { message: "Hello Flask!" });
  };

  return (
    <div>
      <h1>React & Flask WebSocket Example</h1>
      <p>Flask says: {message}</p>
      <button onClick={sendMessage}>Send Message to Flask</button>
      <p>Server Response: {serverMessage}</p>
    </div>
  );
};

export default SocketApp;
