import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, Plus, Minus, Trash2, X } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Cart = () => {
    const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart();
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handlePlaceOrder = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (items.length === 0) {
            alert('Your cart is empty');
            return;
        }

        setIsPlacingOrder(true);
        try {
            const orderData = {
                items: items.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            const response = await axios.post('/api/orders', orderData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                clearCart();
                navigate(`/orders/${response.data.order.id}`);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const subtotal = getTotalPrice();
    const shipping = 15.00;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    // Generate a mock order number and date for display
    const orderNumber = 123;
    const orderDate = new Date().toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-black text-white text-center py-2 px-4">
                <span className="text-sm">
                    Sign up and get 20% off to your first order. 
                    <button className="underline font-medium ml-1">Sign Up Now</button>
                </span>
                <button className="absolute right-4 top-2">
                    <X className="h-4 w-4" />
                </button>
            </header>

            {/* Navigation */}
            <nav className="border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <button className="md:hidden">
                            <Menu className="h-6 w-6" />
                        </button>
                        <Link to="/">
                            <div className="flex items-center border-2 border-black h-8">
                                <div className="w-8 h-full bg-white flex items-center justify-center border-r-2 border-black">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-black">
                                        <path 
                                            d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            fill="none"
                                        />
                                        <path 
                                            d="M12 2V22M2 8.5L22 15.5M22 8.5L2 15.5M12 2L22 8.5L12 22L2 15.5L12 2Z" 
                                            stroke="currentColor" 
                                            strokeWidth="1.5"
                                        />
                                    </svg>
                                </div>
                                <div className="h-full bg-white flex items-center px-2">
                                    <span className="font-bold text-lg text-black">izam</span>
                                </div>
                            </div>
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/products" className="text-black font-medium hover:text-gray-600">
                                Products
                            </Link>
                            <button className="px-3 py-1.5 text-sm bg-black text-white rounded">
                                Sell Your Product
                            </button>
                        </nav>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button className="md:hidden">
                            <Search className="h-5 w-5 text-black" />
                        </button>
                        <Link to="/cart" className="relative">
                            <ShoppingCart className="h-5 w-5 text-black" />
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {getTotalItems()}
                                </span>
                            )}
                        </Link>
                        
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 hidden md:block">
                                    Welcome, {user?.name}
                                </span>
                                <button 
                                    onClick={handleLogout}
                                    className="px-3 py-1.5 text-sm border border-gray-300 text-black rounded hover:bg-gray-50"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <button className="px-3 py-1.5 text-sm bg-black text-white rounded hover:bg-gray-800">
                                    Login
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Breadcrumb */}
            <div className="px-6 py-3 text-sm text-gray-500">
                <Link to="/" className="hover:text-gray-700">Home</Link> › 
                <Link to="/products" className="hover:text-gray-700 ml-1">Casual</Link>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Cart Title */}
                <h1 className="text-3xl font-bold mb-8">Your cart</h1>

                {items.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <ShoppingCart className="h-16 w-16 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8">Add some products to get started</p>
                        <Link to="/products">
                            <button className="bg-black text-white px-6 py-3 rounded-lg font-medium">
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg relative">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.image ? (
                                            <img 
                                                src={item.image} 
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                                <p className="text-sm text-gray-500">{item.category?.category || 'T-shirts'}</p>
                                            </div>
                                            <button 
                                                className="text-red-500 hover:text-red-700 p-1"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-xl font-bold">${item.price}</p>
                                                <p className="text-sm text-gray-500">Stock: {item.stock || 25}</p>
                                            </div>
                                            
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                                                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                <button 
                                                    className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantity Badge */}
                                    <div className="absolute -top-2 -right-2 lg:relative lg:top-auto lg:right-auto lg:self-start">
                                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                                            {item.quantity}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="mt-8 lg:mt-0">
                            <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">Order Summary (#{orderNumber})</h2>
                                    <span className="text-sm text-blue-600">{orderDate}</span>
                                </div>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium">${shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-medium">${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-bold">Total</span>
                                            <span className="text-lg font-bold">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isPlacingOrder || items.length === 0}
                                    className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPlacingOrder ? 'Placing Order...' : 'Place the order'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart; 