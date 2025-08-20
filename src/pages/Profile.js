// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { getUserProfile } from '../services/UserServices';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile();
                setUser(data);
            } catch (err) {
                setError('Failed to fetch profile. Please try logging in again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 5, mx: 'auto', maxWidth: 600 }}>{error}</Alert>;
    }

    return (
        <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 4, borderRadius: '12px' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                Your Profile
            </Typography>
            {user && (
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h6"><strong>Name:</strong> {user.name}</Typography>
                    <Typography variant="h6"><strong>Email:</strong> {user.email}</Typography>
                    <Typography variant="h6"><strong>Mobile:</strong> {user.mobile_no}</Typography>
                    <Typography variant="h6"><strong>City:</strong> {user.city || 'Not Provided'}</Typography>
                    <Typography variant="h6"><strong>Age:</strong> {user.age || 'Not Provided'}</Typography>
                </Box>
            )}
        </Paper>
    );
};

export default Profile;