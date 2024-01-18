import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import error404 from '../imagens/error-404.png'
import styled from '@mui/system/styled';

const FluctuatingImage = styled('img')`
  width: 100%;
  height: auto;
  animation: fluctuate 1s infinite alternate ease-in-out;
  @keyframes fluctuate {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-10px);
    }
  }
`;

const Error404 = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h5" style={{fontSize: '3rem'}}>Página não encontrada</Typography>
      <FluctuatingImage src={error404} alt="Error 404 Illustration" style={{ width: '500px', height: 'auto' }} />
      <Typography paragraph>
        A página que você está procurando pode ter sido removida, seu nome foi alterado ou está temporariamente indisponível.
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/chat">
        Voltar à Página Inicial
      </Button>
    </div>
  );
};

export default Error404;
