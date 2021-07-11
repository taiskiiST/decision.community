<?php

namespace App\Services;

/**
 * Class Tree
 *
 * @package App\Services
 */
class Tree
{
    /**
     * @param array $items
     * @param string $pidKey
     * @param string $idKey
     * @param int $firstParentId
     *
     * @return array
     */
    public function build(array $items, string $pidKey, string $idKey, int $firstParentId = 0): array
    {
        if (empty($items)) {
            return [];
        }

        $grouped = [];

        foreach ($items as $item){
            $grouped[$item[$pidKey]][] = $item;
        }

        if (empty($grouped)) {
            return [];
        }

        $fnBuilder = function($siblings) use (&$fnBuilder, $grouped, $idKey) {
            foreach ($siblings as $k => $sibling) {
                $id = $sibling[$idKey];

                if(isset($grouped[$id])) {
                    $sibling['children'] = $fnBuilder($grouped[$id]);
                }

                $siblings[$k] = $sibling;
            }

            return $siblings;
        };

        return $fnBuilder($grouped[$firstParentId] ?? []);
    }
}
