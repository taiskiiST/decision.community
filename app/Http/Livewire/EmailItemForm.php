<?php

namespace App\Http\Livewire;

use App\Mail\ItemOfInterest;
use App\Models\Item;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Livewire\Component;

/**
 * Class AddYoutubeVideoForm
 *
 * @package App\Http\Livewire
 */
class EmailItemForm extends Component
{
  const MAX_ITEM_SIZE_BEFORE_WARNING_MB = 10;

  use AuthorizesRequests;

  public $itemId;

  public $itemSizeInMegabytes = 0;

  public $sizeWarning = '';

  public $emailAddressesString = '';

  public $errorMessage = '';

  protected $listeners = ['emailItemIconClicked'];

  protected $rules = [
    'emailAddressesString' => 'required|string',
  ];

  /**
   * @param $itemId
   */
  public function emailItemIconClicked($itemId)
  {
    $this->sizeWarning = '';

    $this->itemId = $itemId;

    $item = Item::find($this->itemId);
    if (!$item) {
      $this->errorMessage = 'Item not found';

      return;
    }
  }

  /**
   * @throws \Illuminate\Auth\Access\AuthorizationException
   */
  public function submitForm()
  {
    if (!auth()->user()) {
      abort(401);
    }

    $this->errorMessage = '';

    $this->validate();

    $item = Item::find($this->itemId);
    if (!$item) {
      $this->errorMessage = 'Item not found';

      return;
    }

    $this->authorize('email', $item);

    $dirtyEmails = explode(';', $this->emailAddressesString);

    $sendTo = array_filter(
      array_map(function ($email) {
        return trim($email);
      }, $dirtyEmails),
      function ($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
      }
    );

    if (empty($sendTo)) {
      $this->errorMessage = 'Wrong email format';

      return;
    }

    try {
      Mail::to($sendTo)->send(new ItemOfInterest($item, auth()->user()));
    } catch (\Throwable $e) {
      logger(__METHOD__ . ' - ' . $e->getMessage());

      $this->errorMessage = 'Error occurred';

      return;
    }

    $this->emitUp('itemEmailed');
  }

  /**
   * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
   */
  public function render()
  {
    return view('livewire.email-item-form');
  }
}
