import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const ServerErrorPage: React.FC = () => {
    return (
        <Container
            maxWidth="sm"
            style={{
                textAlign: 'center',
                marginTop: '100px',
                padding: '20px',
            }}
        >
            <Box>
                <Typography variant="h3" color="error" gutterBottom>
                    Упс! Что-то пошло не так.
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Мы столкнулись с проблемой на нашем сервере. Пожалуйста, попробуйте позже.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Если вы хотите вернуться, вы можете вернуться на страницу входа.
                </Typography>
                <Link to="/sign-in" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" color="warning">
                        Перейти на страницу входа
                    </Button>
                </Link>
            </Box>
        </Container>
    );
};

export default ServerErrorPage;
