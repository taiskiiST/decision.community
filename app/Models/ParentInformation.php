<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ParentInformation extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'parents_information';

    public function children(): HasMany
    {
        return $this->hasMany(ChildrenInformation::class, 'parents_id');
    }

}
