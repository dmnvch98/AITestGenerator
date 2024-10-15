import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Alert, Container, Snackbar } from '@mui/material';
import { AxiosError } from 'axios';
import useAuthStore from "./authStore";

function RegistrationPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [emailValid, setEmailValid] = useState(false);
  const [error, setError] = useState(false);
  const { signup } = useAuthStore();

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  const handleEmailChange = (e: any) => {
    const emailInput = e.target.value;
    setEmail(emailInput);
    setEmailValid(validateEmail(emailInput));
  };

  const handleRegistration = async () => {
    if (password !== confirmPassword) {
      setError(true);
      return;
    }
    try {
      const response = await signup(email, password);
      if (response && response.status === 201) {
        navigate('/sign-in');
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Registration error:', axiosError);
      setError(true);
    }
  };

  const isFormValid = () => {
    return emailValid && password.length > 0 && password === confirmPassword;
  };

  return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
              ГенТест
            </Typography>
            <Button color="inherit" onClick={() => navigate('/sign-in')}>Вход</Button>
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
              Регистрация
            </Typography>
            <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegistration();
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
                  label="Email адрес"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={handleEmailChange}
                  error={!emailValid && email.length > 0}
                  helperText={!emailValid && email.length > 0 ? "Введите действительный email" : ""}
              />
              <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Пароль"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Подтверждение пароля"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={password !== confirmPassword && confirmPassword.length > 0}
                  helperText={password !== confirmPassword && confirmPassword.length > 0 ? "Пароли не совпадают" : ""}
              />
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={!isFormValid()}
              >
                Зарегистрироваться
              </Button>
            </Box>
          </Box>
          <Snackbar
              open={error}
              autoHideDuration={3000}
              onClose={() => setError(false)}
          >
            <Alert severity="error">
              Ошибка при регистрации
            </Alert>
          </Snackbar>
        </Container>
      </>
  );
}

export default RegistrationPage;
