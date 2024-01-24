// No seu componente UserList.js:
import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { Container, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import { db } from "../firebase";

function UserList({ startPrivateChat }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(db, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const userData = snapshot.val();

      if (userData) {
        const userList = Object.keys(userData).map((uid) => ({
          uid,
          ...userData[uid],
        }));

        setUsers(userList);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Lista de Usuários Cadastrados
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.uid}>
            <ListItemText primary={user.username} secondary={`UID: ${user.uid}`} />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => startPrivateChat(user)}
            >
              Iniciar Chat
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default UserList;
