<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'category', 'visibility'
    ];

    protected $casts = [
        'visibility' => 'boolean'
    ];

    public function menus(): HasMany
    {
        return $this->hasMany(Menu::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function scopeVisible($query)
    {
        return $query->where('visibility', true);
    }
}
