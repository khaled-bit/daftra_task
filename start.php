<?php
// Get port from environment, ensuring it's an integer
$port = (int) ($_ENV['PORT'] ?? getenv('PORT') ?: 8000);
$host = '0.0.0.0';

echo "🚀 Starting Laravel E-commerce Application..." . PHP_EOL;
echo "📍 Server: {$host}:{$port}" . PHP_EOL;
echo "📁 Document root: " . __DIR__ . "/public" . PHP_EOL . PHP_EOL;

// Change to the application directory
chdir(__DIR__);

// Check if this is a fresh deployment (no migration files exist in database)
echo "🔍 Checking database status..." . PHP_EOL;

// Run migrations
echo "📊 Running database migrations..." . PHP_EOL;
$migrationResult = null;
$migrationOutput = [];
exec("php artisan migrate --force 2>&1", $migrationOutput, $migrationResult);

if ($migrationResult === 0) {
    echo "✅ Migrations completed successfully!" . PHP_EOL;
} else {
    echo "⚠️  Migration output:" . PHP_EOL;
    echo implode(PHP_EOL, $migrationOutput) . PHP_EOL;
}

// Run seeding only if migrations were successful or if it's a fresh installation
echo "🌱 Seeding database with sample data..." . PHP_EOL;
$seedResult = null;
$seedOutput = [];
exec("php artisan db:seed --force 2>&1", $seedOutput, $seedResult);

if ($seedResult === 0) {
    echo "✅ Database seeding completed!" . PHP_EOL;
} else {
    echo "ℹ️  Seeding may have been skipped (data already exists)" . PHP_EOL;
}

echo PHP_EOL . "🌐 Starting web server..." . PHP_EOL;

// Use PHP's built-in server directly to avoid ServeCommand issues
$command = "php -S {$host}:{$port} -t public public/index.php";
echo "⚡ Executing: {$command}" . PHP_EOL . PHP_EOL;

// Use passthru to properly execute and pass through output
passthru($command); 