<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Order extends Model
{
    protected $fillable = [
        'order_number', 'user_id', 'name', 'phone', 'email', 'address', 'status', 'total_amount'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'order_items')
                    ->withPivot('quantity', 'unit_price', 'total_price')
                    ->withTimestamps();
    }

    public function calculateTotal()
    {
        $this->total_amount = $this->items->sum('total_price');
        $this->save();
        return $this->total_amount;
    }

    public static function generateOrderNumber()
    {
        return 'ORD-' . strtoupper(uniqid());
    }

//     public function menuItems(){
//     return $this->items()->whereNotNull('menu_id');
// }

// // Optional: get only product items in this order
// public function productItems()
// {
//     return $this->items()->whereNotNull('product_id');
// }
}
