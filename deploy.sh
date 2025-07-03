#!/bin/bash

echo "🚀 Starting deployment process..."

# Run migrations
echo "📊 Running database migrations..."
php artisan migrate --force

# Seed the database (only on first deploy)
echo "🌱 Seeding database..."
php artisan db:seed --force

# Clear and cache config
echo "⚡ Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ Deployment completed!" 