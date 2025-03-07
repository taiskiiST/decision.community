<?php

namespace App\Http\Livewire;

use Illuminate\Support\Facades\Route;
use Livewire\Component;

class NavComponent extends Component
{
  public $isMenuOpen = false;

  public $isProfileDropdownOpen = false;

  public $currentRouteName;

  public function mount()
  {
    $this->currentRouteName = Route::currentRouteName();
  }

  public function toggleProfileDropdown()
  {
    $this->isProfileDropdownOpen = !$this->isProfileDropdownOpen;
  }

  public function toggleMenu()
  {
    $this->isMenuOpen = !$this->isMenuOpen;
  }

  public function render()
  {
    return view('livewire.nav-component');
  }
}
