<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Middleware\IsAdmin;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Catch-all route for React app - serves the main React application
Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api).*');

// Public API routes (no authentication required)
Route::get('/api/categories', [CategoryController::class, 'index']);

// Authentication routes
Route::post('/api/login', [AuthController::class, 'login']);
Route::post('/api/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->get('/api/user', fn(Request $req) => $req->user());
Route::post('/api/logout', [AuthController::class, 'logout']);

// Admin routes (require authentication and admin role)
Route::middleware(['auth:sanctum', IsAdmin::class])->group(function () {
    Route::post("/api/category/create", [CategoryController::class, 'store']);
    Route::put('/api/category/{id}/visibility', [CategoryController::class, 'updateVisibility']);
    Route::put('/api/category/{category}', [CategoryController::class, 'update']);
    Route::delete('/api/category/{category}', [CategoryController::class, 'delete']);

    Route::get('/api/users', [AuthController::class, 'index']);
    Route::put('/api/user/{user}', [AuthController::class, 'updateUser']);
    Route::put('/api/user/{user}/changePassword', [AuthController::class, 'changePassword']);
    Route::delete('/api/user/{user}', [AuthController::class, 'delete']);
    Route::post('/api/users/banned/{id}', [AuthController::class, 'ban']);
});