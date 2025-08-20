import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, Container, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
// 1. We import the function to get the book list from your services
import { getBookList } from '../services/UserServices';

// This is your original welcome page, now wrapped in its own component
const WelcomeView = () => (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Welcome to Book App
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 5 }}>
            Discover, manage, and explore your favorite books with our amazing platform!
        </Typography>
        <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                📚 What You Can Do:
            </Typography>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
                <Box>
                    <Typography variant="h6" color="primary" gutterBottom>📖 Browse Books</Typography>
                    <Typography variant="body2">Explore our extensive collection of books</Typography>
                </Box>
                <Box>
                    <Typography variant="h6" color="primary" gutterBottom>⭐ Rate & Review</Typography>
                    <Typography variant="body2">Share your thoughts and rate your favorite books</Typography>
                </Box>
                <Box>
                    <Typography variant="h6" color="primary" gutterBottom>📝 Manage Lists</Typography>
                    <Typography variant="body2">Create reading lists and track your progress</Typography>
                </Box>
                <Box>
                    <Typography variant="h6" color="primary" gutterBottom>👥 Connect</Typography>
                    <Typography variant="body2">Connect with other book lovers</Typography>
                </Box>
            </Box>
        </Paper>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            <Button variant="contained" size="large" component={Link} to="/login" startIcon={<PeopleIcon />}>
                Login
            </Button>
            <Button variant="outlined" size="large" component={Link} to="/signup">
                Sign Up
            </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
            Join thousands of book enthusiasts and start your reading journey today!
        </Typography>
    </Container>
);

// This is a new component to display a single book in a card
const BookCard = ({ book }) => (
    <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', borderRadius: '12px', boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {book.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    by {book.author}
                </Typography>
                <Typography variant="body2">
                    <strong>Genre:</strong> {book.genre}
                </Typography>
                <Typography variant="body2">
                    <strong>Published:</strong> {book.publication_year}
                </Typography>
            </CardContent>
        </Card>
    </Grid>
);

// This is the new view for logged-in users that displays the list of books
const BookListView = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await getBookList();
                setBooks(data);
            } catch (err) {
                setError('Failed to fetch books. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 5, mx: 'auto', maxWidth: 600 }}>{error}</Alert>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Our Book Collection
            </Typography>
            <Grid container spacing={4} sx={{ mt: 2 }}>
                {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </Grid>
        </Container>
    );
};

// The main Home component now decides which view to show
const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // 2. Check for a token to determine login status
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token); // '!!' converts the token string (or null) to a boolean
    }, []); // The empty array [] means this effect runs only once when the component mounts

    // 3. Conditionally render the correct view
    return isLoggedIn ? <BookListView /> : <WelcomeView />;
};

export default Home;