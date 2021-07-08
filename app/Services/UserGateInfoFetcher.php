<?php

namespace App\Services;

use App\Models\User;

/**
 * Class UserGateInfoFetcher
 *
 * @package App\Services
 */
class UserGateInfoFetcher
{
    /**
     * @var \App\Models\User
     */
    protected $user;

    /**
     * @var bool
     */
    protected $useInternalGateApi;

    /**
     * UserGateInfoFetcher constructor.
     *
     * @param \App\Models\User $user
     * @param bool $useInternalGateApi
     */
    public function __construct(User $user, bool $useInternalGateApi = false)
    {
        $this->user = $user;

        $this->useInternalGateApi = $useInternalGateApi;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * @return array
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public function getEmployeeGrowersGateIds(): array
    {
        if (! $this->useInternalGateApi) {
            return $this->user->getEmployeeGrowersGateIds();
        }

        $gateInternalApi = app()->make(GateInternalApi::class);

        $growersCollection = $gateInternalApi->employeeGrowers($this->user);

        return $growersCollection->pluck('id')->toArray();
    }

    /**
     * @return array
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public function getManagerSalespeopleGateIds(): array
    {
        if (! $this->useInternalGateApi) {
            return $this->user->getManagerSalespeopleGateIds();
        }

        $gateInternalApi = app()->make(GateInternalApi::class);

        $salespeopleCollection = $gateInternalApi->managerSalespeople($this->user);

        return $salespeopleCollection->pluck('id')->toArray();
    }
}
