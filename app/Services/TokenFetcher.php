<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

/**
 * Class TokenFetcher
 *
 * @package App\Services
 */
class TokenFetcher
{
    /**
     * @param string $userEmail
     * @param string $userPassword
     * @param string $scope
     *
     * @return array|null
     */
    public static function getPasswordGrantToken(string $userEmail, string $userPassword, string $scope = ''): ?array
    {
        $params = [
            'grant_type'    => 'password',
            'client_id'     => config('services.gate.password_grant_client_id'),
            'client_secret' => config('services.gate.password_grant_client_secret'),
            'username'      => $userEmail,
            'password'      => $userPassword,
            'scope'         => $scope,
        ];

        $tokenUrl = config('services.gate.token_url');

        if (config('services.laravelpassport.guzzle.verify')) {
            $response = Http::post($tokenUrl, $params);
        } else {
            $response = Http::withoutVerifying()->post($tokenUrl, $params);
        }

        $oauthData = json_decode((string)$response->body(), true);

        if (empty($oauthData['access_token'])) {
            return null;
        }

        return $oauthData;
    }
}
