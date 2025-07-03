<?php
// Minimal startup script for troubleshooting
$port = (int) ($_ENV['PORT'] ?? getenv('PORT') ?: 8000);
echo "Starting simple server on port {$port}..." . PHP_EOL;
chdir(__DIR__);
passthru("php -S 0.0.0.0:{$port} -t public public/index.php"); 