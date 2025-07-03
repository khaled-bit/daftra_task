<?php
$port = (int) ($_ENV['PORT'] ?? getenv('PORT') ?: 8000);
$host = '0.0.0.0';

echo "Starting Laravel server on {$host}:{$port}" . PHP_EOL;

// Execute the serve command with proper integer port
$command = "php artisan serve --host={$host} --port={$port}";
echo "Executing: {$command}" . PHP_EOL;

exec($command); 