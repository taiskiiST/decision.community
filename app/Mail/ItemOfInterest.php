<?php

namespace App\Mail;

use App\Models\Item;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

/**
 * Class ItemOfInterest
 *
 * @package App\Mail
 */
class ItemOfInterest extends Mailable
{
  use Queueable, SerializesModels;

  public $item;

  public $user;

  /**
   * Create a new message instance.
   *
   * @param \App\Models\Item $item
   * @param \App\Models\User $user
   */
  public function __construct(Item $item, User $user)
  {
    $this->user = $user;

    $this->item = $item;
  }

  /**
   * Build the message.
   *
   * @return $this
   */
  public function build()
  {
    $markdown = $this->markdown('emails.item-of-interest')->subject(
      'On behalf of ' . $this->user->name . ': ' . $this->item->name
    );

    return $markdown;
  }
}
