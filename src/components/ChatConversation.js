import React, { useState, useEffect, useRef } from 'react';
import { ref, push, onValue } from 'firebase/database';
import { uploadBytes, getDownloadURL } from 'firebase/storage';
import {db,storage} from '../firebase'
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker from 'emoji-picker-react';  // Certifique-se de ter o pacote emoji-picker-react instalado

function ChatConversation({ chatId, auth, formatTimestamp, replyTo }) {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleEmojiClick = (emojiData) => {
    setNewMessage((prevMessage) => prevMessage + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

   
    try {
      setIsSending(true);

      if (selectedFile) {
        const imageStorageRef = ref(storage, `images/${selectedFile.name}`);
        await uploadBytes(imageStorageRef, selectedFile);
        const imageUrl = await getDownloadURL(imageStorageRef);

        const messagesRef = ref(db, `chats/${chatId}/messages`);
        await push(messagesRef, {
          user: auth.currentUser.displayName,
          imageUrl: imageUrl,
          text: newMessage,
          timestamp: new Date().toISOString(),
          uid: auth.currentUser.uid,
        });

        setSelectedFile(null);
      } else {
        if (newMessage.trim() !== '') {
          const messagesRef = ref(db, `chats/${chatId}/messages`);
          await push(messagesRef, {
            user: auth.currentUser.displayName,
            text: newMessage,
            timestamp: new Date().toISOString(),
            uid: auth.currentUser.uid,
          });
        }
      }

      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <form
        onSubmit={sendMessage}
        style={{ marginTop: '20px', display: 'flex' }}
      >
        <TextField
          variant="outlined"
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={
            replyTo
              ? `Respondendo à mensagem de ${replyTo.user}`
              : 'Digite sua mensagem'
          }
          style={{ marginRight: '3px' }}
          size="small"
        />
        <label htmlFor="file-input">
          <input
            type="file"
            id="file-input"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <IconButton component="span" color="primary">
            <PhotoCameraIcon />
          </IconButton>
        </label>

        <IconButton component="span" color="primary">
          <AddReactionIcon onClick={() => setShowEmojiPicker(!showEmojiPicker)} />

          {showEmojiPicker && (
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              style={{
                position: 'absolute',
                bottom: '50px',
                right: '50px',
                zIndex: 1000,
              }}
            />
          )}
        </IconButton>

        <Button
          type="submit"
          disabled={isSending}
          onClick={sendMessage}
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          style={{
            backgroundColor: '#4caf50',
            color: '#ffffff',
            paddingLeft: '1rem',
            paddingRight: '1rem',
          }}
          size="small"
        >
          {isSending ? 'Enviando...' : 'Enviar'}
        </Button>
      </form>
      {replyTo && (
        <Typography variant="caption" style={{ marginTop: '10px' }}>
          Respondendo à mensagem de {formatTimestamp(replyTo.timestamp)} por{' '}
          {replyTo.user}
        </Typography>
      )}
    </>
  );
}

export default ChatConversation;
