<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public static function current(): ?self
    {
        if (!($company = session('current_company'))) {
            return null;
        }

        return $company;
    }

    public function potentialVotersNumber(): int
    {
        return $this->users()->where('permissions', 'LIKE', '%' . Permission::VOTE . '%')->count();
    }

    public function potentialVotersNumberGovernance(): int
    {
        return $this->users()->where('permissions', 'LIKE', '%' . Permission::VOTE . '%')
            ->where('permissions', 'LIKE', '%' . Permission::GOVERNANCE . '%')
            ->count();
    }
}
