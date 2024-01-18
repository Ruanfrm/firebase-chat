import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const WelcomeModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    const hasAcceptedTerms = localStorage.getItem('acceptedTerms');
    if (hasAcceptedTerms) {
      setIsModalOpen(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('acceptedTerms', 'true');
    setIsAccepted(true);
    setIsModalOpen(false);
  };

  const handleReject = () => {
    window.location.href = 'https://www.google.com'; // Redireciona para o Google.com
  };

  return (
    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} style={{border:'0px' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', textAlign: 'center'}}>
        <Typography variant="h5" style={{color:'#000'}}>Boas-vindas ao nosso chat!</Typography>
        <Typography paragraph style={{color:'#000'}}>
          Ao continuar, você concorda com os Termos de Serviço. Por favor, leia os{' '}
          <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#1976D2' }}>
            Termos de Uso
          </a>{' '}
          antes de prosseguir.
        </Typography>
        <div>
          <Button variant="contained" color="primary" onClick={handleAccept} style={{ marginRight: '10px' }}>
            Aceitar
          </Button>
          <Button variant="contained" color="secondary" onClick={handleReject}>
            Recusar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeModal;
