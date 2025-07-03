<?php
// Get port from environment, ensuring it's an integer
$port = (int) ($_ENV['PORT'] ?? getenv('PORT') ?: 8000);
$host = '0.0.0.0';

echo "Starting PHP built-in server on {$host}:{$port}" . PHP_EOL;
echo "Document root: " . __DIR__ . "/public" . PHP_EOL;

// Change to the application directory
chdir(__DIR__);

// Use PHP's built-in server directly to avoid ServeCommand issues
$command = "php -S {$host}:{$port} -t public public/index.php";
echo "Executing: {$command}" . PHP_EOL;

// Use passthru to properly execute and pass through output
passthru($command); 