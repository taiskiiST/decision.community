<?php

namespace App\Http\Controllers;

use App\Models\Entity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EntityController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function tree()
  {
    return Inertia::render('Entity/Tree', [
      'entities' => ['entity1', 'entity2', 'entity3'],
    ]);
  }

  /**
   * Show the form for creating a new resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function create()
  {
    return Inertia::render('Entity/Create', [
      'foo' => 'bar'
    ]);
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    //
  }

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\Entity  $entity
   * @return \Illuminate\Http\Response
   */
  public function show(Entity $entity)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   *
   * @param  \App\Models\Entity  $entity
   * @return \Illuminate\Http\Response
   */
  public function edit(Entity $entity)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\Entity  $entity
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, Entity $entity)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  \App\Models\Entity  $entity
   * @return \Illuminate\Http\Response
   */
  public function destroy(Entity $entity)
  {
    //
  }
}
