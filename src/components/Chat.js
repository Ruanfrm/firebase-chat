import React, { useState, useEffect, useRef } from "react";
import { ref, onValue, push, remove } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

import { db, storage } from "../firebase";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  Alert,
  AlertTitle,
  Modal,
  Backdrop,
  Fade,
  CircularProgress,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import Footer from "./Footer";
import Navbar from "./Navbar";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [replyTo, setReplyTo] = useState(null);
  const [userName, setUserName] = useState("");
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const lastMessageRef = useRef(null);
  const [respondedMessage, setRespondedMessage] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [lastDisplayedMessage, setLastDisplayedMessage] = useState(null);


  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    } else {
      setIsNameModalOpen(true);
    }

    const messagesRef = ref(db, "messages");

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.entries(data).map(([id, message]) => ({
          id,
          ...message,
        }));
        setMessages(messagesArray);

        // Remover o indicador de carga após 2 segundos
        setTimeout(() => {
          setLoadingMessages(false);
        }, 2000);

        // Scroll para a última mensagem quando houver uma nova mensagem
        if (lastMessageRef.current) {
          lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }

        // Exibe a notificação apenas se a última mensagem exibida for diferente da última mensagem recebida
        const lastDisplayedMessageId = localStorage.getItem(
          "lastDisplayedMessageId"
        );
        if (
          messagesArray.length > 0 &&
          messagesArray[messagesArray.length - 1].id !== lastDisplayedMessageId
        ) {
          const lastMessage = messagesArray[messagesArray.length - 1];
          showNotification(lastMessage);
          localStorage.setItem("lastDisplayedMessageId", lastMessage.id);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const showNotification = (message) => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          const notification = new Notification("Nova Mensagem", {
            body: `${message.user}: ${message.text}`,
          });
        }
      });
    }
  };

  useEffect(() => {
    if (userName) {
      setShowWelcomeMessage(true);
    }
  }, [userName]);

  const formatTimestamp = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const handleNameSubmit = () => {
    setIsNameModalOpen(false);
    setShowWelcomeMessage(true);
    localStorage.setItem("userName", userName);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Função para obter e exibir mensagens
  const loadMessages = () => {
    const messagesRef = ref(db, "messages");

    onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();

      if (messagesData) {
        const messagesList = Object.keys(messagesData).map((key) => ({
          id: key,
          ...messagesData[key],
        }));

        setMessages(messagesList);
      }
    });
  };

  // Carregar mensagens quando o componente montar
  useEffect(() => {
    loadMessages();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!userName) {
      setIsNameModalOpen(true);
      return;
    }

    try {
      setIsSending(true); // Ativar o estado de envio

      if (selectedFile) {
        // Enviar a imagem para o Firebase Storage
        const imageStorageRef = storageRef(
          storage,
          `images/${selectedFile.name}`
        );
        await uploadBytes(imageStorageRef, selectedFile);

        // Obter a URL da imagem no Firebase Storage
        const imageUrl = await getDownloadURL(imageStorageRef);

        // Salvar informações da imagem no Firebase Realtime Database ou Firestore
        const messagesRef = ref(db, "messages");

        await push(messagesRef, {
          user: userName,
          imageUrl: imageUrl,
          text: newMessage, // Adiciona a mensagem de texto junto com a imagem
          timestamp: new Date().toISOString(),
        });

        setSelectedFile(null); // Limpa o arquivo selecionado
      } else {
        // Se não houver imagem, apenas envie a mensagem de texto
        if (newMessage.trim() !== "") {
          const messagesRef = ref(db, "messages");
          await push(messagesRef, {
            user: userName,
            text: newMessage,
            timestamp: new Date().toISOString(),
          });
        }
      }

      setNewMessage("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setIsSending(false); // Desativar o estado de envio, independentemente do resultado
    }
  };


  


  const deleteAllMessages = async () => {
    if (
      window.confirm("Tem certeza de que deseja excluir todas as mensagens?")
    ) {
      await remove(ref(db, "messages"));
      setMessages([]);
    }
  };


  

  return (
    <Container component="main" maxWidth="sm">
      <Navbar/>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          marginTop: "20px",
          backgroundColor: "#f8f9fa",
        }}
      >
        {loadingMessages && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <CircularProgress style={{ marginRight: "10px" }} /> Carregando
            mensagens, tenha paciência
          </div>
        )}
        {!loadingMessages && (
          <>
            {showWelcomeMessage && (
              <Alert severity="success" style={{ marginBottom: "10px" }}>
                <AlertTitle>Bem-vindo, {userName}!</AlertTitle>
                Comece a conversar abaixo.
              </Alert>
            )}
            {messages.length === 0 ? (
              <Alert severity="info">
                <AlertTitle>Nenhuma mensagem</AlertTitle>
                Comece a conversar adicionando mensagens no campo abaixo.
              </Alert>
            ) : (
              <div
                style={{
                  height: "300px",
                  overflowY: "scroll",
                  border: "1px solid #ccc",
                  padding: "10px",
                  backgroundColor: "#ffffff",
                }}
              >
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    ref={index === messages.length - 1 ? lastMessageRef : null}
                    onClick={() => setReplyTo(message)}
                    style={{
                      marginBottom: "10px",
                      borderBottom: "1px solid #ccc",
                      paddingBottom: "10px",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor:
                        respondedMessage?.id === message.id
                          ? "#f0f0f0"
                          : "transparent",
                    }}
                  >
                    <Typography
                      variant="body1"
                      className="chat"
                      style={{
                        maxWidth: "500px", // ajuste o valor conforme necessário
                        textAlign: "justify",
                        wordWrap: "break-word", // quebra de linha quando a palavra não couber
                      }}
                    >
                      {message.text}
                      <br />
                      {message.imageUrl && (
                        <img
                          src={message.imageUrl}
                          alt="Imagem do chat"
                          style={{ maxWidth: "50%", height: "auto" }}
                        />
                      )}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        display="block"
                        gutterBottom
                        style={{ color: "#9e9e9e" }}
                      >
                        {formatTimestamp(message.timestamp)} - {message.user}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => setReplyTo(message)}
                      >
                        <ReplyIcon />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              {messages.length > 0 && (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<DeleteForeverIcon />}
                  onClick={deleteAllMessages}
                  style={{ position: "fixed", bottom: "10px", right: "10px" }}
                >
                  Excluir Todas as Mensagens
                </Button>
              )}
              {messages.length > 0 && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() =>
                    lastMessageRef.current.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                >
                  <ExpandMoreIcon />
                </Button>
              )}
            </div>
          </>
        )}
        <form
          onSubmit={sendMessage}
          style={{ marginTop: "20px", display: "flex" }}
        >
          <TextField
            variant="outlined"
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={
              replyTo
                ? `Respondendo à mensagem de ${replyTo.user}`
                : "Digite sua mensagem"
            }
            style={{ marginRight: "3px" }}
            size="small"
          />
          <label htmlFor="file-input">
            <input
              type="file"
              id="file-input"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <IconButton component="span" color="primary">
              <PhotoCameraIcon />
            </IconButton>
          </label>

          <Button
            type="submit"
            disabled={isSending}
            onClick={sendMessage}
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            style={{
              backgroundColor: "#4caf50",
              color: "#ffffff",
              paddingLeft: "1rem",
              paddingRight: "1rem",
            }}
            size="small"
          >
            {isSending ? "Enviando..." : "Enviar"}
          </Button>
        </form>
        {replyTo && (
          <Typography variant="caption" style={{ marginTop: "10px" }}>
            Respondendo à mensagem de {formatTimestamp(replyTo.timestamp)} por{" "}
            {replyTo.user}
          </Typography>
        )}

        <Modal
          open={isNameModalOpen}
          onClose={() => setIsNameModalOpen(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={isNameModalOpen}>
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "20px",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" style={{ marginBottom: "20px" }}>
                Bem-vindo ao Chat! 😊
              </Typography>
              <TextField
                label="Digite seu nome"
                variant="outlined"
                fullWidth
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{ marginBottom: "20px" }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleNameSubmit}
              >
                Confirmar
              </Button>
            </div>
          </Fade>
        </Modal>
      </Paper>
      <Footer />
    </Container>
  );
}

export default Chat;
