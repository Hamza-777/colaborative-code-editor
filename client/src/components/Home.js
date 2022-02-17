import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './Home.css';

const Home = ({ socket }) => {
    const [username, setusername] = useState("");
    const [roomname, setroomname] = useState("");

    const sendData = () => {
        if (username !== "" && roomname !== "") {
            socket.emit('joinRoom', {username, roomname});
        } else {
            alert("*Required username and roomname");
            console.log("Kaam karja bhadwe");
            window.location.reload();
        }
    };

    return (
        <div className="homepage flex-center">
            <div className='join flex-center flex-col'>
                <p className='h3'>Welcome to CCE</p>
                <input
                    type="text"
                    placeholder="Enter user name"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter room name"
                    value={roomname}
                    onChange={(e) => setroomname(e.target.value)}
                />
                <Link to={`/code-editor/${roomname}/${username}`}>
                    <button className="btn animated-btn" onClick={sendData}>Join Room</button>
                </Link>
            </div>
        </div>
    )
}

export default Home;