import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import './Chat.css';

function Chat({ socket, chatScale }) {
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
        <div className="chat flex-center flex-col" style={{ transform: `scaleY(${chatScale})`}}>
            <p className="h3">Chat Room</p>
            <div className="chat-message flex flex-col">
                <div className="messages">
                    {messages.map((i) => {
                        if (i.username === username) {
                            return (
                                <div className="message flex-center flex-col align-start msg-right">
                                    <p className="meta">{i.username} {`(${roomname})`} <span>{i.time}</span></p>
                                    <p className="text">{i.text}</p>
                                </div>
                            );
                        } else {
                            return (
                                <div className="message flex-center flex-col align-start msg-left">
                                    <p className="meta">{i.username} {`(${roomname})`} <span>{i.time}</span></p>
                                    <p className="text">{i.text}</p>
                                </div>
                            );
                        }
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="send flex-center">
                <input
                    type='text'
                    placeholder="Type something..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            sendData();
                        }
                    }}
                ></input>
                <button className="btn" onClick={sendData}>Send <i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
    );
}
export default Chat;