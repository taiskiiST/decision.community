<?php

namespace App\Http\Livewire;

use App\Models\Item;
use App\Services\FileHelper;
use App\Services\StringHelper;
use App\Services\ThumbMaker;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Livewire\Component;
use Livewire\WithFileUploads;

/**
 * Class AddPdfForm
 *
 * @package App\Http\Livewire
 */
class AddPdfForm extends Component
{
    use AuthorizesRequests, WithFileUploads;

    protected $rules = [
        'file' => 'required|mimes:pdf|max:51200', // max 50MB
    ];

    public $parentItemId;

    public $errorMessage = '';

    public $file;

    public $employeeOnly = false;

    public $employeeOnlyEditable = true;

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

        $this->authorize('create', Item::class);

        $this->validate();

        $fileNameNoExtension = app(FileHelper::class)->getFileNameWithoutExtension($this->file);

        /** @var \App\Models\Company $company */
        $company = auth()->user()->company;

        $storedPdfPath = $this->file->store(
            $company->pdfDocumentsPath(),
            'local'
        );

        $thumbName = app(StringHelper::class)->clean($fileNameNoExtension) . '_' . Str::uuid()->toString() . '_thumb.jpg';
        $tmpPath = "tmp/$thumbName";
        $thumbCreatedSuccessfully = app(ThumbMaker::class)->makeFromFile($storedPdfPath . '[0]', $tmpPath);

        if (! $thumbCreatedSuccessfully) {
            $this->errorMessage = 'Could not create a thumbnail';

            return;
        }

        $this->setEmployeeOnlyIfParentIsEmployeeOnly();

        /** @var Item $newItem */
        $newItem = Item::create([
            'company_id' => $company->id,
            'name' => $fileNameNoExtension,
            'thumb' => $thumbName,
            'parent_id' => ! empty($this->parentItemId) ? $this->parentItemId : null,
            'source' => $storedPdfPath,
            'employee_only' => $this->employeeOnly,
        ]);

        Storage::move($tmpPath, $newItem->thumbPath());

        $this->emitUp('itemCreated');
    }

    /**
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function render()
    {
        return view('livewire.add-pdf-form');
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
