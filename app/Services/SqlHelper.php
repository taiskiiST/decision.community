<?php

namespace App\Services;

/**
 * Class SqlHelper
 *
 * @package App\Services
 */
class SqlHelper
{
  /**
   * Combines SQL and its bindings
   *
   * @param \Eloquent $query
   *
   * @return string
   */
  public function getEloquentSqlWithBindings($query)
  {
    return vsprintf(
      str_replace('?', '%s', $query->toSql()),
      collect($query->getBindings())
        ->map(function ($binding) {
          return is_numeric($binding) ? $binding : "'{$binding}'";
        })
        ->toArray()
    );
  }
}
