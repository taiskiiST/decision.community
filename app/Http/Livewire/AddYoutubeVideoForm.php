<?php

namespace App\Http\Livewire;

use App\Models\Item;
use App\Services\StringHelper;
use App\Services\ThumbMaker;
use App\Services\Youtube;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Livewire\Component;

/**
 * Class AddYoutubeVideoForm
 *
 * @package App\Http\Livewire
 */
class AddYoutubeVideoForm extends Component
{
    use AuthorizesRequests;

    public $parentItemId;

    public $url = '';

    public $errorMessage = '';

    public $employeeOnly = false;

    public $employeeOnlyEditable = true;

    protected $rules = [
        'url' => 'required|url',
    ];

    /**
     * Triggered when the component is mounted.
     *
     * @param bool $parentItemId
     */
    public function mount($parentItemId = false)
    {
        $this->parentItemId = $parentItemId;

        $this->setEmployeeOnlyIfParentIsEmployeeOnly();
    }

    /**
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function submitForm()
    {
        if (! auth()->user()) {
            abort(401);
        }

        $this->errorMessage = '';

        $this->authorize('create', Item::class);

        $this->validate();

        $info = app(Youtube::class)->getVideoInfo($this->url);

        if (empty($info['title']) || empty($info['thumbnailUrl'])) {
            $this->errorMessage = 'Video title or thumbnail not found';

            return;
        }

        $thumbName = app(StringHelper::class)->clean($info['title']) . '_' . Str::uuid()->toString() . '_thumb.jpg';
        $tmpPath = "tmp/$thumbName";
        $thumbCreatedSuccessfully = app(ThumbMaker::class)->makeFromImageUrl($info['thumbnailUrl'], $tmpPath);

        if (! $thumbCreatedSuccessfully) {
            $this->errorMessage = 'Could not create a thumbnail';

            return;
        }

        $this->setEmployeeOnlyIfParentIsEmployeeOnly();

        /** @var Item $newItem */
        $newItem = Item::create([
            'company_id' => auth()->user()->company_id,
            'name' => $info['title'],
            'thumb' => $thumbName,
            'parent_id' => ! empty($this->parentItemId) ? $this->parentItemId : null,
            'source' => $this->url,
            'employee_only' => $this->employeeOnly,
        ]);

        Storage::move($tmpPath, $newItem->thumbPath());

        $this->emitUp('itemCreated');

        $this->url = '';
    }

    /**
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function render()
    {
        return view('livewire.add-youtube-video-form');
    }

    /**
     *
     */
    public function setEmployeeOnlyIfParentIsEmployeeOnly(): void
    {
        if (empty($this->parentItemId)) {
            return;
        }

        /** @var Item $parentItem */
        $parentItem = Item::find($this->parentItemId);

        if (! $parentItem) {
            $this->errorMessage = 'Parent category not found';

            return;
        }

        $parentsEmployeeOnly = $parentItem->isEmployeeOnly();
        if (! $parentsEmployeeOnly) {
            return;
        }

        $this->employeeOnly = true;

        $this->employeeOnlyEditable = false;
    }
}
