<?php

namespace App\Exports;

use App\Models\ItemVisit;
use App\Models\User;
use App\Services\UserGateInfoFetcher;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

/**
 * Class ItemVisitsExport
 *
 * @package App\Exports
 */
class ItemVisitsExport implements FromQuery, WithHeadings, ShouldAutoSize
{
    public $user;

    public $search = '';

    public $sortField;

    public $sortAsc = true;

    public $startDate;

    public $endDate;

    public $useInternalGateApi;

    /**
     * ItemVisitsExport constructor.
     *
     * @param \App\Models\User $user
     * @param string $search
     * @param string $startDate
     * @param string $endDate
     * @param string|null $sortField
     * @param bool $sortAsc
     * @param bool $useInternalGateApi
     */
    public function __construct(
        User $user,
        string $search = '',
        string $startDate = '',
        string $endDate = '',
        string $sortField = null,
        bool $sortAsc = true,
        bool $useInternalGateApi = false
    ) {
        $this->user = $user;
        $this->search = $search;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->sortField = $sortField;
        $this->sortAsc = $sortAsc;
        $this->useInternalGateApi = $useInternalGateApi;
    }

    /**
     * @return Builder|void
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public function query(): Builder
    {
        return ItemVisit::queryWithFilters(
            new UserGateInfoFetcher($this->user, $this->useInternalGateApi),
            $this->search,
            $this->startDate,
            $this->endDate,
            $this->sortField ?: 'users.email',
            $this->sortAsc
        );
    }

    /**
     * @return string[]
     */
    public function headings(): array
    {
        return [
            'User Name',
            'User Email',
            'Item Name',
            'Count',
        ];
    }
}
