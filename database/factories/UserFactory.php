<?php

namespace Database\Factories;

use App\Models\Permission;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'email_verified_at' => now(),
            'permissions' => Permission::ACCESS,
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * @return \Database\Factories\UserFactory
     */
    public function withManageItemsPermission(): UserFactory
    {
        return $this->state(function (array $attributes) {
            return [
                'permissions' => ! empty($attributes['permissions'])
                    ? ($attributes['permissions'] . ',' . Permission::MANAGE_ITEMS)
                    : Permission::MANAGE_ITEMS,
            ];
        });
    }

    /**
     * @return \Database\Factories\UserFactory
     */
    public function withAdminPermission(): UserFactory
    {
        return $this->state(function (array $attributes) {
            return [
                'permissions' => ! empty($attributes['permissions'])
                    ? ($attributes['permissions'] . ',' . Permission::ADMIN)
                    : Permission::ADMIN,
            ];
        });
    }
}
