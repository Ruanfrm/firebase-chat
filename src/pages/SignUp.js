import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Container, CssBaseline, Grid, Link} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from 'react-router-dom';
import ParticleEffect from "../components/ParticleEffect";

const defaultTheme = createTheme();

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o usuário já está autenticado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuário está autenticado, redirecione para a página /chat
        navigate("/chat", { replace: true });
      }
    });

    // Cleanup da subscrição ao desmontar o componente
    return () => unsubscribe();
  }, []); // O array vazio assegura que o efeito só é executado uma vez, semelhante ao componentDidMount

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Usuário criado com sucesso, redireciona para a página desejada
      navigate("/chat");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleBack = () => {
    navigate("/");

  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <ParticleEffect/>
      <Container component="main" maxWidth="xs" style={{ marginTop: '3rem', background: '#f5f5f5', padding: '2rem', borderRadius: '1rem', color: '#fff' }}>
        <CssBaseline />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
         
          <form onSubmit={handleSubmit}>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Endereço de Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Senha"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Criar Conta
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </form>
          <Grid container>
           
              <Grid item xs> 
              <Link component="button" variant="body2" style={{textDecoration: 'none'}} onClick={() => handleBack()} >
                Voltar ao inicio
              </Link>
              </Grid>

          </Grid>
        </div>
      </Container>
    </ThemeProvider>
  );
}