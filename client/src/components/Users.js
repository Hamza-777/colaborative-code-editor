import React, { useState, useEffect } from 'react';
import './Users.css';

const Users = ({ socket, usersScale }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on("roomUsers", (data) => {
            let temp = data.users;
            setUsers([...temp]);
        });
    }, [socket, users]);

    return (
        <div className="user-container flex-center flex-col" style={{ transform: `scaleY(${usersScale})`}}>
            <p className="h3">Active Users</p>
            <div className="users flex flex-col">
                {users.map((i) => {
                    return (
                        <div className="user flex-center justify-start">
                            <div className='avatar-md flex-center'><i class="fa-solid fa-user"></i></div>
                            <p className='h5'>{i.username}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Users;