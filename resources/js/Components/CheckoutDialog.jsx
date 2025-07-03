import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const CheckoutDialog = ({ open, onClose, onSuccess }) => {
    const { items, clearCart, getTotalPrice } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const orderData = {
                ...formData,
                items: items.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity
                }))
            };

            const response = await axios.post('/api/orders', orderData);
            
            clearCart();
            onSuccess();
            
            alert(`Order placed successfully! Order number: ${response.data.order.order_number}`);
            
        } catch (error) {
            console.error('Order placement failed:', error);
            setError(error.response?.data?.error || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: '',
            address: ''
        });
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Checkout</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Order Summary: ${getTotalPrice().toFixed(2)}
                    </Typography>
                    
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="name"
                        label="Full Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="phone"
                        label="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="address"
                        label="Delivery Address"
                        multiline
                        rows={3}
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    disabled={loading || items.length === 0}
                >
                    {loading ? <CircularProgress size={24} /> : 'Place Order'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CheckoutDialog; 