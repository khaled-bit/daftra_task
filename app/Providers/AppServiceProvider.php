<?php

namespace App\Providers;

use App\Events\OrderPlaced;
use App\Listeners\SendOrderNotification;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
        Vite::prefetch(concurrency: 3);
         if (env('APP_ENV') === 'production') {
        URL::forceScheme('https');
    }

    Event::listen(
        OrderPlaced::class,
        [SendOrderNotification::class, 'handle']
    );
    }
}
