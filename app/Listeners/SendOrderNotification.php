<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use Illuminate\Support\Facades\Log;

class SendOrderNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(OrderPlaced $event): void
    {
        $order = $event->order;
        
        Log::info('Order placed notification', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'customer_email' => $order->email,
            'total_amount' => $order->total_amount
        ]);
    }
}
