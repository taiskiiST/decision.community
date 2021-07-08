<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Services\TokenFetcher;
use Database\Seeders\CompaniesSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

/**
 * Class Oauth2AuthenticationTest
 *
 * @package Tests\Feature
 */
class Oauth2AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function a_user_can_authenticate_via_gate()
    {
        Company::factory()->create([
            'id' => CompaniesSeeder::COALLIANCE_ID,
        ]);

        $path = route('login');

        $tokenFetcher = app(TokenFetcher::class);
        [$userEmail, $userPassword] = $this->userCredentials();

        $this->withoutExceptionHandling();

        // When the right token is supplied we should receive user info from Gate and get authenticated.
        $this->followingRedirects();
        $oauthData = $tokenFetcher->getPasswordGrantToken($userEmail, $userPassword);
        $token = $oauthData['access_token'];
        $this->assertIsString($token);

        $response = $this->withHeader('X-Authorization', "Bearer {$token}")->get($path);

        $response->assertOk();

        $this->assertTrue(Auth::check());
    }
}
