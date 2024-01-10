import React, { useState } from "react";
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
import { auth, updatePassword, signOut } from "../firebase";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";


import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";


const defaultTheme = createTheme();

export default function Navbar() {
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState(null);
  
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
      } catch (error) {
        setError(error.message);
      }
    };

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          Suporte chat
        <PhoneMissedIcon fontSize="Medium" style={{ marginLeft: "1rem" }} />
          </Typography>
          <Button color="inherit" onClick={handleOpenChangePassword} style={{fontSize: '14px'}} >
            <LockIcon style={{fontSize: '16px', marginRight: "3px"}} />
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
              <Typography variant="h6" component="div" mb={2} style={{color: "#000"}}>
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
                style={{marginTop: '.5rem'}}
              >
                Salvar Senha
              </Button>
              {error && <Typography color="error">Função em desenvolvimento</Typography>}
            </Box>
          </Modal>
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          <Button color="inherit" onClick={handleOpenConfirmLogout} style={{fontSize: '14px'}}>
            <ExitToAppIcon style={{fontSize: '16px', marginRight: "3px"}}  />
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
              <Typography variant="h6" component="div" mb={2} style={{color: "#000"}}>
                Confirmar Logout
              </Typography>
              <Typography variant="body2" mb={2} style={{color: "#000"}}>
                Tem certeza de que deseja sair da conta?
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmLogout}
                style={{marginRight: '.5rem'}}
              >
                Confirmar
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCloseConfirmLogout}
                ml={2}
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
