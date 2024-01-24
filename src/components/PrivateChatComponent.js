// PrivateChatComponent.jsx
import React, { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { auth, db } from '../firebase';
import { formatDistanceToNow } from 'date-fns';

const PrivateChatComponent = ({ selectedUser, userName }) => {
  const [privateMessages, setPrivateMessages] = useState([]);
  const [newPrivateMessage, setNewPrivateMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      const privateMessagesRef = ref(db, `private-messages/${selectedUser.id}`);

      const unsubscribe = onValue(privateMessagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const privateMessagesArray = Object.entries(data).map(([id, message]) => ({
            id,
            ...message,
          }));
          setPrivateMessages(privateMessagesArray);
        }
      });

      return () => unsubscribe();
    }
  }, [selectedUser]);

  const sendPrivateMessage = async (e) => {
    e.preventDefault();

    try {
      setIsSending(true);

      const privateMessagesRef = ref(db, `private-messages/${selectedUser.id}`);
      await push(privateMessagesRef, {
        user: userName,
        text: newPrivateMessage,
        timestamp: new Date().toISOString(),
        uid: auth.currentUser.uid,
      });

      setNewPrivateMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem privada:', error);
      // Lógica para exibir mensagem de erro
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <h2>Conversa Privada com {selectedUser.name}</h2>
      <ul>
        {privateMessages.map((message) => (
          <li key={message.id}>
            <strong>{message.user}:</strong> {message.text}
          </li>
        ))}
      </ul>

      <form onSubmit={sendPrivateMessage}>
        <input type="text" value={newPrivateMessage} onChange={(e) => setNewPrivateMessage(e.target.value)} />
        <button type="submit" disabled={isSending}>
          Enviar Mensagem Privada
        </button>
      </form>
    </div>
  );
};

export default PrivateChatComponent;
