import React, { useState, useEffect} from "react";
import { Button, TextField, Avatar, CssBaseline, FormControlLabel, Checkbox, Link, Grid, Typography, Container } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from 'react-router-dom'
import ForgotPasswordModal from "../components/ForgotPasswordModal"; // Importe o componente modal aqui
import ParticleEffect from "../components/ParticleEffect"


const defaultTheme = createTheme();

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false); // Estado para controlar a exibição do modal

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

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login bem-sucedido, não é necessário redirecionamento no frontend
      navigate("/chat", { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCreateAccount = () => {
    navigate("/criar-conta")
  }

  return (
    <ThemeProvider theme={defaultTheme} >
              <ParticleEffect/>

      <Container component="main" maxWidth="xs" style={{marginTop: '3rem', background: '#f5f5f5', padding: '2rem', borderRadius: '1rem', color: '#fff' }}>
        <CssBaseline />
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" >
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
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
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Lembrar"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </form>
          <Grid container>
            <Grid item xs>
              {/* Abra o modal de "Esqueceu a senha?" ao clicar no link */}
              <Link component="button" variant="body2" onClick={() => setForgotPasswordOpen(true)}>
                Esqueceu a senha?
              </Link>
            </Grid>
              <Grid item> 
              <Link component="button" variant="body2" onClick={() => handleCreateAccount()} >
                Ainda nao possui conta?
              </Link>
              </Grid>

          </Grid>
        </div>
      </Container>

      {/* Renderize o modal de "Esqueceu a senha?" */}
      <ForgotPasswordModal open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)} />
      
    </ThemeProvider>
    
  );
}
