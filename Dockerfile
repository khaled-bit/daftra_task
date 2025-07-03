FROM php:8.2-fpm

# Install PHP extensions
RUN apt-get update && apt-get install -y \
    git curl zip unzip \
    libzip-dev libpng-dev \
    && docker-php-ext-install zip pdo pdo_mysql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory for backend
WORKDIR /var/www

# Copy entire project into container
COPY . /var/www

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Switch to frontend directory (where package.json lives)
WORKDIR /var/www/resources

# Install Node.js, npm dependencies, and build frontend assets
RUN curl -fsSL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get install -y nodejs
RUN echo "Contents of ui folder:" && ls -al /var/www/resources/js/Components/ui
RUN npm install
RUN npm run build


# Switch back to backend directory
WORKDIR /var/www

# Set permissions for Laravel storage and cache folders
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Expose port and run PHP built-in server
EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
