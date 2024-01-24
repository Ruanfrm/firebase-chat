import React from 'react';
import { List, ListItem, ListItemText, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ChatList = ({ chats }) => {
  return (
    <List>
      {chats.map((chat) => (
        <ListItem key={chat.id}>
          <ListItemText
            primary={chat.name}
            secondary={`Criador: ${chat.creator}`}
          />
          <Button
            component={Link}
            to={`/chat/${chat.id}`}
            variant="contained"
            color="primary"
          >
            Entrar
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

export default ChatList;
