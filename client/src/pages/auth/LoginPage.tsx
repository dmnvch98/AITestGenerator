import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Alert, Container, Snackbar, FormControl, FormHelperText } from '@mui/material';
import { AxiosError } from 'axios';
import useAuthStore from "./authStore";
import { AlertMessage } from '../../store/types';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [emailValid, setEmailValid] = useState(true); // По умолчанию валидно
  const { login, alerts, addAlert, clearAlerts, deleteAlert } = useAuthStore();

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleEmailBlur = () => {
    setEmailValid(validateEmail(email));
  };

  useEffect(() => {
    console.log(alerts)
  }, [alerts, addAlert]);

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      if (response && response.status === 200) {
        navigate('/files');
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.isAxiosError && axiosError.response && axiosError.response.status === 404) {
        addAlert(new AlertMessage('Пользователь не найден', 'error'));
      } else {
        addAlert(new AlertMessage('Произошла ошибка. Пожалуйста, обратитесь в поддержку', 'error'));
        console.error('Login error:', axiosError);
      }
    }
  };

  const isFormValid = () => {
    return emailValid && password.length > 0;
  };

  return (
      <>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
              ГенТест
            </Typography>
            <Button color="inherit" onClick={() => navigate('/sign-up')}>Регистрация</Button>
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
              Вход
            </Typography>
            <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                noValidate
                sx={{ mt: 1 }}
            >
              <FormControl fullWidth error={!emailValid && email.length > 0}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    id="email"
                    label="Email адрес"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur} // Валидация по потере фокуса
                />
                <FormHelperText>
                  {!emailValid && email.length > 0 ? "Неверный формат" : ""}
                </FormHelperText>
              </FormControl>
              <FormControl fullWidth>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    name="password"
                    label="Пароль"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={!isFormValid()}
              >
                Войти
              </Button>
            </Box>
          </Box>
          <Snackbar
              open={alerts.length > 0}
              autoHideDuration={10000}
              onClose={clearAlerts}
          >
            <Box sx={{maxWidth: '400px'}}>
              {alerts.map(alert => (
                  <Alert key={alert.id} severity={alert.severity} sx={{mb: 0.5, textAlign: 'left'}}
                         onClose={() => {
                           deleteAlert(alert)
                         }}>
                    <span dangerouslySetInnerHTML={{__html: alert.message}}/>
                  </Alert>
              ))}
            </Box>
          </Snackbar>
        </Container>
      </>
  );
}

export default LoginPage;
