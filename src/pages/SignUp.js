import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/UserServices'; // Make sure this path is correct

const SignUp = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        mobile_no: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const validateField = (name, value) => {
        switch (name) {
            case 'mobile_no':
                if (!/^\d{10}$/.test(value)) {
                    return "Mobile number must be exactly 10 digits.";
                }
                break;
            case 'password':
                if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)) {
                    return "Min 8 chars, with 1 uppercase, 1 digit, & 1 special char.";
                }
                break;
            default:
                break;
        }
        return ""; // No error
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
        const error = validateField(name, value);
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: error
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hasErrors = Object.values(errors).some(error => error !== "");
        if (hasErrors) {
            alert("Please fix the errors before submitting.");
            return;
        }
        try {
            await registerUser(form);
            alert("Registration successful! Please proceed to login.");
            navigate("/login");
        } catch (err) {
            const errorMessages = err.response?.data ?
                Object.values(err.response.data).flat().join('\n') :
                "An unexpected error occurred.";
            alert(`Registration failed:\n${errorMessages}`);
        }
    };

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
            <Typography variant="h5" align="center" gutterBottom>Sign Up</Typography>
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required />

            <TextField
                label="Mobile Number"
                name="mobile_no"
                value={form.mobile_no}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.mobile_no}
                helperText={errors.mobile_no}
            />
            <TextField
                label="Password"
                name="password"
                type="password" // Set to a static "password" type
                value={form.password}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.password}
                helperText={errors.password}
            />

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5, mt: 1 }}>
                Create Account
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Already have an account?{' '}
                <RouterLink to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
                    Sign In
                </RouterLink>
            </Typography>
        </Box>
    );
};

export default SignUp;