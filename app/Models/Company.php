<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class Company
 *
 * @property mixed id
 * @package App\Models
 */
class Company extends Model
{
    use HasFactory;

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }

    /**
     * @return string
     */
    public function pdfDocumentsPath(): string
    {
        return "companies-data/{$this->id}/pdfs";
    }

    /**
     * @return string
     */
    public function itemsThumbsPath(): string
    {
        return "public/images/companies/{$this->id}/items_thumbs";
    }
}
