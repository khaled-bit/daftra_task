import React, { useState } from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Button,
    TextField,
    Divider,
    Avatar
} from '@mui/material';
import { Close, Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import CheckoutDialog from './CheckoutDialog';

const CartDrawer = ({ open, onClose }) => {
    const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeItem(productId);
        } else {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleCheckout = () => {
        setCheckoutOpen(true);
    };

    return (
        <>
            <Drawer anchor="right" open={open} onClose={onClose}>
                <Box sx={{ width: 400, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Shopping Cart</Typography>
                        <IconButton onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Box>

                    {items.length === 0 ? (
                        <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
                            Your cart is empty
                        </Typography>
                    ) : (
                        <>
                            <List>
                                {items.map((item) => (
                                    <ListItem key={item.product.id} sx={{ px: 0 }}>
                                        <Avatar
                                            src={item.product.image}
                                            alt={item.product.name}
                                            sx={{ mr: 2 }}
                                        />
                                        <ListItemText
                                            primary={item.product.name}
                                            secondary={`$${item.product.price} each`}
                                        />
                                        <ListItemSecondaryAction>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                                >
                                                    <Remove />
                                                </IconButton>
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value) || 0)}
                                                    sx={{ width: 60 }}
                                                    inputProps={{ min: 0 }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                                >
                                                    <Add />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => removeItem(item.product.id)}
                                                    color="error"
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Box>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6">Total:</Typography>
                                <Typography variant="h6">${getTotalPrice().toFixed(2)}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" onClick={clearCart} sx={{ flex: 1 }}>
                                    Clear Cart
                                </Button>
                                <Button variant="contained" onClick={handleCheckout} sx={{ flex: 1 }}>
                                    Checkout
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Drawer>

            <CheckoutDialog
                open={checkoutOpen}
                onClose={() => setCheckoutOpen(false)}
                onSuccess={() => {
                    setCheckoutOpen(false);
                    onClose();
                }}
            />
        </>
    );
};

export default CartDrawer; 