<?php

namespace App\Policies;

use App\Models\Entity;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EntityPolicy
{
  use HandlesAuthorization;

  /**
   * Determine whether the user can view any models.
   *
   * @param  \App\Models\User  $user
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function viewAny(User $user)
  {
    //
  }

  /**
   * Determine whether the user can view the model.
   *
   * @param  \App\Models\User  $user
   * @param  \App\Models\Entity  $entity
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function view(User $user, Entity $entity)
  {
    return $this->canUserManageEntity($user, $entity);
  }

  /**
   * Determine whether the user can create models.
   *
   * @param  \App\Models\User  $user
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function create(User $user)
  {
    return $user->canManageEntities();
  }

  /**
   * Determine whether the user can update the model.
   *
   * @param  \App\Models\User  $user
   * @param  \App\Models\Entity  $entity
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function update(User $user, Entity $entity)
  {
    return $this->canUserManageEntity($user, $entity);
  }

  /**
   * Determine whether the user can delete the model.
   *
   * @param  \App\Models\User  $user
   * @param  \App\Models\Entity  $entity
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function delete(User $user, Entity $entity)
  {
    return $this->canUserManageEntity($user, $entity);
  }


  /**
   * Determine whether the user can detach the model.
   *
   * @param  \App\Models\User  $user
   * @param  \App\Models\Entity  $entity
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function detach(User $user, Entity $entity)
  {
    // TODO: add real logic
    return $this->canUserManageEntity($user, $entity);
  }

  /**
   * Determine whether the user can detach the user from the model.
   *
   * @param  \App\Models\User  $user
   * @param  \App\Models\Entity  $entity
   * @param  \App\Models\User $userToAttach
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function attachUser(User $user, Entity $entity, User $userToAttach)
  {
    // TODO: add real logic
    return $this->canUserManageEntity($user, $entity);
  }

  /**
   * Determine whether the user can detach the user from the model.
   *
   * @param  \App\Models\User  $user
   * @param  \App\Models\Entity  $entity
   * @param  \App\Models\User $userToDetach
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function detachUser(User $user, Entity $entity, User $userToDetach)
  {
    // TODO: add real logic
    return $this->canUserManageEntity($user, $entity);
  }

  /**
   * Determine whether the user can restore the model.
   *
   * @param  \App\Models\User  $user
   * @param  \App\Models\Entity  $entity
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function restore(User $user, Entity $entity)
  {
    //
  }

  /**
   * Determine whether the user can permanently delete the model.
   *
   * @param  \App\Models\User  $user
   * @param  \App\Models\Entity  $entity
   * @return \Illuminate\Auth\Access\Response|bool
   */
  public function forceDelete(User $user, Entity $entity)
  {
    //
  }

  protected function canUserManageEntity(User $user, Entity $entity): bool
  {
    return $user->canManageEntities();
  }
}
