<?php
// Get port from environment, ensuring it's an integer
$port = (int) ($_ENV['PORT'] ?? getenv('PORT') ?: 8000);
$host = '0.0.0.0';

echo "🚀 Starting Laravel E-commerce Application..." . PHP_EOL;
echo "📍 Server: {$host}:{$port}" . PHP_EOL;
echo "📁 Document root: " . __DIR__ . "/public" . PHP_EOL;

// Change to the application directory
chdir(__DIR__);

// Check if essential files exist
if (!file_exists('public/index.php')) {
    echo "❌ ERROR: public/index.php not found!" . PHP_EOL;
    exit(1);
}

if (!file_exists('vendor/autoload.php')) {
    echo "❌ ERROR: vendor/autoload.php not found! Run composer install." . PHP_EOL;
    exit(1);
}

// Check environment variables
echo "🔧 Environment Check:" . PHP_EOL;
echo "  - APP_ENV: " . (getenv('APP_ENV') ?: 'not set') . PHP_EOL;
echo "  - APP_KEY: " . (getenv('APP_KEY') ? 'set' : 'NOT SET') . PHP_EOL;
echo "  - DB_CONNECTION: " . (getenv('DB_CONNECTION') ?: 'not set') . PHP_EOL;

// Only run migrations if database is configured
if (getenv('DB_CONNECTION') && getenv('APP_KEY')) {
    echo PHP_EOL . "📊 Running database setup..." . PHP_EOL;
    
    // Test database connection first
    echo "Testing database connection..." . PHP_EOL;
    $testOutput = [];
    $testResult = 0;
    exec("php artisan migrate:status --no-interaction 2>&1", $testOutput, $testResult);
    
    if ($testResult === 0) {
        echo "✅ Database connected successfully!" . PHP_EOL;
        
        // Run migrations
        echo "Running migrations..." . PHP_EOL;
        $migrationOutput = [];
        $migrationResult = 0;
        exec("php artisan migrate --force --no-interaction 2>&1", $migrationOutput, $migrationResult);
        
        if ($migrationResult === 0) {
            echo "✅ Migrations completed!" . PHP_EOL;
            
            // Try seeding (but don't fail if it doesn't work)
            echo "Running database seeding..." . PHP_EOL;
            exec("php artisan db:seed --force --no-interaction 2>&1", $seedOutput, $seedResult);
            if ($seedResult === 0) {
                echo "✅ Database seeded!" . PHP_EOL;
            } else {
                echo "ℹ️  Seeding skipped (data may already exist)" . PHP_EOL;
            }
        } else {
            echo "⚠️  Migration failed:" . PHP_EOL;
            echo implode(PHP_EOL, $migrationOutput) . PHP_EOL;
            echo "Continuing with server startup..." . PHP_EOL;
        }
    } else {
        echo "⚠️  Database connection failed:" . PHP_EOL;
        echo implode(PHP_EOL, $testOutput) . PHP_EOL;
        echo "Starting server without database setup..." . PHP_EOL;
    }
} else {
    echo "ℹ️  Skipping database setup (missing configuration)" . PHP_EOL;
}

echo PHP_EOL . "🌐 Starting web server..." . PHP_EOL;
echo "Visit your app at: https://your-domain.up.railway.app" . PHP_EOL;
echo "API endpoints at: https://your-domain.up.railway.app/api" . PHP_EOL . PHP_EOL;

// Use PHP's built-in server
$command = "php -S {$host}:{$port} -t public public/index.php";
echo "⚡ Executing: {$command}" . PHP_EOL . PHP_EOL;

// Start the server
passthru($command); 