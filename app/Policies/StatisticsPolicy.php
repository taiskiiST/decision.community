<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

/**
 * Class StatisticsPolicy
 *
 * @package App\Policies
 */
class StatisticsPolicy
{
    use HandlesAuthorization;

    /**
     * @param \App\Models\User $user
     *
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return $user->canViewStatistics();
    }

    /**
     * Determine whether the user can download statistics.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function download(User $user): bool
    {
        return $user->canViewStatistics();
    }
}
