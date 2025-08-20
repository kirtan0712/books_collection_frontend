import React, { useState } from 'react';
// 1. Make sure both 'useNavigate' and 'Link' are imported correctly
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import { loginUser } from '../services/UserServices.js';

const Login = () => {
    // 2. Initialize state for the form and any errors
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    
    // 3. Initialize the navigate hook
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await loginUser(form);
            // On success, save tokens to browser storage
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            
            // Navigate to the user's profile page
            navigate('/profile');

        } catch (err) {
            setError(err.error || 'Login failed. Please check your credentials.');
        }
    };

    // 4. The JSX for the form itself
    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                maxWidth: 400,
                mx: 'auto',
                mt: 5,
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography variant="h5" align="center" gutterBottom>Login</Typography>
            {error && <Typography color="error" align="center" variant="body2">{error}</Typography>}
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required />
            <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5, mt: 1 }}>Login</Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Don't have an account?{' '}
                <RouterLink to="/signup" style={{ color: '#1976d2', textDecoration:'none' }}>
                    Sign Up
                </RouterLink>
            </Typography>
        </Box>
    );
};

export default Login;