import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, X, Menu, Search } from 'lucide-react';
import { ShoppingCart } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

// Custom Button component
const Button = ({ children, className = '', size = 'default', type = 'button', onClick, ...props }) => {
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        default: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg'
    };
    
    return (
        <button
            type={type}
            onClick={onClick}
            className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

// Custom Input component
const Input = ({ className = '', type = 'text', ...props }) => {
    return (
        <input
            type={type}
            className={`flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:border-black focus:ring-1 focus:ring-black focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        />
    );
};

// Custom Label component
const Label = ({ children, htmlFor, className = '' }) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
        >
            {children}
        </label>
    );
};

export default function Login() {
    const { login, register, isAuthenticated } = useAuth();
    const { getTotalItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [showPassword, setShowPassword] = useState(false);
    const [showBanner, setShowBanner] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [registerForm, setRegisterForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    React.useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/';
            navigate(from);
        }
    }, [isAuthenticated, navigate, location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(email, password);
        
        if (result.success) {
            const from = location.state?.from?.pathname || '/';
            navigate(from);
        } else {
            setError(result.error);
        }
        
        setLoading(false);
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (registerForm.password !== registerForm.password_confirmation) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        const result = await register(
            registerForm.name,
            registerForm.email,
            registerForm.password,
            registerForm.password_confirmation
        );
        
        if (result.success) {
            const from = location.state?.from?.pathname || '/';
            navigate(from);
        } else {
            setError(result.error);
        }
        
        setLoading(false);
    };

    const handleRegisterChange = (e) => {
        setRegisterForm({
            ...registerForm,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Top Banner */}
            {showBanner && (
                <div className="bg-black text-white text-center py-2 px-4 relative">
                    <span className="text-sm">
                        Sign up and get 20% off to your first order.{" "}
                        <button 
                            className="underline font-medium"
                            onClick={() => setIsLoginMode(false)}
                        >
                            Sign Up Now
                        </button>
                    </span>
                    <button
                        onClick={() => setShowBanner(false)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Header */}
            <header className="border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Left side - Logo and Navigation */}
                    <div className="flex items-center gap-8">
                        <button className="md:hidden">
                            <Menu className="h-6 w-6" />
                        </button>
                        <Link to="/">
                            <div className="flex items-center border-2 border-black h-8">
                                {/* Icon section - 1/4 of width */}
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
                                {/* Text section - 3/4 of width */}
                                <div className="h-full bg-white flex items-center px-2">
                                    <span className="font-bold text-lg text-black">izam</span>
                                </div>
                            </div>
                        </Link>
                        {/* Desktop Navigation - right next to logo */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/products" className="text-black font-medium hover:text-gray-600">
                                Products
                            </Link>
                            <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                                Sell Your Product
                            </Button>
                        </nav>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        <button className="md:hidden">
                            <Search className="h-5 w-5 text-black" />
                        </button>
                        <button className="relative">
                            <ShoppingCart sx={{ color: 'black', fontSize: 20 }} />
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {getTotalItems()}
                                </span>
                            )}
                        </button>
                        <Button size="sm" className="bg-black hover:bg-gray-800 text-white">
                            {isLoginMode ? 'Login' : 'Register'}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {isLoginMode ? 'Welcome back' : 'Create your account'}
                        </h1>
                        <p className="text-gray-600">
                            {isLoginMode 
                                ? 'Please enter your details to sign in' 
                                : 'Please enter your details to sign up'
                            }
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* Toggle buttons for switching between login and register */}
                    <div className="mb-4 flex gap-2">
                        <Button
                            onClick={() => setIsLoginMode(true)}
                            className={`flex-1 ${isLoginMode 
                                ? 'bg-black text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Login
                        </Button>
                        <Button
                            onClick={() => setIsLoginMode(false)}
                            className={`flex-1 ${!isLoginMode 
                                ? 'bg-black text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Register
                        </Button>
                    </div>

                    {isLoginMode ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 font-medium">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 border-gray-300 focus:border-black focus:ring-black"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700 font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 border-gray-300 focus:border-black focus:ring-black pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Login'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegisterSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-700 font-medium">
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={registerForm.name}
                                    onChange={handleRegisterChange}
                                    className="h-12 border-gray-300 focus:border-black focus:ring-black"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reg_email" className="text-gray-700 font-medium">
                                    Email
                                </Label>
                                <Input
                                    id="reg_email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={registerForm.email}
                                    onChange={handleRegisterChange}
                                    className="h-12 border-gray-300 focus:border-black focus:ring-black"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reg_password" className="text-gray-700 font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="reg_password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={registerForm.password}
                                        onChange={handleRegisterChange}
                                        className="h-12 border-gray-300 focus:border-black focus:ring-black pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-gray-700 font-medium">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={registerForm.password_confirmation}
                                    onChange={handleRegisterChange}
                                    className="h-12 border-gray-300 focus:border-black focus:ring-black"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium"
                                disabled={loading}
                            >
                                {loading ? 'Creating account...' : 'Register'}
                            </Button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
} 