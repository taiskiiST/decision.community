<?php

namespace App\Policies;

use App\Models\Poll;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

/**
 * Class PollPolicy
 *
 * @package App\Policies
 */
class PollPolicy
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
     * @param  \App\Models\Poll  $poll
     * @return mixed
     */
    public function view(User $user, Poll $poll): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Poll  $poll
     * @return mixed
     */
    public function display(User $user, Poll $poll): bool
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
        return $user->canVote();
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Poll  $poll
     * @return mixed
     */
    public function update(User $user, Poll $poll): bool
    {
        return $user->canVote();
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Poll  $poll
     * @return mixed
     */
    public function delete(User $user, Poll $poll): bool
    {
        return $user->canVote();
    }
}
