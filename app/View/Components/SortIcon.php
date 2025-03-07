<?php

namespace App\View\Components;

use Illuminate\View\Component;

/**
 * Class SortIcon
 *
 * @package App\View\Components
 */
class SortIcon extends Component
{
  public $field;

  public $sortField;

  public $sortAsc;

  /**
   * Create a new component instance.
   *
   * @param $field
   * @param $sortField
   * @param $sortAsc
   */
  public function __construct($field, $sortField, $sortAsc)
  {
    $this->field = $field;

    $this->sortField = $sortField;

    $this->sortAsc = $sortAsc;
  }

  /**
   * Get the view / contents that represent the component.
   *
   * @return \Illuminate\Contracts\View\View|string
   */
  public function render()
  {
    return view('components.sort-icon');
  }
}
