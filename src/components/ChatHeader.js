import React from 'react';
import { Typography, Paper } from '@mui/material';

const ChatHeader = ({ chatName, creatorName }) => {
  return (
    <Paper
      elevation={3}
      style={{
        padding: '10px',
        marginTop: '.5rem',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <Typography variant="h6" style={{ fontSize: '15px' }}>
        Sala: {chatName}
      </Typography>
      <Typography variant="subtitle1" style={{fontSize: '15px' }}>
        Criador: {creatorName}
      </Typography>
    </Paper>
  );
};

export default ChatHeader;
