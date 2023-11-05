<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
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
        'phone',
        'address',
        'position_id',
        'email',
        'password',
        'permissions',
        'additional_id',
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
    public function isSuperAdmin(): bool
    {

        return in_array(Permission::SUPER_ADMIN, explode(',', $this->permissions));
    }

    /**
     * @return bool
     */
    public function canManageItems(): bool
    {
        return $this->isAdmin() || in_array(Permission::MANAGE_ITEMS, explode(',', $this->permissions));
    }

    public function isManageItems(): bool
    {
        return in_array(Permission::MANAGE_ITEMS, explode(',', $this->permissions));
    }

    public function isAccess(): bool
    {
        return in_array(Permission::ACCESS, explode(',', $this->permissions));
    }

    /**
     * @return bool
     */
    public function isGovernance(): bool
    {
        return in_array(Permission::GOVERNANCE, explode(',', $this->permissions));
    }

    public function canGovernance(): bool
    {
        return $this->isAdmin() || in_array(Permission::GOVERNANCE, explode(',', $this->permissions));
    }

    /**
     * @return bool
     */
    public function canVote(): bool
    {
        return $this->isAdmin() || in_array(Permission::VOTE, explode(',', $this->permissions));
    }

    public function isVote(): bool
    {
        return in_array(Permission::VOTE, explode(',', $this->permissions));
    }

    public function isHavePermission($permission): bool
    {
        return in_array($permission, explode(',', $this->permissions));
    }

    public function isHaveCompany($company): bool
    {
        foreach ($this->companies()->get() as $cmp) {
            if ($cmp->id == $company->id) {
                return true;
            }
        }

        return false;
    }

    public function position()
    {
        if (isset($this->hasOne(Position::class, 'id', 'position_id')->get()[0])) {
            return $this->hasOne(Position::class, 'id', 'position_id')->get()[0]->position;
        } else {
            return '';
        }

    }

    public function ownership()
    {
        if (isset($this->hasOne(UsersAdditionalFields::class, 'id', 'additional_id')->get()[0])) {
            return $this->hasOne(UsersAdditionalFields::class, 'id', 'additional_id')->get()[0]->ownership;
        } else {
            return '';
        }

    }

    public function job()
    {
        if (isset($this->hasOne(UsersAdditionalFields::class, 'id', 'additional_id')->get()[0])) {
            return $this->hasOne(UsersAdditionalFields::class, 'id', 'additional_id')->get()[0]->job;
        } else {
            return '';
        }

    }

    public function positions()
    {
        return Position::all();
    }

    public function companies()
    {
        return $this->belongsToMany(Company::class);
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

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    public function vote(Question $question, Answer $answer): Model
    {
        $out = null;

        DB::transaction(function () use ($question, $answer, &$out) {
            $question->poll->update([
                'potential_voters_number' => $question->poll->isGovernanceMeeting() ? $question->poll->company->potentialVotersNumberGovernance() : $question->poll->company->potentialVotersNumber(),
            ]);

            $out = $this->votes()->updateOrCreate([
                'question_id' => $question->id,
                'user_id'     => $this->id,
            ], [
                'answer_id'   => $answer->id,
                'question_id' => $question->id,
                'user_id'     => $this->id,
            ]);
        });

        return $out;
    }

    public function votedInPoll(Poll $poll): bool
    {
        return Vote::where('user_id', $this->id)
                   ->whereIn('question_id', $poll->questions->pluck('id'))
                   ->count() !== 0;
    }

    public function id()
    {
        return $this->id();
    }
}
