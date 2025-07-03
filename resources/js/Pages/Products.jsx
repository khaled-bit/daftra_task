import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Plus, Minus, ShoppingCart, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Products = () => {
    console.log('🎯 Products component rendering...');
    
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 300]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [productQuantity, setProductQuantity] = useState(1);
    
    const { items, addItem, removeItem, updateQuantity, getTotalItems, getTotalPrice } = useCart();
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('🚀 Products component mounted, fetching categories...');
        fetchCategories();
    }, []);

    useEffect(() => {
        console.log('🔄 Dependencies changed, fetching products...', { search, selectedCategory, priceRange, page });
        fetchProducts();
    }, [search, selectedCategory, priceRange, page]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    const fetchProducts = async () => {
        console.log('🔄 fetchProducts called');
        setLoading(true);
        try {
            const params = {
                page,
                per_page: 12,
                ...(search && { search }),
                ...(selectedCategory !== 'all' && { category_id: selectedCategory }),
                min_price: priceRange[0],
                max_price: priceRange[1]
            };

            console.log('📤 Making API call with params:', params);
            const response = await axios.get('/api/products', { params });
            console.log('📥 API Response received:', response);
            console.log('📦 Response data:', response.data);
            
            // Laravel pagination response structure: response.data.data contains the products
            if (response.data && response.data.data) {
                console.log('✅ Found products data:', response.data.data);
                console.log('📊 Products count:', response.data.data.length);
                setProducts(Array.isArray(response.data.data) ? response.data.data : []);
                setTotalPages(response.data.last_page || 1);
            } else {
                console.log('❌ No products data found in response');
                console.log('🔍 Available keys:', Object.keys(response.data || {}));
                setProducts([]);
                setTotalPages(1);
            }
        } catch (error) {
            setError('Failed to fetch products');
            console.error('💥 Error fetching products:', error);
            console.error('📄 Error response:', error.response);
            setProducts([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
            console.log('✋ fetchProducts finished');
        }
    };

    const handleAddToCart = (product, quantity = 1) => {
        addItem(product, quantity);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setProductQuantity(1);
        setShowProductDetails(true);
    };

    const handleApplyFilters = () => {
        setPage(1);
        fetchProducts();
        setShowFilters(false);
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedCategory('all');
        setPriceRange([0, 300]);
        setPage(1);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };



    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-black text-white text-center py-2 px-4">
                <span className="text-sm">
                    Sign up and get 20% off to your first order. 
                    <button className="underline font-medium ml-1">Sign Up Now</button>
                </span>
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
                            <span className="text-black font-medium">Products</span>
                            <button className="px-3 py-1.5 text-sm bg-black text-white rounded">
                                Sell Your Product
                            </button>
                        </nav>
                    </div>
                    
                    {/* Right side - exactly like login page */}
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
                <Link to="/" className="hover:text-gray-700">Home</Link> › Casual
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
                {/* Mobile Filter Button */}
                <button 
                    className="md:hidden fixed bottom-4 left-4 bg-black text-white p-3 rounded-full z-50"
                    onClick={() => setShowFilters(true)}
                >
                    <Filter className="h-5 w-5" />
                </button>

                {/* Filters Sidebar */}
                <div className={`${showFilters ? 'fixed inset-0 z-50 bg-white' : 'hidden'} md:block md:w-64 md:relative`}>
                    <div className="p-6 border-r border-gray-200 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Filters</h2>
                            <button className="md:hidden" onClick={() => setShowFilters(false)}>
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Price Range */}
                        <div className="mb-8">
                            <h3 className="font-semibold mb-4">Price</h3>
                            <div className="relative">
                                <input
                                    type="range"
                                    min="0"
                                    max="300"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-sm text-gray-500 mt-2">
                                    <span>${priceRange[0]}</span>
                                    <span>${priceRange[1]}</span>
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="mb-8">
                            <h3 className="font-semibold mb-4">Category</h3>
                            <div className="space-y-3">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="all"
                                        checked={selectedCategory === 'all'}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="ml-2">All</span>
                                </label>
                                {Array.isArray(categories) && categories.map((category) => (
                                    <label key={category.id} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="category"
                                            value={category.id}
                                            checked={selectedCategory === category.id}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="ml-2">{category.category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleApplyFilters}
                            className="w-full bg-black text-white py-3 rounded-lg font-medium mb-4"
                        >
                            Apply Filter
                        </button>

                        <button
                            onClick={handleClearFilters}
                            className="w-full text-gray-500 py-2 text-center"
                        >
                            Clear all filters
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search by product name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    </div>

                    {/* Category Title */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">Casual</h1>
                        <span className="text-gray-500">Showing 1-{products.length} of {products.length} Products</span>
                    </div>

                    {/* Debug Info */}
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
                        <h3 className="font-bold">🐛 Debug Info:</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                            <div>Loading: <span className="font-mono">{loading ? 'true' : 'false'}</span></div>
                            <div>Error: <span className="font-mono">{error || 'none'}</span></div>
                            <div>Products Length: <span className="font-mono">{products.length}</span></div>
                            <div>Products Array: <span className="font-mono">{Array.isArray(products) ? 'true' : 'false'}</span></div>
                            <div>Page: <span className="font-mono">{page}</span></div>
                            <div>Total Pages: <span className="font-mono">{totalPages}</span></div>
                        </div>
                        {products.length > 0 && (
                            <div className="mt-2">
                                <div className="text-sm">First Product: <span className="font-mono">{products[0]?.name || 'undefined'}</span></div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-lg">Loading...</div>
                        </div>
                    ) : (
                        <>
                            {/* Products Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {Array.isArray(products) && products.map((product) => (
                                    <div key={product.id} className="group cursor-pointer">
                                        <div className="relative">
                                            <div 
                                                className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4"
                                                onClick={() => handleProductClick(product)}
                                            >
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <button 
                                                className="absolute top-2 right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleProductClick(product)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                                        <p className="text-gray-500 text-sm mb-2">{product.category?.category}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-xl">${product.price}</span>
                                            <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                                        </div>
                                        <div className="flex items-center mt-3">
                                            <button 
                                                className="border border-gray-300 w-8 h-8 rounded flex items-center justify-center"
                                                onClick={() => {
                                                    const currentQty = items.find(item => item.id === product.id)?.quantity || 0;
                                                    if (currentQty > 0) {
                                                        updateQuantity(product.id, currentQty - 1);
                                                    }
                                                }}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="mx-3 font-medium">
                                                {items.find(item => item.id === product.id)?.quantity || 0}
                                            </span>
                                            <button 
                                                className="border border-gray-300 w-8 h-8 rounded flex items-center justify-center"
                                                onClick={() => handleAddToCart(product, 1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setPage(Math.max(1, page - 1))}
                                        disabled={page === 1}
                                        className="flex items-center gap-1 px-3 py-2 text-gray-500 disabled:opacity-50"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </button>
                                    
                                    {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                                        const pageNum = index + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`w-10 h-10 rounded ${
                                                    page === pageNum 
                                                        ? 'bg-black text-white' 
                                                        : 'text-gray-500 hover:bg-gray-100'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    
                                    <button
                                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                                        disabled={page === totalPages}
                                        className="flex items-center gap-1 px-3 py-2 text-gray-500 disabled:opacity-50"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Product Details Modal */}
            {showProductDetails && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Product Details</h2>
                                <button onClick={() => setShowProductDetails(false)}>
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                                {selectedProduct.image ? (
                                    <img
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="text-2xl font-bold mb-2">{selectedProduct.name}</h3>
                            <p className="text-blue-600 font-medium mb-4">{selectedProduct.category?.category}</p>
                            <p className="text-3xl font-bold mb-6">${selectedProduct.price}</p>
                            
                            <div className="mb-6">
                                <h4 className="font-semibold mb-2">Product Details</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Category:</span>
                                        <span className="text-blue-600">{selectedProduct.category?.category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Stock:</span>
                                        <span>{selectedProduct.stock} items</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <h4 className="font-semibold mb-3">Quantity</h4>
                                <div className="flex items-center">
                                    <button 
                                        className="border border-gray-300 w-10 h-10 rounded flex items-center justify-center"
                                        onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="mx-4 font-medium text-lg">{productQuantity}</span>
                                    <button 
                                        className="border border-gray-300 w-10 h-10 rounded flex items-center justify-center"
                                        onClick={() => setProductQuantity(productQuantity + 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <button
                                onClick={() => {
                                    handleAddToCart(selectedProduct, productQuantity);
                                    setShowProductDetails(false);
                                }}
                                className="w-full bg-black text-white py-3 rounded-lg font-medium"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default Products; 