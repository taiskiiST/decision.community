<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

/**
 * @property mixed $uri
 */
class Company extends Model
{
  protected $fillable = ['uri', 'title'];

  use HasFactory;

  public static function existingURIs(): Collection
  {
    return Company::select('uri')->get()->pluck('uri');
  }

  public function users(): BelongsToMany
  {
    return $this->belongsToMany(User::class);
  }

  public function polls(): HasMany
  {
    return $this->hasMany(Poll::class);
  }

  public function questions(): HasMany
  {
    return $this->hasMany(Question::class);
  }

  public function getPublicQuestions(): Collection
  {
    return $this->questions()->public()->get();
  }

  public static function current(): ?self
  {
    if (!($company = session('current_company'))) {
      return null;
    }

    return $company;
  }

  public static function getCompanyBySubDomain(): ?Company
  {
    return null;
    $subdomain = Arr::first(explode('.', request()->getHost()));

    return Company::where('uri', $subdomain)->first();
  }

  public function mainView(): string
  {
    if (!view()->exists("main/$this->uri")) {
      return 'main';
    }

    return "main/$this->uri";
  }

  public function potentialVotersNumber(): int
  {
    return $this->users()
      ->where('permissions', 'LIKE', '%' . Permission::VOTE . '%')
      ->count();
  }

  public function potentialWeightVotersNumber(int $typeOfRight)
  {
    $weights = 0;
    $users_can_vote = $this->users()
      ->where('permissions', 'LIKE', '%' . Permission::VOTE . '%')
      ->get();
    foreach ($users_can_vote as $user) {
      $rights = $user->rights()->get();
      foreach ($rights as $right) {
        if ($right->type_of_right == $typeOfRight) {
          $weights += $right->weight * $right->number_of_share;
        }
      }
    }
    return $weights;
  }

  public function potentialVotersNumberGovernance(): int
  {
    return $this->users()
      ->where('permissions', 'LIKE', '%' . Permission::VOTE . '%')
      ->where('permissions', 'LIKE', '%' . Permission::GOVERNANCE . '%')
      ->count();
  }

  public function potentialWeightVotersNumberGovernance(int $typeOfRight)
  {
    $weights = 0;
    $users_governance_can_vote = $this->users()
      ->where('permissions', 'LIKE', '%' . Permission::VOTE . '%')
      ->where('permissions', 'LIKE', '%' . Permission::GOVERNANCE . '%')
      ->get();
    foreach ($users_governance_can_vote as $user) {
      $rights = $user->rights()->get();
      foreach ($rights as $right) {
        if ($right->type_of_right == $typeOfRight) {
          $weights += $right->weight * $right->number_of_share;
        }
      }
    }
    return $weights;
  }
}
