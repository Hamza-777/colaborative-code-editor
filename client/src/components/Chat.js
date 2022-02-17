import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

function Chat({ socket }) {
    let { roomname, username } = useParams();
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("message", (data) => {
            let temp = messages;
            temp.push({
                username: data.username,
                text: data.text,
                time: data.time
            });
            setMessages([...temp]);
        });
    }, [socket, messages]);

    const sendData = () => {
        if (text !== "") {
            socket.emit("chatMessage", text);
            setText("");
        }
    };
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    return (
        <div className="chat">
            <div className="user-name">
                <h2>
                {username} <span style={{ fontSize: "0.7rem" }}>in {roomname}</span>
                </h2>
            </div>
            <div className="chat-message">
                {messages.map((i) => {
                if (i.username === username) {
                    return (
                    <div className="message">
                        <p>{i.text}</p>
                        <span>{i.username}</span>
                        <span>{i.time}</span>
                    </div>
                    );
                } else {
                    return (
                    <div className="message mess-right">
                        <p>{i.text} </p>
                        <span>{i.username}</span>
                        <span>{i.time}</span>
                    </div>
                    );
                }
                })}
                <div ref={messagesEndRef} />
            </div>
            <div className="send">
                <input
                placeholder="enter your message"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        sendData();
                    }
                }}
                ></input>
                <button onClick={sendData}>Send</button>
            </div>
        </div>
    );
}
export default Chat;