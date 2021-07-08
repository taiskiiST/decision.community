<?php

namespace App\Policies;

use App\Models\Item;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

/**
 * Class ItemPolicy
 *
 * @package App\Policies
 */
class ItemPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Item  $item
     * @return mixed
     */
    public function view(User $user, Item $item): bool
    {
        return true;
    }

    /**
     * Determine whether the user can download the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Item  $item
     * @return mixed
     */
    public function download(User $user, Item $item): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function create(User $user): bool
    {
        return $user->canManageItems();
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Item  $item
     * @return mixed
     */
    public function update(User $user, Item $item): bool
    {
        return $this->canUserManageItem($user, $item);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Item  $item
     * @return mixed
     */
    public function delete(User $user, Item $item): bool
    {
        return $this->canUserManageItem($user, $item);
    }

    /**
     * Determine whether the user can email the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Item  $item
     * @return mixed
     */
    public function email(User $user, Item $item): bool
    {
        return true;
    }

    /**
     * @param \App\Models\User $user
     * @param \App\Models\Item $item
     *
     * @return bool
     */
    protected function canUserManageItem(User $user, Item $item): bool
    {
        return $user->canManageItems();
    }
}
