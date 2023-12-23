<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChildrenInformation extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = 'children_information';

    public function parent(): BelongsTo
    {
        return $this->belongsTo(ParentInformation::class,'parents_id');
    }
}
