import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import customAxios from "../interceptors/custom_axios";

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
        <div className="LoginPage">
            <h2>Login</h2>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
}

export default LoginPage;
