<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 8, 2);
            $table->decimal('rating', 3, 1);
            $table->integer('stock');
            $table->integer('promotion')->nullable();  
            $table->date('startDate')->nullable();  
            $table->date('endDate')->nullable();   
            $table->boolean('visibility')->nullable();  
            $table->string('image')->nullable();
            $table->timestamps();
            
            // Add indexes for better performance
            $table->index(['category_id']);
            $table->index(['name']);
            $table->index(['price']);
            $table->index(['visibility']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
