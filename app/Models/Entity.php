<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use App\Models\Company;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Entity extends Model
{
  use HasFactory;

  protected $guarded = [];

  protected $appends = ['thumb_url'];

  public function companies(): BelongsToMany
  {
    return $this->belongsToMany(Company::class)->withTimestamps();
  }

  public function belongsToCompanyWithId(int $companyId): bool
  {
    return $this->companies->contains(function (Company $company) use (
      $companyId
    ) {
      return $company->id === $companyId;
    });
  }

  public function belongsToMultipleCompanies(): bool
  {
    return $this->companies->count() > 1;
  }

  public function getThumbUrlAttribute(): string
  {
    return Storage::url('public/images/entity_thumbs' . "/{$this->thumb}");
  }

  public function scopeFirstLevel(Builder $builder): Builder
  {
    return $builder->where('parent_id', null);
  }

  public function getDirectChildrenBelongingToCompany(Company $company): Collection
  {
    return $company->entities()->where('parent_id', $this->id)->get();
  }

  public function thumbPath(): string
  {
    return "public/images/entity_thumbs/{$this->thumb}";
  }

  public function children(): Collection
  {
    return Entity::where('parent_id', $this->id)->get();
  }

  public function deleteRecursivelyWithFiles(array $deletedIds = []): array
  {
    $children = $this->children();

    if ($children->isNotEmpty()) {
      $children->each(function (Entity $child) use (&$deletedIds) {
        $deletedIds = array_merge($child->deleteRecursivelyWithFiles($deletedIds));
      });
    }

    // Detach all companies from entity
    $this->companies()->detach();

    $thumbPath = $this->thumbPath();
    if (Storage::exists($thumbPath)) {
      Storage::delete($thumbPath);
    }

    $success = $this->delete();
    if ($success) {
      $deletedIds[] = $this->id;
    }

    return $deletedIds;
  }
}
