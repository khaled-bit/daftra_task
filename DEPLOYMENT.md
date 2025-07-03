# 🚀 Deploy Your E-Commerce App to Railway

This guide will help you deploy your Laravel e-commerce application to Railway for free!

## 📋 Prerequisites

1. **GitHub Account** - Your code needs to be on GitHub
2. **Railway Account** - Sign up at [railway.app](https://railway.app)

## 🛠️ Step 1: Prepare Your Code for Deployment

### 1.1 Install PostgreSQL PHP Extension
```bash
# On your local machine, add this to composer.json if not present
composer require --dev pgsql
```

### 1.2 Update Environment Configuration
Create a production `.env` file with these settings:
```env
APP_NAME="E-Commerce API"
APP_ENV=production
APP_KEY=base64:your-app-key-here
APP_DEBUG=false
APP_TIMEZONE=UTC
APP_URL=https://your-app-name.up.railway.app

# Database will be set by Railway automatically
DB_CONNECTION=pgsql
DB_HOST=
DB_PORT=5432
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

# Important: Add Railway domain to Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost,*.railway.app

# Cache & Queue
CACHE_STORE=database
QUEUE_CONNECTION=database
SESSION_DRIVER=database

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=error
```

## 🐙 Step 2: Push to GitHub

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - E-commerce Laravel App"
```

2. **Create GitHub Repository**:
   - Go to [github.com](https://github.com)
   - Click "New Repository"
   - Name it: `laravel-ecommerce`
   - Make it public
   - Don't initialize with README

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR-USERNAME/laravel-ecommerce.git
git branch -M main
git push -u origin main
```

## 🚄 Step 3: Deploy to Railway

### 3.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Verify your account

### 3.2 Create New Project
1. Click **"Start a New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `laravel-ecommerce` repository
4. Click **"Deploy Now"**

### 3.3 Add PostgreSQL Database
1. In your Railway project dashboard
2. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Wait for it to provision

### 3.4 Configure Environment Variables
1. Click on your **Laravel service** (not the database)
2. Go to **"Variables"** tab
3. Add these variables:

```
APP_NAME=E-Commerce API
APP_ENV=production
APP_KEY=base64:GENERATE_NEW_KEY
APP_DEBUG=false
APP_URL=https://your-domain.up.railway.app
DB_CONNECTION=pgsql
SANCTUM_STATEFUL_DOMAINS=localhost,*.railway.app
CACHE_STORE=database
QUEUE_CONNECTION=database
SESSION_DRIVER=database
LOG_LEVEL=error
```

**Important**: Generate a new APP_KEY:
```bash
# Run this locally and copy the output
php artisan key:generate --show
```

### 3.5 Connect Database
Railway should automatically connect your PostgreSQL database. The DB variables will be set automatically.

### 3.6 Deploy and Migrate
1. Railway will automatically deploy your app
2. Once deployed, open the **Railway CLI** or use the web console
3. Run migrations:
```bash
# In Railway console/CLI
php artisan migrate --force
php artisan db:seed --force
```

## 🎯 Step 4: Configure Custom Domain (Optional)

1. In Railway dashboard → **Settings** → **Domains**
2. Click **"Generate Domain"** for a free `.railway.app` subdomain
3. Or add your custom domain

## ✅ Step 5: Test Your Live Application

Your app should now be live! Test these features:

### 🧪 Test Accounts
```
Admin: admin@example.com / password
User: test@example.com / password
Customer: customer@example.com / password
```

### 🔍 Test Features
- ✅ **Products Page**: Should show 19 products
- ✅ **Search**: Try searching for "iPhone"
- ✅ **Filters**: Use price and category filters
- ✅ **Authentication**: Login/logout
- ✅ **Cart**: Add products to cart
- ✅ **Orders**: Place test orders
- ✅ **Mobile**: Test on mobile devices

## 🛠️ Troubleshooting

### Common Issues:

**1. App Key Error**
```bash
# Generate new key locally, then add to Railway variables
php artisan key:generate --show
```

**2. Database Connection Error**
- Ensure PostgreSQL service is running in Railway
- Check that DB environment variables are set

**3. CORS/Sanctum Issues**
- Verify `SANCTUM_STATEFUL_DOMAINS` includes `*.railway.app`
- Check `APP_URL` matches your Railway domain

**4. Build Failures**
- Check Railway build logs
- Ensure all dependencies are in `composer.json`

**5. Migration Errors**
- Run migrations manually in Railway console
- Check PostgreSQL compatibility

### 📊 Railway Commands
```bash
# Access your app console
railway shell

# View logs
railway logs

# Run migrations
railway run php artisan migrate --force

# Seed database
railway run php artisan db:seed --force
```

## 🎉 Success!

Your Laravel e-commerce application is now live! Share your Railway URL with others.

**Next Steps:**
- Set up proper email service for order notifications
- Configure file storage for product images
- Set up monitoring and backups
- Add SSL certificate (automatic with Railway)

## 📱 API Endpoints

Your live API will be available at:
```
https://your-app.railway.app/api/products
https://your-app.railway.app/api/categories
https://your-app.railway.app/api/login
```

## 🔧 Maintenance

### Update Application
1. Push changes to GitHub
2. Railway will automatically redeploy
3. Run migrations if needed:
```bash
railway run php artisan migrate --force
```

### Monitor Performance
- Check Railway dashboard for metrics
- Monitor database usage
- Review application logs

---

**🎯 Your e-commerce platform is now live and accessible worldwide!** 