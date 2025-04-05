<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Entity extends Model
{
  use HasFactory;

  protected $appends = ['thumb_url'];

  public function getThumbUrlAttribute(): string
  {
    return Storage::url('public/images/entity_thumbs' . "/{$this->thumb}");
  }
}
