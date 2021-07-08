<?php

namespace App\Http\Livewire;

use App\Models\ItemVisit;
use App\Services\UserGateInfoFetcher;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Collection;
use Livewire\Component;
use Livewire\WithPagination;

/**
 * Class StatisticsTable
 *
 * @package App\Http\Livewire
 */
class StatisticsTable extends Component
{
    use AuthorizesRequests;

    use WithPagination;

    public $search = '';

    public $sortField;

    public $sortAsc = true;

    public $startDate;

    public $endDate;

    protected $queryString = ['search', 'sortAsc', 'sortField', 'startDate', 'endDate'];

    protected $listeners = ['startDateSelected', 'endDateSelected'];

    /**
     *
     */
    public function mount()
    {
        $this->startDate = now()->subWeek()->toDateString();

        $this->endDate = now()->toDateString();
    }

    /**
     * @param string $field
     */
    public function sortBy(string $field)
    {
        if ($this->sortField === $field) {
            $this->sortAsc = ! $this->sortAsc;
        } else {
            $this->sortAsc = true;
        }

        $this->sortField = $field;
    }

    /**
     * @param $newStartDate
     */
    public function updatingStartDate($newStartDate)
    {
        if (strtotime($newStartDate) === false) {
            return;
        }
    }

    /**
     * @param $newEndDate
     */
    public function updatingEndDate($newEndDate)
    {
        if (strtotime($newEndDate) === false) {
            return;
        }
    }

    /**
     * @param $newDate
     */
    public function startDateSelected($newDate)
    {
        if (strtotime($newDate) === false) {
            return;
        }

        $this->startDate = $newDate;
    }

    /**
     * @param $newDate
     */
    public function endDateSelected($newDate)
    {
        if (strtotime($newDate) === false) {
            return;
        }

        $this->endDate = $newDate;
    }

    /**
     *
     */
    public function updatingSearch()
    {
        $this->resetPage();
    }

    /**
     * We have to use this dynamic property instead of Livewire's default download
     * functionality because it doesn't work in Webkit browsers as of January 13, 2021.
     *
     * @return string
     */
    public function getDownloadUrlProperty()
    {
        if (strtotime($this->startDate) === false) {
            return '#';
        }

        if (strtotime($this->endDate) === false) {
            return '#';
        }

        $query = http_build_query([
            'search' => $this->search ?? '',
            'startDate' => $this->startDate,
            'endDate' => $this->endDate,
            'sortField' => $this->sortField ?? '',
            'sortAsc' => $this->sortAsc,
        ]);

        return route('statistics.download') . "?$query";
    }

    /**
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     * @throws \Illuminate\Auth\Access\AuthorizationException|\Illuminate\Contracts\Container\BindingResolutionException
     */
    public function render()
    {
        $this->authorize('viewAny', ItemVisit::class);

        if (strtotime($this->startDate) === false) {
            return view('livewire.statistics-table', [
                'visits' => new Collection()
            ]);
        }

        if (strtotime($this->endDate) === false) {
            return view('livewire.statistics-table', [
                'visits' => new Collection()
            ]);
        }

        return view('livewire.statistics-table', [
            'visits' => ItemVisit::queryWithFilters(
                new UserGateInfoFetcher(auth()->user()),
                $this->search,
                $this->startDate,
                $this->endDate,
                $this->sortField,
                $this->sortAsc
            )->paginate(10),
        ]);
    }
}
