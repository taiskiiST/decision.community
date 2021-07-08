<?php

namespace App\Models;

/**
 * Class Permission
 *
 * @package App\Models
 */
class Permission
{
    const ACCESS              = 'information-app.access';
    const ADMIN               = 'information-app.admin';
    const MANAGE_ITEMS        = 'information-app.manage-items';
    const VIEW_EMPLOYEE_ITEMS = 'information-app.view-employee-items';

    const AVAILABLE_PERMISSIONS = [
        self::ACCESS,
        self::MANAGE_ITEMS,
        self::VIEW_EMPLOYEE_ITEMS,
    ];

    /**
     * @param User $user
     * @param string $permission
     *
     * @return User
     */
    public static function withdrawPermission(User $user, string $permission): User
    {
        if (! in_array($permission, self::AVAILABLE_PERMISSIONS)) {
            logger(__METHOD__ . " - unknown permission {$permission}");

            return $user;
        }

        $currentPermissions = explode(',', $user->permissions);

        $user->permissions = implode(',' ,array_filter($currentPermissions, function ($p) use ($permission) {
            return $p !== $permission;
        }));

        $user->save();

        return $user;
    }

    /**
     * @param User $user
     * @param string $permission
     *
     * @return \App\Models\User
     */
    public static function assignPermission(User $user, string $permission): User
    {
        if (! in_array($permission, self::AVAILABLE_PERMISSIONS)) {
            logger(__METHOD__ . " - unknown permission {$permission}");

            return $user;
        }

        $user->permissions = $user->permissions . ',' . $permission;

        $user->save();

        return $user;
    }
}
