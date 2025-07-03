# E-Commerce API System

A complete Laravel-based e-commerce system with React frontend, featuring product management, order processing, and user authentication using Laravel Sanctum.

## 🚀 Features

### Backend (Laravel API)
- **Product Management**: Full CRUD operations with pagination, search, and filtering
- **Order Processing**: Complete order lifecycle with stock validation
- **User Authentication**: Secure token-based authentication using Laravel Sanctum
- **Event System**: Order placement triggers email notifications
- **Caching**: Redis/Database caching for improved performance
- **Admin Panel**: Administrative features for managing products, orders, and users

### Frontend (React.js)
- **Responsive Design**: Fully responsive interface using Tailwind CSS
- **Product Catalog**: Search, filter, and browse products with pagination
- **Shopping Cart**: Persistent cart functionality with localStorage
- **User Authentication**: Login/Register with token management
- **Order Management**: View order history and details
- **Admin Dashboard**: Product and order management interface

## 📋 Requirements

- PHP >= 8.2
- Node.js >= 16.x
- MySQL >= 8.0
- Composer
- NPM

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd MoteSine-master

# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 2. Database Configuration

```bash
# Create database
mysql -u root -p
CREATE DATABASE daftra_assessment;
EXIT;

# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env file
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=daftra_assessment
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 3. Database Migration and Seeding

```bash
# Run migrations
php artisan migrate

# Seed database with sample data
php artisan db:seed
```

This will create:
- **3 Users**: admin@example.com, test@example.com, customer@example.com (password: "password")
- **7 Categories**: Electronics, Clothing, Books, Home & Kitchen, Sports, Beauty, Toys
- **19 Products**: Various products with realistic data
- **3 Sample Orders**: Different order statuses and items

### 4. Laravel Sanctum Setup

```bash
# Install Sanctum (already included)
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 5. Start Development Servers

```bash
# Terminal 1: Start Laravel development server
php artisan serve

# Terminal 2: Start Vite development server for React
npm run dev
```

Visit `http://localhost:8000` to access the application.

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password",
    "password_confirmation": "password"
}
```

#### Login User
```http
POST /api/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password"
}

Response:
{
    "user": {...},
    "token": "1|abc123..."
}
```

#### Get Authenticated User
```http
GET /api/user
Authorization: Bearer {token}
```

#### Logout User
```http
POST /api/logout
Authorization: Bearer {token}
```

### Product Endpoints

#### Get All Products
```http
GET /api/products?page=1&per_page=12&search=laptop&category_id=1&min_price=100&max_price=1000
```

Query Parameters:
- `page`: Page number for pagination
- `per_page`: Items per page (default: 12)
- `search`: Search by product name or description
- `category_id`: Filter by category
- `min_price`: Minimum price filter
- `max_price`: Maximum price filter

#### Get Single Product
```http
GET /api/products/{id}
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "name": "Product Name",
    "description": "Product description",
    "price": 29.99,
    "stock_quantity": 100,
    "category_id": 1,
    "is_visible": true
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/{id}
Authorization: Bearer {admin_token}
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/{id}
Authorization: Bearer {admin_token}
```

### Category Endpoints

#### Get All Categories
```http
GET /api/categories
```

### Order Endpoints (Protected)

#### Create Order
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
    "items": [
        {
            "product_id": 1,
            "quantity": 2
        },
        {
            "product_id": 3,
            "quantity": 1
        }
    ]
}
```

#### Get User Orders
```http
GET /api/orders
Authorization: Bearer {token}
```

#### Get Single Order
```http
GET /api/orders/{id}
Authorization: Bearer {token}
```

## 🔒 Authentication Flow

1. **Registration/Login**: User registers or logs in to receive an authentication token
2. **Token Storage**: Frontend stores the token in localStorage
3. **API Requests**: Token is sent in Authorization header for protected endpoints
4. **Token Validation**: Laravel Sanctum validates the token on each request
5. **Logout**: Token is revoked when user logs out

## 🎨 Frontend Structure

### Pages
- **Login Page**: Authentication with tabbed login/register forms
- **Products Page**: Product catalog with search, filters, and cart
- **Cart Page**: Shopping cart management and checkout
- **Order Details**: View individual order information
- **Admin Dashboard**: Product and order management (admin only)

### Key Components
- **AuthContext**: Manages user authentication state
- **CartContext**: Handles shopping cart state and persistence
- **ProtectedRoute**: Route protection for authenticated users
- **AdminRoute**: Route protection for admin users

## 🏗️ Project Structure

```
app/
├── Http/Controllers/Api/     # API Controllers
│   ├── ProductController.php
│   └── OrderController.php
├── Models/                   # Eloquent Models
│   ├── User.php
│   ├── Product.php
│   ├── Order.php
│   ├── OrderItem.php
│   └── Category.php
├── Events/                   # Event Classes
│   └── OrderPlaced.php
└── Listeners/                # Event Listeners
    └── SendOrderNotification.php

resources/js/
├── Pages/                    # React Pages
│   ├── Login.jsx
│   ├── Products.jsx
│   ├── OrderDetails.jsx
│   └── User/
│       ├── Cart.jsx
│       └── Checkout.jsx
├── Components/               # React Components
│   ├── Auth/
│   ├── Products/
│   └── ui/
└── contexts/                 # React Contexts
    ├── AuthContext.jsx
    └── CartContext.jsx
```

## 🧪 Testing

### Run Tests
```bash
# Run PHP tests
php artisan test

# Run specific test
php artisan test --filter=ProductTest
```

### Test Accounts
- **Admin**: admin@example.com / password
- **Customer**: test@example.com / password
- **Customer**: customer@example.com / password

## 🚀 Production Deployment

### Build Assets
```bash
npm run build
```

### Environment Configuration
```bash
# Set production environment
APP_ENV=production
APP_DEBUG=false

# Configure production database
DB_HOST=your_production_host
DB_DATABASE=your_production_database

# Set up proper caching
CACHE_STORE=redis
QUEUE_CONNECTION=redis

# Configure mail for notifications
MAIL_MAILER=smtp
MAIL_HOST=your_smtp_host
```

### Optimize Application
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

## 🔧 Development

### Code Standards
- Follow PSR-12 coding standards for PHP
- Use ESLint and Prettier for JavaScript
- Write descriptive commit messages
- Add comments for complex business logic

### Adding Features
1. Create migrations for database changes
2. Update models with new relationships
3. Add API endpoints in controllers
4. Update frontend components
5. Write tests for new functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## 📄 License

This project is open-sourced software licensed under the MIT license.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.
