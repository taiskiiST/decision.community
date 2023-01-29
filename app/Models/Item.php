<?php

namespace App\Models;

use App\Http\Livewire\ItemsList;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

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
 * @property mixed description
 * @property mixed address
 * @property mixed cost
 * @property mixed elementary
 * @property array|mixed currentCommitteeMembers
 * @property array|mixed currentPresidiumMembers
 * @property mixed|null currentChairman
 * @property mixed chairman
 * @property array|mixed currentRevCommitteeMembers
 * @property array|mixed currentRevPresidiumMembers
 * @property mixed|null currentRevChairman
 * @property mixed revChairman
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
        return $builder->where('parent_id', null)
            ->where('company_id', session('current_company')->id);
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
        return Item::where('parent_id', $this->id)->where('company_id', session('current_company')->id)->get();
    }

    /**
     * @return mixed
     */
    public function countItems(): int
    {
        return Item::where('parent_id', $this->id)
            ->where('company_id', session('current_company')->id)
            ->count();
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
            ->where('company_id', session('current_company')->id)
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
            ->where('company_id', session('current_company')->id)
                     ->unionAll(
                         Item::select('items.*')
                             ->join('tree', 'tree.id', '=', 'items.parent_id')
                     );
        return Item::from('tree')
                    ->withRecursiveExpression('tree', $query)
                    ->get();
    }

    public function getDirectChildren(): Collection
    {
        return Item::where('parent_id', $this->id)->get();
    }

    /**
     * @return Collection
     */
    public function getAllNonCategoryChildren(): Collection
    {
        $query = Item::where('parent_id', $this->id)
            ->where('company_id', session('current_company')->id)
                     ->unionAll(
                         Item::select('items.*')
                             ->join('tree', 'tree.id', '=', 'items.parent_id')
                     );

        return Item::from('tree')
                   ->withRecursiveExpression('tree', $query)
                   ->get()->filter(function ($item) {
                       return ! $item->is_category;
            });
    }

    /**
     * @return Collection
     */
    public function getAllParents(): Collection
    {
        $query = Item::where('id', $this->parent_id)
            ->where('company_id', session('current_company')->id)
                     ->unionAll(
                         Item::select('items.*')
                             ->join('tree', 'items.id',  '=', 'tree.parent_id' )
                     );
//        foreach (){
//
//        }
        $search_items = Item::where("parent_id", "=",$this->parent_id)
            ->where('company_id', session('current_company')->id)
            ->where("is_category",1)
                            ->unionAll(Item::where("parent_id", "=",$this->id)->where("is_category",1))
                            ->distinct()
                            ->get();

        $search_items = Item::where("parent_id", "=",99999999999)->get();

        //dd($search_items);

        //dd($query->get());
        return $search_items;

//        return Item::from('tree')
//                   ->withRecursiveExpression('tree', $query)
//                   ->get();

//        return Item::from('tree')
//            ->withExpression('tree', $query)
//            ->get();
        //withExpression
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
     * @return $this
     */
    public function addCurrentMembersProperties(): Item
    {
        $committeeMembersByIds = CommitteeMember::get()->groupBy('committee_id');

        $presidiumMembersByIds = PresidiumMember::get()->groupBy('presidium_id');

        $chairmenByIds = Chairman::get()->keyBy('chair_id');

        $this->currentCommitteeMembers = $committeeMembersByIds->has($this->id)
            ? $committeeMembersByIds->get($this->id)->pluck('member_id')->toArray()
            : [];

        $this->currentPresidiumMembers = $presidiumMembersByIds->has($this->id)
            ? $presidiumMembersByIds->get($this->id)->pluck('member_id')->toArray()
            : [];

        $this->currentChairman = $chairmenByIds->has($this->id)
            ? $chairmenByIds->get($this->id)->man_id
            : null;

        return $this;
    }

    /**
     * @return $this
     */
    public function addCurrentRevMembersProperties(): Item
    {
        $revCommitteeMembersByIds = RevCommitteeMember::get()->groupBy('rev_committee_id');

        $revPresidiumMembersByIds = RevPresidiumMember::get()->groupBy('rev_presidium_id');

        $revChairmenByIds = RevChairman::get()->keyBy('rev_chair_id');

        $this->currentRevCommitteeMembers = $revCommitteeMembersByIds->has($this->id)
            ? $revCommitteeMembersByIds->get($this->id)->pluck('member_id')->toArray()
            : [];

        $this->currentRevPresidiumMembers = $revPresidiumMembersByIds->has($this->id)
            ? $revPresidiumMembersByIds->get($this->id)->pluck('member_id')->toArray()
            : [];

        $this->currentRevChairman = $revChairmenByIds->has($this->id)
            ? $revChairmenByIds->get($this->id)->man_id
            : null;

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

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    /**
     * @param \App\Models\Question $question
     * @param \App\Models\Answer $answer
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function vote(Question $question, Answer $answer): Model
    {
        return $this->votes()->updateOrCreate([
            'question_id' => $question->id,
            'answer_id' => $answer->id
        ], [
            'question_id' => $question->id,
            'answer_id' => $answer->id
        ]);
    }

    /**
     * @return bool
     */
    public function isElementary(): bool
    {
        return $this->elementary;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function committeeMembers(): HasMany
    {
        return $this->hasMany(CommitteeMember::class, 'committee_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function presidiumMembers(): HasMany
    {
        return $this->hasMany(PresidiumMember::class, 'presidium_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function chairman(): HasOne
    {
        return $this->hasOne(Chairman::class, 'chair_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function revCommitteeMembers(): HasMany
    {
        return $this->hasMany(RevCommitteeMember::class, 'rev_committee_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function revPresidiumMembers(): HasMany
    {
        return $this->hasMany(RevPresidiumMember::class, 'rev_presidium_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function revChairman(): HasOne
    {
        return $this->hasOne(RevChairman::class, 'rev_chair_id', 'id');
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function getTopHierarchy(): Collection
    {
        $out = new Collection();

        $item = $this;

        $level = 0;

        while ($item->parent_id) {
            $out->push([
                'level' => $level++,
                'item' => $item,
                'chairman' => Item::find($item->chairman->man_id ?? null),
            ]);

            $item = Item::find($item->parent_id);
        }

        $out->push([
            'level' => ++$level,
            'item' => $item,
            'chairman' => Item::find($item->chairman->man_id ?? null),
        ]);

        return $out;
    }

    public function getPeopleThatDidNotVote(Collection $peopleThatDidNotVote): Collection
    {
        return $this->getAllNonCategoryChildren()->filter(function ($child) use ($peopleThatDidNotVote) {
            return in_array($child->id, $peopleThatDidNotVote->pluck('id')->toArray());
        });
    }
}
