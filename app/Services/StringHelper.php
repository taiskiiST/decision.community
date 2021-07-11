<?php

namespace App\Services;

/**
 * Class StringHelper
 *
 * @package App\Services
 */
class StringHelper
{
    /**
     * @param string $string
     *
     * @return string|string[]|null
     */
    public function clean(string $string) {
        $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.

        return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
    }
}
