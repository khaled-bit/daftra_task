<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'password' => static::$password ??= Hash::make('password'),
            'image' => null,
            'isAdmin' => false,
            'banned' => false,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model should be an admin.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'isAdmin' => true,
        ]);
    }

    /**
     * Indicate that the model should be banned.
     */
    public function banned(): static
    {
        return $this->state(fn (array $attributes) => [
            'banned' => true,
        ]);
    }
}
