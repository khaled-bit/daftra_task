import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Products from './Pages/Products';
import OrderDetails from './Pages/OrderDetails';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import '../css/app.css';
import './bootstrap';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/orders/:id" element={<OrderDetails />} />
                    <Route path="/" element={<Products />} />
                </Routes>
            </CartProvider>
        </AuthProvider>
    );
}

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
); 