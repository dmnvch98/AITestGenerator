import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import customAxios from '../interceptors/custom_axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Container } from '@mui/material';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await customAxios.post('/api/v1/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("JWT", response.data.accessToken);
        navigate('/texts');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
              TestGen
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>



        <Container component="main" maxWidth="xs">
          <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
          >
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault(); // Предотвращаем стандартное поведение отправки формы
                  handleLogin(); // Вызываем обработчик входа
                }}
                noValidate
                sx={{ mt: 1 }}
            >
              <TextField
                  variant="outlined"
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
                  variant="outlined"
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
              <Button
                  type="submit" // Убрано onClick
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Container>
      </>
  );
}

export default LoginPage;
