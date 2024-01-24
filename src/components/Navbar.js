import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  Divider,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockIcon from "@mui/icons-material/Lock";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { auth, db } from "../firebase";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import {
  ref,
  set,
  onValue,
  push,
  remove,
  orderByChild,
  equalTo,
  query,
  get,
} from "firebase/database";

import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function Navbar() {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [creatorUsername, setCreatorUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Use o UID do usuário autenticado para buscar o nome no Realtime Database
    const user = auth.currentUser;
    const uid = user?.uid;

    if (uid) {
      const userRef = ref(db, `users/${uid}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const username = userData.username;
            setUserName(username);
          } else {
            console.log("Error ao carregar nome de usuário");
            toast.error("Error ao carregar nome de usuário");
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar nome de usuário:", error);
        });
    }
  }, []);

  const handleEditClick = () => {
    setEditedName(userName);
    setEditMode(true);
  };

  const handleSaveClick = () => {
    localStorage.setItem("userName", editedName);
    setUserName(editedName);
    setEditMode(false);
  };

  const handleOpenChangePassword = () => {
    setChangePasswordOpen(true);
  };

  const handleCloseChangePassword = () => {
    setChangePasswordOpen(false);
  };
  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        await user.updatePassword(newPassword);
        setChangePasswordOpen(false);
        setError(null);
      } else {
        // Handle the case where the user is not signed in
        setError("User not signed in");
        toast.error("Usuário não conectado");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleOpenConfirmLogout = () => {
    setConfirmLogoutOpen(true);
  };

  const handleCloseConfirmLogout = () => {
    setConfirmLogoutOpen(false);
  };

  const handleConfirmLogout = async () => {
    try {
      await auth.signOut();
      setConfirmLogoutOpen(false);
      toast.success("Logout efetuado com sucesso");
    } catch (error) {
      setError(error.message);
      toast.error("Error ao sair da conta");
    }
  };

  useEffect(() => {
    const fetchCreatorUsername = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = ref(db, `users/${user.uid}/username`);
        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setCreatorUsername(snapshot.val());
          } else {
            console.error(
              "Nome de usuário não encontrado para o criador da sala."
            );
            toast.error("Erro ao obter o nome de usuário do criador da sala.");
          }
        } catch (error) {
          console.error(
            "Erro ao buscar nome de usuário do criador da sala:",
            error
          );
          toast.error("Erro ao buscar nome de usuário do criador da sala.");
        }
      }
    };

    fetchCreatorUsername();
  }, [auth, db]);

  const createNewChat = async () => {
    if (typeof newChatName === "string" && newChatName.trim() !== "") {
      try {
        const user = auth.currentUser;
        const chatRef = push(ref(db, "chats"));
        await set(chatRef, {
          name: newChatName,
          creator: user.displayName || creatorUsername, // Prioriza o displayName, se disponível
          // ... (outras propriedades da sala, se houver)
        });

        setNewChatName(""); // Limpa o campo do nome da sala
        setIsCreateChatModalOpen(false); // Fecha o modal

        // Redireciona o usuário para a página da sala recém-criada
        navigate(`/chat/${chatRef.key}`);
      } catch (error) {
        console.error("Erro ao criar nova sala:", error);
        toast.error("Erro ao criar nova sala");
      }
    } else {
      // Lida com o caso em que newChatName não é uma string válida
      console.error("Nome de sala inválido:", newChatName);
      toast.error("Nome de sala inválido");
    }
  };

  const handleCreateChat = () => {
    setIsCreateChatModalOpen(true);
  };

  const handleChatNameChange = (event) => {
    setNewChatName(event.target.value);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBar position="static" style={{ borderRadius: ".3rem" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          >
            Olá {userName}
          </Typography>

          <Button onClick={handleCreateChat} color="inherit">
            Criar Nova Sala
          </Button>

          {/* Modal para criar uma nova sala */}
          <Modal
            open={isCreateChatModalOpen}
            onClose={() => setIsCreateChatModalOpen(false)}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
              }}
            >
              <TextField
                label="Nome da Sala"
                variant="outlined"
                fullWidth
                value={newChatName}
                onChange={handleChatNameChange}
              />
              <Button
                onClick={createNewChat}
                variant="contained"
                color="primary"
                style={{marginTop: ".3rem"}}
                size="small"
              >
                Criar Sala
              </Button>
            </Box>
          </Modal>

          <Button
            color="inherit"
            onClick={handleOpenChangePassword}
            style={{ fontSize: "14px" }}
             size="small"
          >
            <LockIcon style={{ fontSize: "16px", marginRight: "3px" }} />
            Mudar Senha
          </Button>

          <Modal open={changePasswordOpen} onClose={handleCloseChangePassword}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography
                variant="h6"
                component="div"
                mb={2}
                style={{ color: "#000" }}
              >
                Mudar Senha
              </Typography>
              <TextField
                fullWidth
                label="Nova Senha"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleChangePassword}
                mt={2}
                style={{ marginTop: ".5rem" }}
                size="small"
              >
                Salvar Senha
              </Button>
              {error && (
                <Typography color="error">Função em desenvolvimento</Typography>
              )}
            </Box>
          </Modal>
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          <Button
            color="inherit"
            onClick={handleOpenConfirmLogout}
            style={{ fontSize: "14px" }}
          >
            <ExitToAppIcon style={{ fontSize: "16px", marginRight: "3px" }} />
            Sair
          </Button>
          <Modal open={confirmLogoutOpen} onClose={handleCloseConfirmLogout}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography
                variant="h6"
                component="div"
                mb={2}
                style={{ color: "#000" }}
              >
                Confirmar Logout
              </Typography>
              <Typography variant="body2" mb={2} style={{ color: "#000" }}>
                Tem certeza de que deseja sair da conta?
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmLogout}
                style={{ marginRight: ".5rem" }}
                size="small"
              >
                Confirmar
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCloseConfirmLogout}
                ml={2}
                size="small"
              >
                Cancelar
              </Button>
            </Box>
          </Modal>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}
