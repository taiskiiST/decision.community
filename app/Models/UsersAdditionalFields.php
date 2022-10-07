<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsersAdditionalFields extends Model
{
    use HasFactory;
    protected $fillable = [
        'ownership',
        'job'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
