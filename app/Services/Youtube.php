<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

/**
 * Class Youtube
 *
 * @package App\Services
 */
class Youtube
{
    protected $key;

    protected $url;

    const THUMBS_QUALITY = [
        'maxres',
        'standard',
        'high',
        'medium',
        'default'
    ];

    /**
     * Youtube constructor.
     */
    public function __construct()
    {
        $this->key = config('services.youtube.key');

        $this->url = config('services.youtube.url');
    }

    /**
     * @param string $url
     *
     * @return array
     */
    public function getVideoInfo(string $url): array
    {
        $id = $this->extractIdFromUrl($url);
        if (! $id) {
            logger(__METHOD__ . " - could not extract id from url {$url}");

            return [];
        }

        $response = Http::get($this->url, [
            'key' => $this->key,
            'id' => $id,
            'part' => 'snippet',
            'fields' => 'items(id,snippet(title,thumbnails))',
        ]);

        if (! $response->successful()) {
            logger(__METHOD__ . " - request failed for url {$url}");

            return [];
        }

        $result = $response->json();
        if (empty($result['items'][0]['snippet'])) {
            logger(__METHOD__ . " - result is empty for url {$url}");

            return [];
        }

        $snippet = $result['items'][0]['snippet'];

        return [
            'title' => $snippet['title'] ?? null,
            'thumbnailUrl' => $this->chooseBestThumbUrl($snippet['thumbnails'] ?? [])
        ];
    }

    /**
     * @param string $url
     *
     * @return string|null
     */
    public function extractIdFromUrl(string $url): ?string
    {
        $parts = parse_url($url);

        if (isset($parts['query'])) {
            parse_str($parts['query'], $qs);

            if (isset($qs['v'])) {
                return $qs['v'];
            } else if (isset($qs['vi'])) {
                return $qs['vi'];
            }
        }

        if (isset($parts['path'])) {
            $path = explode('/', trim($parts['path'], '/'));

            return $path[count($path) - 1];
        }

        return null;
    }

    /**
     * @param array $thumbs
     *
     * @return string|null
     */
    protected function chooseBestThumbUrl(array $thumbs): ?string
    {
        if (empty($thumbs)) {
            return null;
        }

        foreach (self::THUMBS_QUALITY as $quality) {
            if (array_key_exists($quality, $thumbs)) {
                return $thumbs[$quality]['url'];
            }
        }

        return null;
    }
}
