<?php

namespace App\Http\Livewire;

use App\Models\Item;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Collection;
use Livewire\Component;

/**
 * Class ItemsList
 *
 * @package App\Http\Livewire
 */
class ItemsList extends Component
{
    use AuthorizesRequests;

    const SORT_BY_LATEST      = 'By Latest';
    const SORT_ALPHABETICALLY = 'Alphabetically';

    public $search = '';

    public $sortBy = self::SORT_BY_LATEST;

    public $items;

    public $isSortByDropdownOpen = false;

    public $isNewItemDropdownOpen = false;

    public $isManageItemsModalOpen = false;

    public $isYoutubeModalOpen = false;

    public $currentVideoSource = null;

    public $successMessage = '';

    public $itemTypeBeingAdded = '';

    public $currentCategory = null;

    public $parentCategories;

    public $isEmailItemModalOpen = false;

    public $favoriteIdsToShow = null;

    protected $listeners = ['itemCreated', 'manageItemsModalCancelButtonClicked', 'emailItemModalCancelButtonClicked', 'itemEmailed'];

    /**
     * Triggered when the component is mounted.
     *
     * @param null $category
     * @param array $favoriteIdsToShow
     */
    public function mount($category = null, $favoriteIdsToShow = null)
    {
        $this->favoriteIdsToShow = $favoriteIdsToShow;

        $this->currentCategory = $category;

        $this->parentCategories = new Collection();

        $this->fetchItems();

        if (! $this->currentCategory) {
            return;
        }

        $this->parentCategories = $this->currentCategory
            ->getAllParents()
            ->reverse();
    }

    /**
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function render()
    {
        return view('livewire.items-list');
    }

    /**
     *
     */
    public function manageItemsModalCancelButtonClicked(): void
    {
        $this->isManageItemsModalOpen = false;
    }

    /**
     *
     */
    public function emailItemModalCancelButtonClicked(): void
    {
        $this->isEmailItemModalOpen = false;
    }

    /**
     * @param int $itemId
     */
    public function itemClicked(int $itemId)
    {
        /** @var Item $item */
        $item = Item::find($itemId);

        if (! $item || ! $item->isYoutubeVideo() || ! $item->source) {
            return;
        }

        $item->addVisit(auth()->user());

        $this->isYoutubeModalOpen = true;

        $this->currentVideoSource = $item->youtubeVideoEmbedUrl();
    }

    /**
     * Toggle the dropdown hidden/visible state.
     */
    public function toggleSortByDropdown()
    {
        $this->isSortByDropdownOpen = ! $this->isSortByDropdownOpen;
    }

    /**
     * Toggle the dropdown hidden/visible state.
     */
    public function toggleNewItemDropdown()
    {
        $this->isNewItemDropdownOpen = ! $this->isNewItemDropdownOpen;
    }

    /**
     * Triggered when the search box is updated.
     */
    public function updatedSearch()
    {
        $this->fetchItems();
    }

    /**
     * Triggered when the sort-by field is updated.
     */
    public function updatedSortBy()
    {
        $this->fetchItems();
    }

    /**
     * @param string $field
     */
    public function sortBy(string $field)
    {
        $this->sortBy = $field;

        $this->isSortByDropdownOpen = false;

        $this->fetchItems();
    }

    /**
     * @param string $itemType
     */
    public function addNewItemClicked(string $itemType)
    {
        $this->isNewItemDropdownOpen = false;

        $this->isManageItemsModalOpen = true;

        $this->itemTypeBeingAdded = $itemType;
    }

    /**
     *
     */
    public function itemCreated()
    {
        $this->isManageItemsModalOpen = false;

        $this->successMessage = 'New item has been successfully added!';

        $this->fetchItems();
    }

    /**
     * @param $itemId
     */
    public function onEmailItemIconButtonClicked($itemId)
    {
        $this->isEmailItemModalOpen = true;

        $this->emitTo('email-item-form', 'emailItemIconClicked', $itemId);
    }

    /**
     *
     */
    public function itemEmailed()
    {
        $this->isEmailItemModalOpen = false;
    }

    /**
     * @param $itemId
     */
    public function toggleFavorite($itemId)
    {
        $item = Item::find($itemId);

        if (! $item) {
            return;
        }

        auth()->user()->toggleFavorite($item);

        $item->refresh();

        if (is_null($this->favoriteIdsToShow)) {
            return;
        }

        // If a user liked/unliked an item in the favorites view
        // we need to refresh $this->favoriteIdsToShow.
        $isFavorite = $item->isFavoredBy(auth()->user());

        if ($isFavorite) {
            $this->favoriteIdsToShow->push($item->id);

            $this->fetchItems();

            return;
        }

        $itemKeyToRemove = $this->favoriteIdsToShow->search($item->id);
        if ($itemKeyToRemove === false) {
            return;
        }

        $this->favoriteIdsToShow->forget($itemKeyToRemove);

        $this->fetchItems();
    }

    /**
     * Fetch items from the db.
     */
    protected function fetchItems(): void
    {
        $doNotSetParentId = $this->search || ! is_null($this->favoriteIdsToShow);

        $this->items = auth()->user()
                             ->availableItems($doNotSetParentId ? -1 : ($this->currentCategory ? $this->currentCategory->id : null))
                             ->where(function (Builder $builder) {
                                 $builder->where('name', 'LIKE', "%$this->search%");
                             })
                             ->when(! is_null($this->favoriteIdsToShow) && empty($this->search), function (Builder $builder) {
                                 $builder->whereIn('id', $this->favoriteIdsToShow);
                             })
                             ->sortBy($this->sortBy)
                             ->get();
    }
}
