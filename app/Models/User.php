<?php

namespace App\Models;

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
     * @param int|null $parentId
     * @param bool|null $includeParent
     *
     * @return mixed
     */
    public function availableItems(?int $parentId = -1, ?bool $includeParent = false)
    {
        return Item
            ::when(is_null($parentId), function (Builder $builder) {
                return $builder->firstLevel();
            })
            ->when($parentId >= 0, function (Builder $builder) use ($includeParent, $parentId) {
                $builder->where(function (Builder $builder) use ($parentId, $includeParent) {
                    $builder->where('parent_id', $parentId);

                    if ($includeParent) {
                        $builder->orWhere('id', $parentId);
                    }
                });
            });
    }
}
