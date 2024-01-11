import React, { useState, useEffect, useRef } from "react";
import ReactGA from "react-ga";
import { toast } from "react-toastify";
import { ref, onValue, push, remove } from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

import { db, storage, auth } from "../firebase";
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
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

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
  const [open, setOpen] = useState(false);
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] =
    useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

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
          toast.success(`Você tem uma nova mensagem de ${lastMessage.user}`);

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

        // Adicione o UID do usuário ao documento da mensagem
      const messagesRef = ref(db, 'messages');
      await push(messagesRef, {
        user: userName,
        imageUrl: imageUrl,
        text: newMessage,
        timestamp: new Date().toISOString(),
        uid: auth.currentUser.uid, // Adicione o UID do usuário aqui
      });

        setSelectedFile(null); // Limpa o arquivo selecionado
      } else {
        // Se não houver imagem, apenas envie a mensagem de texto
        if (newMessage.trim() !== "") {
          const messagesRef = ref(db, 'messages');
          await push(messagesRef, {
            user: userName,
            text: newMessage,
            timestamp: new Date().toISOString(),
            uid: auth.currentUser.uid, // Adicione o UID do usuário aqui
          });
        }
      }

      setNewMessage("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem")
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
      toast.success("Mensagens deletadas");
    }
  };

  const user = auth.currentUser;
  const uid = user.uid;

  const actions = [
    {
      icon: <DeleteForeverIcon />,
      name: "Excluir Todas as Mensagens",
      onClick: deleteAllMessages,
    },
  ];

  const createAccount = async () => {
    try {
      await createUserWithEmailAndPassword(auth, newUserEmail, newUserPassword);
      // Lógica adicional, se necessário
      setIsCreateAccountModalOpen(false);
      toast.success("Usuário criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      toast.error("Error ao criar novo usuário");
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      toast.success("Logout efetuado com sucesso");
    } catch (error) {
      toast.error("Error ao sair da conta");
    }
  };
  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Tem certeza de que deseja excluir esta mensagem?")) {
      await remove(ref(db, `messages/${messageId}`));
    }
  };

  return (
    <Container component="main" maxWidth="xl" style={{ maxWidth: "800px" }}>
      <Navbar />
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
                {messages.map((message, index ) => (
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
                      <div 
                      style={{
                        display: "flex",
                      }}
                      >
                      <IconButton
                        size="small"
                        onClick={() => setReplyTo(message)}
                      >
                        <ReplyIcon />
                      </IconButton>
                      {message.uid === auth.currentUser.uid && (
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          <DeleteForeverIcon />
                        </IconButton>
                      )}
                      </div>
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
                backgroundColor: "#f5f5f5",
                padding: "20px",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "1rem",
                maxWidth: "400px",
                marginLeft: "1rem",
              }}
            >
              <Typography
                variant="h5"
                style={{ marginBottom: "20px", color: "#000" }}
              >
                Bem-vindo ao Chat! 😊
              </Typography>
              <TextField
                label="Digite seu nome para iniciar uma conversa"
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
      {uid === "d8k8w75XpWRTL90RkeN2zUDWJUj1" && (
        <SpeedDial
          ariaLabel="SpeedDial"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
        >
          {messages.length > 0 && (
            <SpeedDialAction
              key="delete"
              icon={<DeleteForeverIcon />}
              tooltipTitle="Excluir Todas as Mensagens"
              onClick={deleteAllMessages}
            />
          )}

          {/* Adicionando a ação de criar um novo usuário */}
          <SpeedDialAction
            key="createUser"
            icon={<PersonAddIcon />}
            tooltipTitle="Criar Novo Usuário"
            onClick={() => setIsCreateAccountModalOpen(true)}
          />

          {/* Adicionando a ação de fazer logout */}
          {user && (
            <SpeedDialAction
              key="logout"
              icon={<ExitToAppIcon />}
              tooltipTitle="Logout"
              onClick={logout}
            />
          )}
        </SpeedDial>
      )}

      <Modal
        open={isCreateAccountModalOpen}
        onClose={() => setIsCreateAccountModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#f5f5f5",
          color: "#000",
          boxShadow: 10,
          p: 4,
          borderRadius: "1rem",
        }}
      >
        <Fade in={isCreateAccountModalOpen}>
          <div
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#000",
              p: 4,
              borderRadius: "1rem",
            }}
          >
            <Typography variant="h5" style={{ marginBottom: "20px" }}>
              Criar Conta
            </Typography>
            <TextField
              label="E-mail"
              type="email"
              variant="outlined"
              fullWidth
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              style={{ marginBottom: "20px" }}
            />
            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              style={{ marginBottom: "20px" }}
            />
            <Button variant="contained" color="primary" onClick={createAccount}>
              Criar Conta
            </Button>
          </div>
        </Fade>
      </Modal>

      <Footer />
    </Container>
  );
  ReactGA.pageview(window.location.pathname + window.location.search);
}

export default Chat;
