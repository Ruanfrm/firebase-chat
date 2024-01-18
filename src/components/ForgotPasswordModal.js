import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import {toast} from 'react-toastify'

export default function ForgotPasswordModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSendResetEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast.success("E-mail de recuperação enviado! Verifique sua caixa de entrada e span")
      setError(null);
    } catch (error) {
      setError(error.message);
      toast.error("Error ao enviar e-mail")
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Esqueceu a senha?</DialogTitle>
      <DialogContent>
        {emailSent ? (
          <DialogContentText>
            Um e-mail de redefinição de senha foi enviado para {email}. Verifique sua caixa de entrada.
          </DialogContentText>
        ) : (
          <>
            <DialogContentText>
              Insira o endereço de e-mail associado à sua conta para redefinir a senha.
            </DialogContentText>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Endereço de E-mail"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSendResetEmail} color="primary">
          Recuperar senha
        </Button>
      </DialogActions>
    </Dialog>
  );
}
