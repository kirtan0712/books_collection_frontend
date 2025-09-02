import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, Container, Card, CardContent, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import { getBookList, addBook } from '../services/UserServices';

// This is the new pop-up modal form for adding a book
const AddBookModal = ({ open, onClose, onBookAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        published_date: ''
    });
    const [formError, setFormError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            const newBook = await addBook(formData);
            onBookAdded(newBook); // Pass the new book back to the parent
            onClose(); // Close the modal
        } catch (error) {
            setFormError('Failed to add book. Please check the details and try again.');
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add a New Book</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Book Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="author"
                        label="Author"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.author}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="published_date"
                        label="Published Date"
                        type="date"
                        fullWidth
                        variant="outlined"
                        value={formData.published_date}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    {formError && <Alert severity="error" sx={{ mt: 2 }}>{formError}</Alert>}
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained" onClick={handleSubmit}>Save Book</Button>
            </DialogActions>
        </Dialog>
    );
};

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
                    <strong>Published:</strong> {book.published_date}
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
    const [isModalOpen, setIsModalOpen] = useState(false);

    // This function will be called from the modal to update the book list
    const handleBookAdded = (newBook) => {
        setBooks(prevBooks => [newBook, ...prevBooks]); // Add new book to the top of the list
    };

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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    My Book Collection
                </Typography>
                <Button variant="contained" onClick={() => setIsModalOpen(true)}>
                    Add New Book
                </Button>
            </Box>
            <Grid container spacing={4}>
                {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </Grid>
            {/* The Modal component is rendered here but is only visible when isModalOpen is true */}
            <AddBookModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onBookAdded={handleBookAdded}
            />
        </Container>
    );
};

// The main Home component now decides which view to show
const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);
    }, []);

    return isLoggedIn ? <BookListView /> : <WelcomeView />;
};

export default Home;