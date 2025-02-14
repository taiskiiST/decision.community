<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeOfRight extends Model
{
    use HasFactory;
    const UPON_OWNERSHIP = 1;
    const BY_AREA = 2;
    const MANDATE = 3;

    protected $table = 'types_of_rights';
}
