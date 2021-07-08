<?php

namespace Tests\Unit;

use App\Services\Youtube;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class YoutubeTest extends TestCase
{
    use RefreshDatabase;

    /** @test
     */
    public function youtube_api_works_right()
    {
        $youtube = app(Youtube::class);

        $this->assertEquals([
            'title' => 'Start Your Ag Career as a Co-Alliance Field Scout',
            'thumbnailUrl' => 'https://i.ytimg.com/vi/haKKtOHs-XM/hqdefault.jpg'
        ], $youtube->getVideoInfo('https://www.youtube.com/watch?v=haKKtOHs-XM'));
    }
}
