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
 * @property int id
 * @property int parent_id
 * @property string name
 * @property bool is_category
 * @property string source
 * @property string thumb
 * @property mixed phone
 * @property mixed address
 * @property mixed pin
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
     * @return bool
     */
    public function isCategory(): bool
    {
        return $this->is_category;
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
                   ->count();
    }

    /**
     * @return string
     */
    public function thumbUrl(): string
    {
        return Storage::url('public/images/items_thumbs' . "/{$this->thumb}");
    }

    /**
     * @return string
     */
    public function thumbPath(): string
    {
        return 'public/images/items_thumbs' . "/{$this->thumb}";
    }

    /**
     * @return string|null
     */
    public function pdfPath(): ?string
    {
        return $this->source;
    }

    /**
     * @return string
     */
    public function pdfUrl(): string
    {
        return route('items.download', $this);
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
     * @return \App\Models\Item
     */
    public function addProperties(): Item
    {
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
