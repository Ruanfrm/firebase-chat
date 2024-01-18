import React, { useState, useEffect } from "react";
import { ref, onValue, get } from "firebase/database";
import { auth, db } from "../firebase";
import {Typography, Button, } from '@mui/material'
import { startPrivateChat } from './Chat';


const UserList = ({ startPrivateChat }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(db, "users");

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.entries(data).map(([uid, user]) => ({
          uid,
          ...user,
        }));
        setUsers(usersArray);
      }
    });
  }, []);

  return (
    <div>
      <h2>Lista de Usuários</h2>
      <ul>
        {users.map((user) => (
          <div key={user.uid}>
          <Typography>{user.name}</Typography>
          <Button onClick={() => startPrivateChat(user)}>Iniciar Chat Privado</Button>
        </div>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
