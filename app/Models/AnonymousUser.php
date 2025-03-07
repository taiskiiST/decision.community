<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AnonymousUser extends Model
{
  use HasFactory;

  public function votes(): HasMany
  {
    return $this->hasMany(AnonymousVote::class);
  }
  public function vote(Question $question, Answer $answer): Model
  {
    return $this->votes()->Create([
      'question_id' => $question->id,
      'answer_id' => $answer->id,
    ]);
  }
}
