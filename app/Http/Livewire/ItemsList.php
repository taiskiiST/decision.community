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

  const SORT_BY_LATEST = 'По новизне';
  const SORT_ALPHABETICALLY = 'По алфавиту';

  public $search = '';

  public $sortBy = self::SORT_BY_LATEST;

  public $items;

  public $isSortByDropdownOpen = false;

  public $isNewItemDropdownOpen = false;

  public $isManageItemsModalOpen = false;

  public $successMessage = '';

  public $itemTypeBeingAdded = '';

  public $currentCategory = null;

  public $parentCategories;

  public $isEmailItemModalOpen = false;

  protected $listeners = [
    'itemCreated',
    'manageItemsModalCancelButtonClicked',
    'emailItemModalCancelButtonClicked',
    'itemEmailed',
  ];

  /**
   * Triggered when the component is mounted.
   *
   * @param null $category
   */
  public function mount($category = null)
  {
    $this->currentCategory = $category;

    $this->parentCategories = new Collection();

    $this->fetchItems();

    if (!$this->currentCategory) {
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
   * Toggle the dropdown hidden/visible state.
   */
  public function toggleSortByDropdown()
  {
    $this->isSortByDropdownOpen = !$this->isSortByDropdownOpen;
  }

  /**
   * Toggle the dropdown hidden/visible state.
   */
  public function toggleNewItemDropdown()
  {
    $this->isNewItemDropdownOpen = !$this->isNewItemDropdownOpen;
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
   * Fetch items from the db.
   */
  protected function fetchItems(): void
  {
    $doNotSetParentId = $this->search;

    $this->items = auth()
      ->user()
      ->availableItems(
        $doNotSetParentId
          ? -1
          : ($this->currentCategory
            ? $this->currentCategory->id
            : null)
      )
      ->where(function (Builder $builder) {
        $builder
          ->where('name', 'LIKE', "%$this->search%")
          ->orWhere('address', 'LIKE', "%$this->search%");
      })
      ->sortBy($this->sortBy)
      ->get();
  }
}
