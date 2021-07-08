<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\User;
use App\Services\SqlHelper;
use App\Services\Tree;
use Illuminate\Http\Request;

/**
 * Class DevController
 *
 * @package App\Http\Controllers
 */
class DevController extends Controller
{
    /**
     *
     */
    public function index()
    {
        return 'a';
    }
}
