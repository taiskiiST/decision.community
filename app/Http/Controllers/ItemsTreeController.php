<?php

namespace App\Http\Controllers;

use App\Models\Chairman;
use App\Models\CommitteeMember;
use App\Models\Item;
use App\Models\PresidiumMember;
use App\Services\FileHelper;
use App\Services\StringHelper;
use App\Services\ThumbMaker;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use JavaScript;

/**
 * Class ItemsTreeController
 *
 * @package App\Http\Controllers
 */
class ItemsTreeController extends Controller
{
    /**
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function index()
    {
        $this->authorize('create', Item::class);

        JavaScript::put([
            'GET_ITEMS_URL'                     => route('items-tree.get-items'),
            'UPDATE_ITEM_PARENT_URL'            => route('items-tree.update-item-parent'),
            'UPDATE_ITEM_NAME_URL'              => route('items-tree.update-item-name'),
            'UPDATE_ITEM_PHONE_URL'             => route('items-tree.update-item-phone'),
            'UPDATE_ITEM_PIN_URL'               => route('items-tree.update-item-pin'),
            'UPDATE_ITEM_ADDRESS_URL'           => route('items-tree.update-item-address'),
            'UPDATE_ITEM_ELEMENTARY_URL'        => route('items-tree.update-item-elementary'),
            'UPDATE_ITEM_THUMB_URL'             => route('items-tree.update-item-thumb'),
            'ADD_ITEM_URL'                      => route('items-tree.add-item'),
            'REMOVE_ITEM_URL'                   => route('items-tree.remove-item'),
            'ADD_CATEGORY_URL'                  => route('items-tree.add-category'),
            'UPDATE_ITEM_COMMITTEE_MEMBERS_URL' => route('items-tree.update-item-committee-members'),
            'UPDATE_ITEM_PRESIDIUM_MEMBERS_URL' => route('items-tree.update-item-presidium-members'),
            'UPDATE_ITEM_CHAIRMAN_URL'          => route('items-tree.update-item-chairman'),
        ]);

        return view('items-tree.index');
    }

    /**
     * @return mixed
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function getItems()
    {
        $this->authorize('create', Item::class);

        $committeeMembersByIds = CommitteeMember::get()->groupBy('committee_id');

        $presidiumMembersByIds = PresidiumMember::get()->groupBy('presidium_id');

        $chairmenByIds = Chairman::get()->keyBy('chair_id');

        return Item::select('id', 'name', 'phone', 'pin', 'address', 'parent_id', 'is_category', 'thumb', 'elementary')
                     ->get()
                     ->transform(function (Item $item) use ($committeeMembersByIds, $presidiumMembersByIds, $chairmenByIds) {
                         $updatedItem = $item->addProperties();

                         $updatedItem->currentCommitteeMembers = $committeeMembersByIds->has($item->id)
                             ? $committeeMembersByIds->get($item->id)->pluck('member_id')->toArray()
                             : [];

                         $updatedItem->currentPresidiumMembers = $presidiumMembersByIds->has($item->id)
                             ? $presidiumMembersByIds->get($item->id)->pluck('member_id')->toArray()
                             : [];

                         $updatedItem->currentChairman = $chairmenByIds->has($item->id)
                             ? $chairmenByIds->get($item->id)->man_id
                             : null;

                         return $updatedItem;
                     });
    }

    /**
     * @return \App\Models\Item|string[]|null
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateItemParent()
    {
        /** @var Item $item */
        $item = Item::findOrFail(request('id'));

        $this->authorize('update', $item);

        $params = $this->validate(request(), [
            'parentId' => 'nullable|exists:items,id',
        ]);

        $parentId = $params['parentId'] ?? null;

        /** @var Item $parent */
        $parent = Item::find($parentId);

        if ($parent && ! $parent->isCategory()) {
            return [
                'errorMessage' => 'Невозможно переместить сущность: цель не является категорией',
            ];
        }

        $item->parent_id = $parentId;

        $item->save();

        $item->refresh();

        $item->addProperties();

        $item['updatedChildren'] = new Collection();

        return $item;
    }

    /**
     * @return \App\Models\Item|string[]|null
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateItemName()
    {
        /** @var Item $item */
        $item = Item::findOrFail(request('id'));

        $this->authorize('update', $item);

        $params = $this->validate(request(), [
            'name' => 'required|string',
        ]);

        $item->name = $params['name'];

        $item->save();

        $item->refresh();

        $item->addProperties();

        return $item;
    }

    /**
     * @return \App\Models\Item|string[]|null
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateItemPhone()
    {
        /** @var Item $item */
        $item = Item::findOrFail(request('id'));

        $this->authorize('update', $item);

        $params = $this->validate(request(), [
            'phone' => 'required|string',
        ]);

        $item->phone = $params['phone'];

        $item->save();

        $item->refresh();

        $item->addProperties();

        return $item;
    }

    /**
     * @return \App\Models\Item|string[]|null
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateItemPin()
    {
        /** @var Item $item */
        $item = Item::findOrFail(request('id'));

        $this->authorize('update', $item);

        $params = $this->validate(request(), [
            'pin' => 'required',
        ]);

        $item->pin = $params['pin'];

        $item->save();

        $item->refresh();

        $item->addProperties();

        return $item;
    }

    /**
     * @return \App\Models\Item|string[]|null
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateItemAddress()
    {
        /** @var Item $item */
        $item = Item::findOrFail(request('id'));

        $this->authorize('update', $item);

        $params = $this->validate(request(), [
            'address' => 'required',
        ]);

        $item->address = $params['address'];

        $item->save();

        $item->refresh();

        $item->addProperties();

        return $item;
    }

    /**
     * @return \App\Models\Item|string[]|null
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateItemElementary()
    {
        /** @var Item $item */
        $item = Item::findOrFail(request('id'));

        $this->authorize('update', $item);

        $params = $this->validate(request(), [
            'elementary' => 'required|bool',
        ]);

        $newElementary = $params['elementary'];

        DB::transaction(function () use ($item, $newElementary) {
            $item->elementary = $newElementary;

            $item->save();

            $item->committeeMembers()->delete();

            $item->presidiumMembers()->delete();

            $item->chairman()->delete();
        });

        $item->refresh();

        $committeeMembersByIds = CommitteeMember::get()->groupBy('committee_id');

        $presidiumMembersByIds = PresidiumMember::get()->groupBy('presidium_id');

        $chairmenByIds = Chairman::get()->keyBy('chair_id');

        $item->currentCommitteeMembers = $committeeMembersByIds->has($item->id)
            ? $committeeMembersByIds->get($item->id)->pluck('member_id')->toArray()
            : [];

        $item->currentPresidiumMembers = $presidiumMembersByIds->has($item->id)
            ? $presidiumMembersByIds->get($item->id)->pluck('member_id')->toArray()
            : [];

        $item->currentChairman = $chairmenByIds->has($item->id)
            ? $chairmenByIds->get($item->id)->man_id
            : null;

        $item->addProperties();

        return $item;
    }

    /**
     * @return \App\Models\Item|string[]|null
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateItemCommitteeMembers()
    {
        /** @var Item $item */
        $item = Item::findOrFail(request('id'));

        $this->authorize('update', $item);

        $params = $this->validate(request(), [
            'committeeMembers' => 'array',
        ]);

        $newCommitteeMembers = $params['committeeMembers'];

        $dataToInsert = [];
        foreach ($newCommitteeMembers as $committeeMemberId) {
            $dataToInsert[] = [
                'committee_id' => $item->id,
                'member_id' => $committeeMemberId,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::transaction(function () use ($item, $dataToInsert, $newCommitteeMembers) {
            $item->committeeMembers()->delete();

            $item->committeeMembers()->insert($dataToInsert);

            $currentPresidiumMembersIds = $item->presidiumMembers()->get()->pluck('member_id')->toArray();

            // Deleting from presidium if needed.
            $membersToDelete = array_diff($currentPresidiumMembersIds, $newCommitteeMembers);
            $item->presidiumMembers()->whereIn('member_id', $membersToDelete)->delete();

            // Deleting from chair if needed.
            $item->chairman()->whereIn('man_id', $membersToDelete)->delete();
        });

        $item->refresh();

        $committeeMembersByIds = CommitteeMember::get()->groupBy('committee_id');

        $presidiumMembersByIds = PresidiumMember::get()->groupBy('presidium_id');

        $chairmenByIds = Chairman::get()->keyBy('chair_id');

        $item->currentCommitteeMembers = $committeeMembersByIds->has($item->id)
            ? $committeeMembersByIds->get($item->id)->pluck('member_id')->toArray()
            : [];

        $item->currentPresidiumMembers = $presidiumMembersByIds->has($item->id)
            ? $presidiumMembersByIds->get($item->id)->pluck('member_id')->toArray()
            : [];

        $item->currentChairman = $chairmenByIds->has($item->id)
            ? $chairmenByIds->get($item->id)->man_id
            : null;

        $item->addProperties();

        return $item;
    }

    /**
     * @return \App\Models\Item|string[]|null
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateItemPresidiumMembers()
    {
        /** @var Item $item */
        $item = Item::findOrFail(request('id'));

        $this->authorize('update', $item);

        $params = $this->validate(request(), [
            'presidiumMembers' => 'array',
        ]);

        $newPresidiumMembers = $params['presidiumMembers'];

        $dataToInsert = [];
        foreach ($newPresidiumMembers as $presidiumMemberId) {
            $dataToInsert[] = [
                'presidium_id' => $item->id,
                'member_id' => $presidiumMemberId,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::transaction(function () use ($item, $dataToInsert, $newPresidiumMembers) {
            $item->presidiumMembers()->delete();

            $item->presidiumMembers()->insert($dataToInsert);

            $item->refresh();

            $currentChairmanId = $item->chairman ? $item->chairman->man_id : null;
            if (! $currentChairmanId) {
                return;
            }

            if (in_array($currentChairmanId, $newPresidiumMembers)) {
                return;
            }

            // Deleting from chair.
            $item->chairman()->delete();
        });

        $item->refresh();

        $committeeMembersByIds = CommitteeMember::get()->groupBy('committee_id');

        $presidiumMembersByIds = PresidiumMember::get()->groupBy('presidium_id');

        $chairmenByIds = Chairman::get()->keyBy('chair_id');

        $item->currentCommitteeMembers = $committeeMembersByIds->has($item->id)
            ? $committeeMembersByIds->get($item->id)->pluck('member_id')->toArray()
            : [];

        $item->currentPresidiumMembers = $presidiumMembersByIds->has($item->id)
            ? $presidiumMembersByIds->get($item->id)->pluck('member_id')->toArray()
            : [];

        $item->currentChairman = $chairmenByIds->has($item->id)
            ? $chairmenByIds->get($item->id)->man_id
            : null;

        $item->addProperties();

        return $item;
    }

    /**
     * @return \App\Models\Item|string[]|null
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateItemChairman()
    {
        /** @var Item $item */
        $item = Item::findOrFail(request('id'));

        $this->authorize('update', $item);

        $params = $this->validate(request(), [
            'chairman' => 'required|integer|exists:items,id',
        ]);

        $newChairmanId = $params['chairman'];

        DB::transaction(function () use ($item, $newChairmanId) {
            $item->chairman()->delete();

            $item->chairman()->create([
                'man_id' => $newChairmanId
            ]);
        });

        $item->refresh();

        $committeeMembersByIds = CommitteeMember::get()->groupBy('committee_id');

        $presidiumMembersByIds = PresidiumMember::get()->groupBy('presidium_id');

        $chairmenByIds = Chairman::get()->keyBy('chair_id');

        $item->currentCommitteeMembers = $committeeMembersByIds->has($item->id)
            ? $committeeMembersByIds->get($item->id)->pluck('member_id')->toArray()
            : [];

        $item->currentPresidiumMembers = $presidiumMembersByIds->has($item->id)
            ? $presidiumMembersByIds->get($item->id)->pluck('member_id')->toArray()
            : [];

        $item->currentChairman = $chairmenByIds->has($item->id)
            ? $chairmenByIds->get($item->id)->man_id
            : null;

        $item->addProperties();

        return $item;
    }

    /**
     * @return \App\Models\Item|string[]|null
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateItemThumb()
    {
        /** @var Item $item */
        $item = Item::findOrFail(request('id'));

        $this->authorize('update', $item);

        $params = $this->validate(request(), [
            'image' => 'required|mimes:jpg,png|max:10240', // max 10MB
        ]);

        $file = $params['image'];
        $fileNameNoExtension = app(FileHelper::class)->getFileNameWithoutExtension($file);
        $originalImagePath = $file->store(
            'tmp/',
            'local'
        );

        $thumbName = app(StringHelper::class)->clean($fileNameNoExtension) . '_' . Str::uuid()->toString() . '_thumb.jpg';
        $tmpPath = "tmp/$thumbName";
        $thumbCreatedSuccessfully = app(ThumbMaker::class)->makeFromFile($originalImagePath, $tmpPath, true);

        if (! $thumbCreatedSuccessfully) {
            return [
                'errorMessage' => 'Не удалось создать иконку',
            ];
        }

        $item->thumb = $thumbName;
        $item->save();
        $item->refresh();

        Storage::move($tmpPath, $item->thumbPath());

        return $item->addProperties();
    }

    /**
     * @return \App\Models\Item|string[]
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function addItem()
    {
        $this->authorize('create', Item::class);

        $params = $this->validate(request(), [
            'name'         => 'required|string',
            'parentId'     => 'sometimes|nullable|exists:items,id',
            'image'        => 'sometimes|required|mimes:jpg,png|max:10240', // max 10MB
        ]);

        $parentId = $params['parentId'] ?? null;
        $parent = Item::find($parentId);

        if ($parent && ! $parent->isCategory()) {
            return [
                'errorMessage' => 'Невозможно добавить сущность: цель не является категорией',
            ];
        }

        $file = $params['image'] ?? null;
        if ($file) {
            $fileNameNoExtension = app(FileHelper::class)->getFileNameWithoutExtension($file);

            $originalImagePath = $file->store(
                'tmp/',
                'local'
            );

            $removeOriginalFile = true;

        } else {
            $fileNameNoExtension = 'default_user_image';

            $originalImagePath = 'default_user_image.jpg';

            $removeOriginalFile = false;
        }

        $thumbName = app(StringHelper::class)->clean($fileNameNoExtension) . '_' . Str::uuid()->toString() . '_thumb.jpg';
        $tmpPath = "tmp/$thumbName";

        $thumbCreatedSuccessfully = app(ThumbMaker::class)->makeFromFile($originalImagePath, $tmpPath, $removeOriginalFile);

        if (! $thumbCreatedSuccessfully) {
           return [
               'errorMessage' => 'Не удалось создать иконку',
           ];
        }

        /** @var Item $newItem */
        $newItem = Item::create([
            'name'          => $params['name'],
            'thumb'         => $thumbName,
            'parent_id'     => $parentId,
            'is_category'   => false,
        ]);

        Storage::move($tmpPath, $newItem->thumbPath());

        return $newItem->addProperties();
    }

    /**
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Exception
     */
    public function removeItem()
    {
        /** @var Item $item */
        $item = Item::findOrFail(request('id'));

        $this->authorize('delete', $item);

        return [
            'deletedIds' => $item->deleteWithFiles(),
        ];
    }

    /**
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function addCategory()
    {
        $this->authorize('create', Item::class);

        $params = $this->validate(request(), [
            'name'         => 'required|string',
            'parentId'     => 'sometimes|nullable|exists:items,id',
            'image'        => 'sometimes|required|mimes:jpg,png|max:10240', // max 10MB
        ]);

        $parentId = $params['parentId'] ?? null;
        $parent = Item::find($parentId);

        if ($parent && ! $parent->isCategory()) {
            return [
                'errorMessage' => 'Невозможно добавить сущность: цель не является категорией',
            ];
        }

        $file = $params['image'] ?? null;
        if ($file) {
            $fileNameNoExtension = app(FileHelper::class)->getFileNameWithoutExtension($file);

            $originalImagePath = $file->store(
                'tmp/',
                'local'
            );

            $removeOriginalFile = true;

        }  else {
            $fileNameNoExtension = 'default_category_image';

            $originalImagePath = 'default_category_image.jpg';

            $removeOriginalFile = false;
        }

        $thumbName = app(StringHelper::class)->clean($fileNameNoExtension) . '_' . Str::uuid()->toString() . '_thumb.jpg';
        $tmpPath = "tmp/$thumbName";
        $thumbCreatedSuccessfully = app(ThumbMaker::class)->makeFromFile($originalImagePath, $tmpPath, $removeOriginalFile);

        if (! $thumbCreatedSuccessfully) {
            return [
                'errorMessage' => 'Не удалось создать иконку',
            ];
        }

        $newCategory = Item::create([
            'name'          => $params['name'],
            'thumb'         => $thumbName,
            'parent_id'     => $parentId,
            'is_category'   => true,
        ]);

        Storage::move($tmpPath, $newCategory->thumbPath());

        return $newCategory->addProperties();
    }
}
