<?php

namespace App\Models;

use App\Services\GateApi;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Symfony\Component\HttpFoundation\Response as SymphonyResponse;

/**
 * Class User
 *
 * @property mixed id
 * @property int company_id
 * @property string permissions
 * @property mixed name
 * @property mixed email
 * @package App\Models
 */
class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'gate_user_id',
        'permissions',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * @param \Illuminate\Database\Eloquent\Builder $query
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeThatCanAccessStatistics(Builder $query): Builder
    {
        return $query
            ->where('permissions', 'LIKE', '%' . Permission::MANAGE_ITEMS. '%')
            ->orWhere('permissions', 'LIKE', '%' . Permission::ADMIN. '%')
            ->orWhere('permissions', 'LIKE', '%' . Permission::VIEW_EMPLOYEE_ITEMS. '%');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * @return bool
     */
    public function isAdmin(): bool
    {
        return in_array(Permission::ADMIN, explode(',', $this->permissions));
    }

    /**
     * @return bool
     */
    public function canManageItems(): bool
    {
        return $this->isAdmin() || in_array(Permission::MANAGE_ITEMS, explode(',', $this->permissions));
    }

    /**
     * @return bool
     */
    public function canViewEmployeeItems(): bool
    {
        return $this->isAdmin() || in_array(Permission::VIEW_EMPLOYEE_ITEMS, explode(',', $this->permissions));
    }

    /**
     * @return bool
     */
    public function canViewStatistics(): bool
    {
        return $this->isAdmin() || $this->canManageItems() || $this->canViewEmployeeItems();
    }

    /**
     * @param int|null $parentId
     * @param bool|null $includeParent
     *
     * @return mixed
     */
    public function availableItems(?int $parentId = -1, ?bool $includeParent = false)
    {
        return $this->company->items()
                             ->when(is_null($parentId), function (Builder $builder) {
                                 return $builder->firstLevel();
                             })
                             ->when($parentId >= 0, function (Builder $builder) use ($includeParent, $parentId) {
                                 $builder->where(function (Builder $builder) use ($parentId, $includeParent) {
                                     $builder->where('parent_id', $parentId);

                                     if ($includeParent) {
                                         $builder->orWhere('id', $parentId);
                                     }
                                 });
                             })
                             ->when(! $this->canViewEmployeeItems(), function (Builder $builder) {
                                 return $builder->excludeEmployeeOnlyItems();
                             });
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function favorites(): BelongsToMany
    {
        return $this->belongsToMany(Item::class, 'users_favorites')->withTimestamps();
    }

    /**
     * @param \App\Models\Item $item
     */
    public function addItemToFavorites(Item $item)
    {
        if ($item->isCategory()) {
            return;
        }

        if ($this->cannot('view', $item)) {
            return;
        }

        $this->favorites()->attach($item);
    }

    /**
     * @param \App\Models\Item $item
     */
    public function removeItemFromFavorites(Item $item)
    {
        if ($item->isCategory()) {
            return;
        }

        if ($this->cannot('view', $item)) {
            return;
        }

        $this->favorites()->detach($item);
    }

    /**
     * @param \App\Models\Item $item
     */
    public function toggleFavorite(Item $item)
    {
        if ($item->isCategory()) {
            return;
        }

        if ($this->cannot('view', $item)) {
            return;
        }

        $this->favorites()->toggle($item);
    }

    /**
     * @return array
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public function getEmployeeGrowersGateIds(): array
    {
        $out = [];

        $strippedToken = session()->get('stripped_token');
        if (! $strippedToken) {
            auth()->logout();
            session()->invalidate();
            abort(SymphonyResponse::HTTP_UNAUTHORIZED);

            return $out;
        }

        $fromSession = session()->get('employee_growers_ids');
        if (! empty($fromSession)) {
            return $fromSession;
        }

        $gateApi = app()->make(GateApi::class, ['strippedToken' => $strippedToken]);

        $growersCollection = $gateApi->employeeGrowers();

        $growersIds = $growersCollection->pluck('id')->toArray();

        session()->put('employee_growers_ids', $growersIds);

        return $growersIds;
    }

    /**
     * @return array
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public function getManagerSalespeopleGateIds(): array
    {
        $out = [];

        $strippedToken = session()->get('stripped_token');
        if (! $strippedToken) {
            auth()->logout();
            session()->invalidate();
            abort(SymphonyResponse::HTTP_UNAUTHORIZED);

            return $out;
        }

        $fromSession = session()->get('manager_salespeople_ids');
        if (! empty($fromSession)) {
            return $fromSession;
        }

        $gateApi = app()->make(GateApi::class, ['strippedToken' => $strippedToken]);

        $salespeopleCollection = $gateApi->managerSalespeople();

        $salespeopleIds = $salespeopleCollection->pluck('id')->toArray();

        session()->put('manager_salespeople_ids', $salespeopleIds);

        return $salespeopleIds;
    }
}
