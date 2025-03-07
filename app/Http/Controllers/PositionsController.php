<?php

namespace App\Http\Controllers;

use App\Models\Position;
use Illuminate\Http\Request;

class PositionsController extends Controller
{
  public function positionManage(Request $request)
  {
    if (!session('current_company')) {
      return redirect()->route('polls.index');
    }
    return view('positions.index', [
      'positions' => Position::where(
        'company_id',
        session('current_company')->id
      )->get(),
      'error' => '',
    ]);
  }
  public function positionUpdate(Request $request)
  {
    $position = Position::find($request->position);
    return view('positions.update', [
      'position' => $position,
      'error' => '',
    ]);
  }
  public function positionUpdateSubmit(Request $request)
  {
    if (!session('current_company')) {
      return redirect()->route('polls.index');
    }
    $position = Position::find($request->position_id);
    $position->update([
      'position' => $request->position_name,
    ]);
    return view('positions.index', [
      'positions' => Position::where(
        'company_id',
        session('current_company')->id
      )->get(),
      'error' => '',
    ]);
  }
  public function positionAdd(Request $request)
  {
    return view('positions.add');
  }
  public function positionAddSubmit(Request $request)
  {
    if (!session('current_company')) {
      return redirect()->route('polls.index');
    }
    $position = Position::upsert(
      [
        [
          'position' => $request->position_name,
          'company_id' => session('current_company')->id,
        ],
      ],
      ['position', 'company_id'],
      ['position', 'company_id']
    );
    return view('positions.index', [
      'positions' => Position::where(
        'company_id',
        session('current_company')->id
      )->get(),
      'error' => '',
    ]);
  }
  public function positionDelete(Request $request)
  {
    if (!session('current_company')) {
      return redirect()->route('polls.index');
    }
    $position = Position::find($request->idToDelPosition);
    if (isset($position)) {
      $position->delete();
    }
    return view('positions.index', [
      'positions' => Position::where(
        'company_id',
        session('current_company')->id
      )->get(),
      'error' => '',
    ]);
  }
}
