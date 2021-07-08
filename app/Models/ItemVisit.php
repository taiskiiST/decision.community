<?php

namespace App\Models;

use App\Services\UserGateInfoFetcher;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Class ItemVisit
 *
 * @package App\Models
 */
class ItemVisit extends Model
{
    use HasFactory;

    protected $guarded = [];

    /**
     * @param \App\Services\UserGateInfoFetcher $userGateInfoFetcher
     * @param string $search
     * @param string $startDate
     * @param string $endDate
     * @param string|null $sortField
     * @param bool $sortAsc
     *
     * @return mixed
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public static function queryWithFilters(
        UserGateInfoFetcher $userGateInfoFetcher,
        string $search = '',
        string $startDate = '',
        string $endDate = '',
        string $sortField = null,
        bool $sortAsc = true
    ) {
        $user = $userGateInfoFetcher->getUser();
        $companyId = $user->company_id;
        $isUserManager = $user->canManageItems();
        $isUserAdmin = $user->isAdmin();

        return ItemVisit
            ::join('users', 'item_visits.user_id', '=', 'users.id')
            ->join('items', 'item_visits.item_id', '=', 'items.id')
            ->select([
                'users.name as userName',
                'users.email as userEmail',
                'items.name as itemName',
                DB::raw('count(*) as count'),
            ])
            ->where('users.company_id', $companyId)
            ->where(function (Builder $query) use ($userGateInfoFetcher, $isUserManager, $isUserAdmin) {
                if ($isUserAdmin) {
                    return;
                }

                $employeeGrowersGateIds = $userGateInfoFetcher->getEmployeeGrowersGateIds();

                $query->whereIn('users.gate_user_id', $employeeGrowersGateIds)
                    ->orWhere(function (Builder $query) use ($userGateInfoFetcher, $isUserManager) {
                        $query->when($isUserManager, function (Builder $query) use ($userGateInfoFetcher) {
                            $managerSalespeopleGateIds = $userGateInfoFetcher->getManagerSalespeopleGateIds();

                            $query->whereIn('users.gate_user_id', $managerSalespeopleGateIds);
                        });
                    });
            })
            ->when(! $isUserAdmin && ! $isUserManager, function (Builder $query) {
                $query->where('users.permissions', 'NOT LIKE', '%' . Permission::VIEW_EMPLOYEE_ITEMS . '%');
            })
            ->when(! $isUserAdmin, function (Builder $builder) {
                $builder->where('users.permissions', 'NOT LIKE', '%' . Permission::MANAGE_ITEMS . '%');
            })
            ->when($search, function (Builder $builder, $search) {
                $builder->where(function ($query) use ($search) {
                    $query->where('users.name', 'like', "%$search%")
                          ->orWhere('users.email', 'like', "%$search%")
                          ->orWhere('items.name', 'like', "%$search%");
                });
            })
            ->when($startDate, function (Builder $query, $startDate) {
                $query->where('item_visits.time', '>=', Carbon::parse($startDate)->startOfDay());
            })
            ->when($endDate, function (Builder $query, $endDate) {
                $query->where('item_visits.time', '<=', Carbon::parse($endDate)->endOfDay());
            })
            ->when($sortField, function (Builder $query, $sortField) use ($sortAsc) {
                $query->orderBy($sortField, $sortAsc ? 'asc' : 'desc');
            })
            ->groupBy([
                'users.name',
                'users.email',
                'items.name',
            ]);
    }
}
