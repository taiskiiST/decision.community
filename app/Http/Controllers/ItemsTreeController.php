<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Services\FileHelper;
use App\Services\StringHelper;
use App\Services\ThumbMaker;
use App\Services\Youtube;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
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
            'GET_ITEMS_URL'                 => route('items-tree.get-items'),
            'UPDATE_ITEM_PARENT_URL'        => route('items-tree.update-item-parent'),
            'UPDATE_ITEM_EMPLOYEE_ONLY_URL' => route('items-tree.update-item-employee-only'),
            'UPDATE_ITEM_NAME_URL'          => route('items-tree.update-item-name'),
            'UPDATE_ITEM_THUMB_URL'         => route('items-tree.update-item-thumb'),
            'ADD_YOUTUBE_ITEM_URL'          => route('items-tree.add-youtube-item'),
            'ADD_PDF_ITEM_URL'              => route('items-tree.add-pdf-item'),
            'REMOVE_ITEM_URL'               => route('items-tree.remove-item'),
            'ADD_CATEGORY_URL'              => route('items-tree.add-category'),
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

        return auth()->user()->availableItems(request('parentId'))
                     ->select('id', 'company_id', 'name', 'parent_id', 'is_category', 'employee_only', 'thumb')
                     ->get()
                     ->transform(function (Item $item) {
                         return $item->addProperties();
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
                'errorMessage' => 'Cannot move item: the destination is not a category',
            ];
        }

        $item->parent_id = $parentId;

        if ($parent && $parent->isEmployeeOnly()) {
            $item->employee_only = true;
        }

        $item->save();

        $item->refresh();

        $item->addProperties();

        $item['updatedChildren'] = $item->setEmployeeOnlyForChildrenIfItemIsEmployeeOnly();

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
                'errorMessage' => 'Could not create a thumbnail',
            ];
        }

        $item->thumb = $thumbName;
        $item->save();
        $item->refresh();

        Storage::move($tmpPath, $item->thumbPath());

        return $item->addProperties();
    }

    /**
     * @return \App\Models\Item|string[]|null
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateItemEmployeeOnly()
    {
        /** @var Item $item */
        $item = Item::findOrFail(request('id'));

        $this->authorize('update', $item);

        $params = $this->validate(request(), [
            'employeeOnly' => 'required|bool',
        ]);

        $employeeOnly = $params['employeeOnly'];

        if (! $employeeOnly && ! $item->areAllAncestorsUnRestricted()) {
            return [
                'errorMessage' => 'Cannot uncheck "Employee Only" because one of the parents is "Employee Only"',
            ];
        }

        $item->employee_only = $employeeOnly;

        $item->save();

        $item->refresh();

        $item->addProperties();

        $item['updatedChildren'] = $item->setEmployeeOnlyForChildrenIfItemIsEmployeeOnly();

        return $item;
    }

    /**
     * @return \App\Models\Item|string[]
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function addYoutubeItem()
    {
        $this->authorize('create', Item::class);

        $params = $this->validate(request(), [
            'parentId' => 'sometimes|nullable|exists:items,id',
            'url'      => 'required|url',
        ]);

        $parentId = $params['parentId'] ?? null;
        $parent = Item::find($parentId);

        if ($parent && ! $parent->isCategory()) {
            return [
                'errorMessage' => 'Cannot add an item: the destination is not a category',
            ];
        }

        $url = $params['url'];

        $info = app(Youtube::class)->getVideoInfo($url);

        if (empty($info['title']) || empty($info['thumbnailUrl'])) {
            return [
                'errorMessage' => 'Video title or thumbnail not found',
            ];
        }

        $thumbName = app(StringHelper::class)->clean($info['title']) . '_' . Str::uuid()->toString() . '_thumb.jpg';
        $tmpPath = "tmp/$thumbName";
        $thumbCreatedSuccessfully = app(ThumbMaker::class)->makeFromImageUrl($info['thumbnailUrl'], $tmpPath);

        if (! $thumbCreatedSuccessfully) {
            return [
                'errorMessage' => 'Could not create a thumbnail',
            ];
        }

        /** @var Item $newItem */
        $newItem = Item::create([
            'company_id'    => auth()->user()->company_id,
            'name'          => $info['title'],
            'thumb'         => $thumbName,
            'parent_id'     => $parentId,
            'source'        => $url,
            'employee_only' => $parent ? $parent->employee_only : false,
            'is_category'   => false,
        ]);

        Storage::move($tmpPath, $newItem->thumbPath());

        return $newItem->addProperties();
    }

    /**
     * @return \App\Models\Item|string[]
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function addPdfItem()
    {
        $this->authorize('create', Item::class);

        $params = $this->validate(request(), [
            'parentId' => 'sometimes|nullable|exists:items,id',
            'file'     => 'required|mimes:pdf|max:51200', // max 50MB
        ]);

        $parentId = $params['parentId'] ?? null;
        $parent = Item::find($parentId);

        if ($parent && ! $parent->isCategory()) {
            return [
                'errorMessage' => 'Cannot add an item: the destination is not a category',
            ];
        }

        $file = $params['file'];
        $fileNameNoExtension = app(FileHelper::class)->getFileNameWithoutExtension($file);

        /** @var \App\Models\Company $company */
        $company = auth()->user()->company;

        $storedPdfPath = $file->store(
            $company->pdfDocumentsPath(),
            'local'
        );

        $thumbName = app(StringHelper::class)->clean($fileNameNoExtension) . '_' . Str::uuid()->toString() . '_thumb.jpg';
        $tmpPath = "tmp/$thumbName";
        $thumbCreatedSuccessfully = app(ThumbMaker::class)->makeFromFile($storedPdfPath . '[0]', $tmpPath);

        if (! $thumbCreatedSuccessfully) {
            return [
                'errorMessage' => 'Could not create a thumbnail',
            ];
        }

        /** @var Item $newItem */
        $newItem = Item::create([
            'company_id'    => $company->id,
            'name'          => $fileNameNoExtension,
            'thumb'         => $thumbName,
            'parent_id'     => $parentId,
            'source'        => $storedPdfPath,
            'employee_only' => $parent ? $parent->employee_only : false,
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
            'image'        => 'required|mimes:jpg,png|max:10240', // max 10MB
            'employeeOnly' => [
                'sometimes',
                'nullable',
                Rule::in(['true', 'false']),
            ],
        ]);

        $parentId = $params['parentId'] ?? null;
        $parent = Item::find($parentId);

        if ($parent && ! $parent->isCategory()) {
            return [
                'errorMessage' => 'Cannot add a category: the destination is not a category',
            ];
        }

        /** @var \App\Models\Company $company */
        $company = auth()->user()->company;

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
                'errorMessage' => 'Could not create a thumbnail',
            ];
        }

        $newCategory = Item::create([
            'company_id'    => $company->id,
            'name'          => $params['name'],
            'thumb'         => $thumbName,
            'parent_id'     => $parentId,
            'employee_only' => $parent ? $parent->employee_only : (! empty($params['employeeOnly']) ? $params['employeeOnly'] === 'true' : false),
            'is_category'   => true,
        ]);

        Storage::move($tmpPath, $newCategory->thumbPath());

        return $newCategory->addProperties();
    }
}
