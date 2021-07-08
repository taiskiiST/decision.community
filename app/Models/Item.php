<?php

namespace App\Models;

use App\Http\Livewire\ItemsList;
use App\Services\Youtube;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Class Item
 *
 * @property int company_id
 * @property int id
 * @property int parent_id
 * @property string name
 * @property bool is_category
 * @property string source
 * @property bool employee_only
 * @property \App\Models\Company company
 * @property string thumb
 * @package App\Models
 * @method static where(string $string, mixed $id)
 */
class Item extends Model
{
    use HasFactory;

    const TYPE_YOUTUBE_VIDEO = 'YOUTUBE_VIDEO';

    const TYPE_PDF = 'PDF';

    /**
     * @var array
     */
    protected $guarded = [];

    /**
     * @return string
     */
    public function path(): string
    {
        return "/items/{$this->id}";
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function visits(): HasMany
    {
        return $this->hasMany(ItemVisit::class);
    }

    /**
     * @param \App\Models\User $user
     */
    public function addVisit(User $user): void
    {
        if ((int)$this->company_id !== (int)$user->company_id) {
            return;
        }

        $this->visits()->create([
            'user_id' => $user->id,
            'time' => now(),
        ]);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function favoredBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'users_favorites')->withTimestamps();
    }

    /**
     * @param \App\Models\User $user
     *
     * @return bool
     */
    public function isFavoredBy(User $user): bool
    {
        return $this->favoredBy()->pluck('user_id')->contains($user->id);
    }

    /**
     * @param \Illuminate\Database\Eloquent\Builder $builder
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeFirstLevel(Builder $builder): Builder
    {
        return $builder->where('parent_id', null);
    }

    /**
     * @param \Illuminate\Database\Eloquent\Builder $builder
     * @param string $sortBy
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSortBy(Builder $builder, string $sortBy): Builder
    {
        return $builder->when($sortBy === ItemsList::SORT_BY_LATEST, function (Builder $builder) {
            return $builder->orderBy('updated_at', 'desc');
        })->when($sortBy === ItemsList::SORT_ALPHABETICALLY, function (Builder $builder) {
            return $builder->orderBy('name');
        });
    }

    /**
     * @param \Illuminate\Database\Eloquent\Builder $builder
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeExcludeEmployeeOnlyItems(Builder $builder): Builder
    {
        return $builder->where('employee_only', false);
    }

    /**
     * @return bool
     */
    public function isCategory(): bool
    {
        return $this->is_category;
    }

    /**
     * @return bool
     */
    public function isYoutubeVideo(): bool
    {
        return ! $this->isCategory() && ! $this->isPdf();
    }

    /**
     * @return bool
     */
    public function isPdf(): bool
    {
        return ! $this->isCategory() && Str::endsWith($this->source, '.pdf');
    }

    /**
     * @return mixed
     */
    public function items(): Collection
    {
        return Item::where('parent_id', $this->id)->get();
    }

    /**
     * @return mixed
     */
    public function countItems(): int
    {
        return Item::where('parent_id', $this->id)->count();
    }

    /**
     * @return mixed
     */
    public function countItemsAvailableToUser(): int
    {
        $user = auth()->user();

        if (! $user) {
            return 0;
        }

        return Item::where('parent_id', $this->id)
                   ->when(! $user->canViewEmployeeItems(), function (Builder $builder) {
                       return $builder->excludeEmployeeOnlyItems();
                   })
                   ->count();
    }

    /**
     * @return bool
     */
    public function isEmployeeOnly(): bool
    {
        return $this->employee_only;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function setEmployeeOnlyForChildrenIfItemIsEmployeeOnly()
    {
        if (! $this->isCategory() || ! $this->isEmployeeOnly()) {
            return new Collection();
        }

        return $this->getAllChildren()->each(function (Item $item) {
            $item->employee_only = true;

            Item::where('id', $item->id)->update([
                'employee_only' => true
            ]);

            $item->addProperties();
        });
    }

    /**
     * @return string
     */
    public function thumbUrl(): string
    {
        return Storage::url($this->company->itemsThumbsPath() . "/{$this->thumb}");
    }

    /**
     * @return string
     */
    public function thumbPath(): string
    {
        return $this->company->itemsThumbsPath() . "/{$this->thumb}";
    }

    /**
     * @return string|null
     */
    public function pdfPath(): ?string
    {
        if (! $this->isPdf()) {
            return null;
        }

        return $this->source;
    }

    /**
     * @return string
     */
    public function pdfUrl(): string
    {
        if (! $this->isPdf()) {
            return '#';
        }

        return route('items.download', $this);
    }

    /**
     * @return string
     */
    public function youtubeVideoEmbedUrl(): string
    {
        if (! $this->isYoutubeVideo() || ! $this->source) {
            return '';
        }

        $videoId = app(Youtube::class)->extractIdFromUrl($this->source);

        if (! $videoId) {
            return '';
        }

        return config('services.youtube.embedUrl') . "/{$videoId}";
    }

    /**
     * @return Collection
     */
    public function getAllChildren(): Collection
    {
        $query = Item::where('parent_id', $this->id)
                     ->unionAll(
                         Item::select('items.*')
                             ->join('tree', 'tree.id', '=', 'items.parent_id')
                     );

        return Item::from('tree')
                    ->withRecursiveExpression('tree', $query)
                    ->get();
    }

    /**
     * @return Collection
     */
    public function getAllParents(): Collection
    {
        $query = Item::where('id', $this->parent_id)
                     ->unionAll(
                         Item::select('items.*')
                             ->join('tree', 'items.id',  '=', 'tree.parent_id' )
                     );

        return Item::from('tree')
                   ->withRecursiveExpression('tree', $query)
                   ->get();
    }

    /**
     * @return bool
     */
    public function areAllAncestorsUnRestricted(): bool
    {
        $out = true;

        $this->getAllParents()->each(function (Item $item) use (&$out) {
            $out = $out && ! $item->isEmployeeOnly();

            if (! $out) {
                return false;
            }
        });

        return $out;
    }

    /**
     * @return \App\Models\Item
     */
    public function addProperties(): Item
    {
        $this->isPdf = $this->isPdf();

        $this->isYoutubeVideo = $this->isYoutubeVideo();

        $this->isEmployeeOnly = $this->isEmployeeOnly();

        $this->thumbUrl = $this->thumbUrl();

        if (empty($this->parent_id)) {
            $this->parent_id = 0;
        }

        return $this;
    }

    /**
     * @param array $deletedIds
     *
     * @return array
     * @throws \Exception
     */
    public function deleteWithFiles(array $deletedIds = []): array
    {
        $children = $this->items();

        if ($children->isNotEmpty()) {
            $children->each(function (Item $child) use (&$deletedIds) {
                $deletedIds = array_merge($child->deleteWithFiles($deletedIds));
            });
        }

        $thumbPath = $this->thumbPath();
        if (Storage::exists($thumbPath)) {
            Storage::delete($thumbPath);
        }

        $pdfPath = $this->pdfPath();
        if (Storage::exists($pdfPath)) {
            Storage::delete($pdfPath);
        }

        $success = $this->delete();
        if ($success) {
            $deletedIds[] = $this->id;
        }

        return $deletedIds;
    }
}
