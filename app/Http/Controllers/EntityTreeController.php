<?php

namespace App\Http\Controllers;
use App\Models\Entity;
use App\Models\Company;
use App\Models\User;
use App\Models\Poll;
use App\Services\FileHelper;
use App\Services\StringHelper;
use App\Services\ThumbMaker;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Collection;

class EntityTreeController extends Controller
{
  public function getEntityDirectChildren(Entity $entity)
  {
    $this->authorize('view', $entity);

    $currentCompany = Company::current();
    if (!$currentCompany) {
      return new Collection();
    }

    return $entity->getDirectChildrenBelongingToCompany($currentCompany);
  }

  public function updateEntityParent(Entity $entity)
  {
    $this->authorize('update', $entity);

    $params = $this->validate(request(), [
      'newParentId' => 'nullable|exists:entities,id',
    ]);

    $parentId = $params['newParentId'] ?? null;
    $entity->parent_id = $parentId;
    $entity->save();

    return redirect()->back()->with('success', 'Parent updated successfully.');
  }

  public function addEntity()
  {
    $this->authorize('create', Entity::class);

    $params = $this->validate(request(), [
      'name' => 'required|string',
      'phone' => 'required|string',
      'parentId' => 'sometimes|nullable|exists:entities,id',
      'image' => 'sometimes|required|mimes:jpg,png|max:10240', // max 10MB
    ]);

    $parentId = $params['parentId'] ?? null;
    $parent = Entity::find($parentId);
    $currentCompany = Company::current();

    if ($parent && !$parent->belongsToCompanyWithId($currentCompany->id)) {
      return [
        'errorMessage' =>
          'Добавление сущности в другую компанию осуществляется через иную форму',
      ];
    }

    $file = $params['image'] ?? null;
    if ($file) {
      $fileNameNoExtension = app(
        FileHelper::class
      )->getFileNameWithoutExtension($file);

      $originalImagePath = $file->store('tmp/', 'local');
      $removeOriginalFile = true;
    } else {
      $fileNameNoExtension = 'default_entity_image';
      $originalImagePath = 'default_entity_image.jpg';

      $removeOriginalFile = false;
    }

    $thumbName =
      app(StringHelper::class)->clean($fileNameNoExtension) .
      '_' .
      Str::uuid()->toString() .
      '_thumb.jpg';

    $tmpPath = "tmp/$thumbName";

    $thumbCreatedSuccessfully = app(ThumbMaker::class)->makeFromFile(
      $originalImagePath,
      $tmpPath,
      $removeOriginalFile
    );

    if (!$thumbCreatedSuccessfully) {
      return [
        'errorMessage' => 'Не удалось создать иконку',
      ];
    }

    $newEntity = $currentCompany->entities()->create([
      'name' => $params['name'],
      'phone' => $params['phone'],
      'thumb' => $thumbName,
      'parent_id' => $parentId,
    ]);

    Storage::move($tmpPath, $newEntity->thumbPath());

    return $newEntity;
  }

  public function detachEntity(Entity $entity)
  {
    $currentCompany = Company::current();
    if (!$currentCompany) {
      return redirect()->route('polls.index');
    }

    $this->authorize('detach', $entity);

    $success = $entity->companies()->detach($currentCompany->id);
    $detachInfo[] = [
      'id' => $entity->id,
      'detached' => $success,
      'msg' => $success
        ? 'Сущность отвязана'
        : 'Ошибка при попытке отвязать сущность',
    ];

    return [
      'detachInfo' => $detachInfo,
    ];
  }

  public function getUsers(Entity $entity)
  {
    $this->authorize('view', $entity);

    // Show only current company users?
    return $entity->users()->get();
  }

  public function attachUserToEntity(Entity $entity, User $user)
  {
    $currentCompany = Company::current();
    if (!$currentCompany) {
      return redirect()->route('polls.index');
    }

    $this->authorize('attachUser', [$entity, $user]);

    $entity->attachUserIfNotAttached($user);

    $attachInfo = [
      'entity_id' => $entity->id,
      'user' => $user->toArray(),
      'attached' => true,
      'msg' => 'Пользователь успешно добавлен'
    ];

    return [
      'attachInfo' => $attachInfo,
    ];
  }

  public function detachUserFromEntity(Entity $entity, User $user)
  {
    $currentCompany = Company::current();
    if (!$currentCompany) {
      return redirect()->route('polls.index');
    }

    $this->authorize('detachUser', [$entity, $user]);

    $success = $entity->users()->detach($user);
    $detachInfo = [
      'entity_id' => $entity->id,
      'id' => $user->id,
      'detached' => $success,
      'msg' => $success
        ? 'Пользователь успешно отвязан'
        : 'Ошибка при попытке отвязать пользователя',
    ];

    return [
      'detachInfo' => $detachInfo,
    ];
  }

  public function getPolls(Entity $entity)
  {
    $this->authorize('view', $entity);

    $entityParents = $entity->getAllParents();

    $out = collect();
    foreach ([$entity, ...$entityParents] as $ent) {
      $polls = $ent->polls()->get();
      if ($polls->count()) {
        $out->push(...$polls);
      }
    }

    return $out->transform(function (Poll $poll) {
      $poll->protocol_doc_url = $poll->protocol_doc
        ? Storage::url($poll->protocol_doc)
        : '';

      return $poll;
    });
  }
}
