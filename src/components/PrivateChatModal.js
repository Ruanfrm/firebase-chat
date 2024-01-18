// PrivateChatModal.js

import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const PrivateChatModal = ({ isOpen, onClose, selectedUser }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "#fff", padding: "20px", borderRadius: "8px" }}>
        <Typography variant="h5" gutterBottom color="#000">
          Chat Privado
        </Typography>
        {selectedUser ? (
          <Typography color="#000">
            Iniciando conversa privada com {selectedUser.name} ({selectedUser.id})
          </Typography>
        ) : (
          <Typography>Nenhum usuário selecionado.</Typography>
        )}
        <Button variant="contained" color="primary" onClick={onClose} style={{ marginTop: "20px" }} size="small">
          Fechar
        </Button>
      </div>
    </Modal>
  );
};

export default PrivateChatModal;
