<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Users
        $testUser = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'isAdmin' => false,
        ]);

        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'isAdmin' => true,
        ]);

        $customerUser = User::create([
            'name' => 'John Customer',
            'email' => 'customer@example.com',
            'password' => Hash::make('password'),
            'isAdmin' => false,
        ]);

        // Create Categories
        $categories = [
            [
                'category' => 'Electronics',
                'visibility' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category' => 'Clothing & Fashion',
                'visibility' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category' => 'Books & Media',
                'visibility' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category' => 'Home & Kitchen',
                'visibility' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category' => 'Sports & Outdoors',
                'visibility' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category' => 'Beauty & Health',
                'visibility' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'category' => 'Toys & Games',
                'visibility' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::create($categoryData);
        }

        // Create Products
        $products = [
            // Electronics
            [
                'name' => 'iPhone 15 Pro',
                'description' => 'The latest iPhone with titanium design, A17 Pro chip, and advanced camera system. Perfect for professionals and tech enthusiasts.',
                'price' => 999.99,
                'rating' => 4.8,
                'stock' => 45,
                'category_id' => 1,
                'visibility' => true,
                'image' => null
            ],
            [
                'name' => 'MacBook Air M2',
                'description' => 'Incredibly thin and light laptop with M2 chip, 13.6-inch Liquid Retina display, and all-day battery life.',
                'price' => 1199.99,
                'rating' => 4.9,
                'stock' => 25,
                'category_id' => 1,
                'visibility' => true,
                'image' => null
            ],
            [
                'name' => 'Samsung 4K Smart TV',
                'description' => '55-inch 4K UHD Smart TV with HDR, built-in streaming apps, and voice control.',
                'price' => 649.99,
                'rating' => 4.6,
                'stock' => 20,
                'category_id' => 1,
                'visibility' => true,
                'image' => null
            ],
            [
                'name' => 'AirPods Pro',
                'description' => 'Active noise cancellation, spatial audio, and customizable fit for the ultimate listening experience.',
                'price' => 249.99,
                'rating' => 4.7,
                'stock' => 80,
                'category_id' => 1,
                'visibility' => true,
                'image' => null
            ],
            
            // Clothing & Fashion
            [
                'name' => 'Premium Cotton T-Shirt',
                'description' => 'Soft, breathable 100% organic cotton t-shirt available in multiple colors. Perfect for casual wear.',
                'price' => 29.99,
                'rating' => 4.4,
                'stock' => 150,
                'category_id' => 2,
                'visibility' => true,
                'image' => null
            ],
            [
                'name' => 'Designer Jeans',
                'description' => 'Premium denim jeans with perfect fit and modern styling. Made from sustainable materials.',
                'price' => 89.99,
                'rating' => 4.5,
                'stock' => 75,
                'category_id' => 2,
                'visibility' => true,
                'image' => null
            ],
            [
                'name' => 'Leather Jacket',
                'description' => 'Genuine leather jacket with classic design. Perfect for any season and occasion.',
                'price' => 199.99,
                'rating' => 4.6,
                'stock' => 30,
                'category_id' => 2,
                'visibility' => true,
                'image' => null
            ],
            [
                'name' => 'Running Sneakers',
                'description' => 'High-performance running shoes with advanced cushioning and breathable mesh upper.',
                'price' => 129.99,
                'rating' => 4.7,
                'stock' => 60,
                'category_id' => 2,
                'visibility' => true,
                'image' => null
            ],
            
            // Books & Media
            [
                'name' => 'The Complete Programming Guide',
                'description' => 'Comprehensive guide to modern programming languages and best practices. Perfect for beginners and experts.',
                'price' => 49.99,
                'rating' => 4.8,
                'stock' => 40,
                'category_id' => 3,
                'visibility' => true,
                'image' => null
            ],
            [
                'name' => 'Bestselling Novel',
                'description' => 'Award-winning fiction novel that has captivated readers worldwide. A must-read for book lovers.',
                'price' => 16.99,
                'rating' => 4.5,
                'stock' => 100,
                'category_id' => 3,
                'visibility' => true,
                'image' => null
            ],
            
            // Home & Kitchen
            [
                'name' => 'Smart Coffee Maker',
                'description' => 'Wi-Fi enabled coffee maker with app control, programmable brewing, and built-in grinder.',
                'price' => 299.99,
                'rating' => 4.6,
                'stock' => 25,
                'category_id' => 4,
                'visibility' => true,
                'image' => null
            ],
            [
                'name' => 'Modern Dining Table',
                'description' => 'Elegant wooden dining table for 6 people. Made from sustainable oak wood with modern design.',
                'price' => 599.99,
                'rating' => 4.7,
                'stock' => 15,
                'category_id' => 4,
                'visibility' => true,
                'image' => null
            ],
            [
                'name' => 'Kitchen Knife Set',
                'description' => 'Professional-grade stainless steel knife set with wooden block. Essential for any kitchen.',
                'price' => 149.99,
                'rating' => 4.8,
                'stock' => 35,
                'category_id' => 4,
                'visibility' => true,
                'image' => null
            ],
            
            // Sports & Outdoors
            [
                'name' => 'Yoga Mat Premium',
                'description' => 'Non-slip, eco-friendly yoga mat with excellent grip and cushioning. Perfect for all yoga styles.',
                'price' => 79.99,
                'rating' => 4.6,
                'stock' => 50,
                'category_id' => 5,
                'visibility' => true,
                'image' => null
            ],
            [
                'name' => 'Camping Tent 4-Person',
                'description' => 'Waterproof 4-person camping tent with easy setup and ventilation system.',
                'price' => 189.99,
                'rating' => 4.5,
                'stock' => 20,
                'category_id' => 5,
                'visibility' => true,
                'image' => null
            ],
            
            // Beauty & Health
            [
                'name' => 'Skincare Set',
                'description' => 'Complete skincare routine with cleanser, toner, serum, and moisturizer. Suitable for all skin types.',
                'price' => 89.99,
                'rating' => 4.7,
                'stock' => 45,
                'category_id' => 6,
                'visibility' => true,
                'image' => null
            ],
            [
                'name' => 'Electric Toothbrush',
                'description' => 'Smart electric toothbrush with multiple cleaning modes and long battery life.',
                'price' => 99.99,
                'rating' => 4.6,
                'stock' => 30,
                'category_id' => 6,
                'visibility' => true,
                'image' => null
            ],
            
            // Toys & Games
            [
                'name' => 'Board Game Collection',
                'description' => 'Classic board game collection perfect for family game nights and gatherings.',
                'price' => 59.99,
                'rating' => 4.4,
                'stock' => 25,
                'category_id' => 7,
                'visibility' => true,
                'image' => null
            ],
            [
                'name' => 'LEGO Architecture Set',
                'description' => 'Detailed LEGO set featuring famous architectural landmarks. Great for adults and kids.',
                'price' => 119.99,
                'rating' => 4.8,
                'stock' => 40,
                'category_id' => 7,
                'visibility' => true,
                'image' => null
            ],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }

        // Create Sample Orders
        $order1 = Order::create([
            'user_id' => $testUser->id,
            'total_amount' => 279.98,
            'status' => 'delivered',
            'order_number' => 'ORD-' . strtoupper(uniqid()),
            'created_at' => now()->subDays(5),
            'updated_at' => now()->subDays(5)
        ]);

        // Order items for first order
        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => 9, // AirPods Pro
            'quantity' => 1,
            'unit_price' => 249.99,
            'total_price' => 249.99
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => 5, // Premium Cotton T-Shirt
            'quantity' => 1,
            'unit_price' => 29.99,
            'total_price' => 29.99
        ]);

        $order2 = Order::create([
            'user_id' => $customerUser->id,
            'total_amount' => 1499.98,
            'status' => 'processing',
            'order_number' => 'ORD-' . strtoupper(uniqid()),
            'created_at' => now()->subDays(2),
            'updated_at' => now()->subDays(2)
        ]);

        // Order items for second order
        OrderItem::create([
            'order_id' => $order2->id,
            'product_id' => 2, // MacBook Air M2
            'quantity' => 1,
            'unit_price' => 1199.99,
            'total_price' => 1199.99
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'product_id' => 11, // Smart Coffee Maker
            'quantity' => 1,
            'unit_price' => 299.99,
            'total_price' => 299.99
        ]);

        $order3 = Order::create([
            'user_id' => $testUser->id,
            'total_amount' => 169.98,
            'status' => 'pending',
            'order_number' => 'ORD-' . strtoupper(uniqid()),
            'created_at' => now()->subHours(6),
            'updated_at' => now()->subHours(6)
        ]);

        // Order items for third order
        OrderItem::create([
            'order_id' => $order3->id,
            'product_id' => 14, // Yoga Mat Premium
            'quantity' => 2,
            'unit_price' => 79.99,
            'total_price' => 159.98
        ]);

        OrderItem::create([
            'order_id' => $order3->id,
            'product_id' => 10, // Bestselling Novel
            'quantity' => 1,
            'unit_price' => 16.99,
            'total_price' => 16.99
        ]);

        echo "Database seeded successfully!\n";
        echo "Users created: 3 (including admin)\n";
        echo "Categories created: 7\n";
        echo "Products created: " . count($products) . "\n";
        echo "Sample orders created: 3\n";
        echo "\nLogin credentials:\n";
        echo "Admin: admin@example.com / password\n";
        echo "Test User: test@example.com / password\n";
        echo "Customer: customer@example.com / password\n";
    }
}
