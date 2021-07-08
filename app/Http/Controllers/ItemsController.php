<?php
/** @noinspection PhpMissingReturnTypeInspection */

/** @noinspection PhpIncompatibleReturnTypeInspection */

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Class ItemsController
 *
 * @package App\Http\Controllers
 */
class ItemsController extends Controller
{
    /**
     * ItemsController constructor.
     */
    public function __construct()
    {
        $this->authorizeResource(Item::class, 'item');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('items.index', [
            'category' => null,
            'favoriteIdsToShow' => null,
        ]);
    }

    /**
     * Display a listing of favorite items.
     *
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function favorites()
    {
        $this->authorize('viewAny', Item::class);

        return view('items.index', [
            'category' => null,
            'favoriteIdsToShow' => auth()->user()->favorites->pluck('id')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Item $item
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Item $item)
    {
        if (! $item->isCategory()) {
            abort(403, "Item {$item->name} is not a category");
        }

        $item->addVisit(auth()->user());

        return view('items.index', [
            'category' => $item,
            'favoriteIdsToShow' => null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param \App\Models\Item $item
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(Item $item)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Item $item
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Item $item)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Item $item
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Item $item)
    {
        //
    }

    /**
     * @param \App\Models\Item $item
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
     * @throws \Illuminate\Auth\Access\AuthorizationException|\Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function download(Item $item)
    {
        $this->authorize('download', $item);

        if (! $item->isPdf()) {
            abort(404, 'Wrong item type.');
        }

        if (! Storage::exists($item->pdfPath())) {
            abort(404, 'File not found.');
        }

        $item->addVisit(auth()->user());

        return response(Storage::get($item->pdfPath()), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $item->name . '.pdf"'
        ]);
    }
}
