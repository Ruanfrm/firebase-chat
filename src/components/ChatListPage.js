// Sua página de listagem de salas (por exemplo, ChatListPage.js)
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import ChatList from './ChatList'; // Importa o componente ChatList

const ChatListPage = ({ db,  }) => {
  const [availableChats, setAvailableChats] = useState([]);

  useEffect(() => {
    const chatsRef = ref(db, 'chats');

    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const chatsData = snapshot.val();
      if (chatsData) {
        const chatsArray = Object.keys(chatsData).map((key) => ({
          id: key,
          ...chatsData[key],
        }));
        setAvailableChats(chatsArray);
      }
    });

    return () => unsubscribe();
  }, [db]);

  return (
    <div>
      {/* Utiliza o componente ChatList passando as salas disponíveis como propriedade */}
      <ChatList chats={availableChats} />

      {/* ... (outro conteúdo da página, se houver) */}
    </div>
  );
};

export default ChatListPage;
