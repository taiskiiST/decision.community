<?php

namespace App\Http\Controllers;

use App\Models\Position;
use Illuminate\Http\Request;

class PositionsController extends Controller
{
    public function positionManage(Request $request)
    {
        return view('positions.index', [
            'positions' => Position::all(),
            'error'=> ''
        ]);
    }
    public function positionUpdate(Request $request)
    {
        $position = Position::find($request->position);
        return view('positions.update', [
            'position' => $position,
            'error'=> ''
        ]);
    }
    public function positionUpdateSubmit(Request $request)
    {
        //dd($request);
        $position = Position::find($request->position_id);
        $position->update([
            'position' => $request->position_name
        ]);
        return view('positions.index', [
            'positions' => Position::all(),
            'error'=> ''
        ]);
    }
    public function positionAdd(Request $request)
    {
        return view('positions.add');
    }
    public function positionAddSubmit(Request $request)
    {

        $position = Position::updateOrCreate([
            'position' => $request->position_name
        ]);
        return view('positions.index', [
            'positions' => Position::all(),
            'error'=> ''
        ]);
    }
    public function positionDelete(Request $request)
    {
        $position = Position::find($request->idToDelPosition);
        if(isset($position)) {
            $position->delete();
        }
        return view('positions.index', [
            'positions' => Position::all(),
            'error'=> ''
        ]);
    }
}