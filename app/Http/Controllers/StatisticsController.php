<?php

namespace App\Http\Controllers;

use App\Exports\ItemVisitsExport;
use App\Models\ItemVisit;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

/**
 * Class StatisticsController
 *
 * @package App\Http\Controllers
 */
class StatisticsController extends Controller
{
    /**
     * StatisticsController constructor.
     */
    public function __construct()
    {
        $this->authorizeResource(ItemVisit::class);
    }

    /**
     *
     */
    public function index()
    {
        return view('statistics.index');
    }

    /**
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function download(Request $request)
    {
        $this->authorize('download', ItemVisit::class);

        $params = $this->validate($request, [
            'search' => 'nullable|string',
            'startDate' => 'required|string',
            'endDate' => 'required|string',
            'sortField' => 'nullable|string',
            'sortAsc' => 'bool',
        ]);

        return Excel::download(new ItemVisitsExport(
            auth()->user(),
            $params['search'] ?? '',
            $params['startDate'],
            $params['endDate'],
            $params['sortField'] ?? null,
            $params['sortAsc'] ?? true
        ), 'statistics.xlsx');
    }
}
