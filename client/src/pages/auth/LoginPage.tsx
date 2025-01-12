import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Alert, Container, Snackbar, FormControl, FormHelperText } from '@mui/material';
import useAuthStore from "./authStore";
import LoadingButton from "../../components/main/buttons/LoadingButton";

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [emailValid, setEmailValid] = useState(true);
  const { login, alerts, clearAlerts, authenticated, loading } = useAuthStore();

    useEffect(() => {
        if (authenticated) {
            navigate('/generate');
        }
        return () => {
            clearAlerts();
        };
    }, [authenticated]);


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

  const handleLogin = async () => {
      await login(email, password);
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
            {/*<Button color="inherit" onClick={() => navigate('/sign-up')}>Регистрация</Button>*/}
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
                    onBlur={handleEmailBlur}
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
                <LoadingButton
                    label="Войти"
                    loadingLabel="Вход..."
                    loading={loading}
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={!isFormValid()}
                    sx={{mt: 3, mb: 2}}
                />
            </Box>
          </Box>
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={alerts.length > 0}
              autoHideDuration={10000}
              onClose={clearAlerts}
          >
            <Box sx={{maxWidth: '400px'}}>
              {alerts.map(alert => (
                  <Alert key={alert.id} severity={alert.severity} sx={{mb: 0.5, textAlign: 'left'}}
                         onClose={() => {
                           clearAlerts();
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
