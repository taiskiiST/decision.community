<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'laravelpassport' => [
        'host' => env('GATE_URL'),
        'client_id' => env('GATE_ID'),
        'client_secret' => env('GATE_SECRET'),
        'redirect' => env('GATE_REDIRECT'),
        'guzzle' => [
            'verify' => ! (env('APP_ENV') === 'local' || env('APP_ENV') === 'testing'),
        ]
    ],

    'gate' => [
        'url'                             => env('GATE_URL'),
        'token_url'                       => env('GATE_TOKEN_URL'),
        'graphQL_url'                     => env('GATE_GRAPH_URL'),
        'internal_graph_api_url'          => env('GATE_INTERNAL_GRAPH_API_URL'),
        'password_grant_client_id'        => env('GATE_PASSWORD_GRANT_CLIENT_ID'),
        'password_grant_client_secret'    => env('GATE_PASSWORD_GRANT_CLIENT_SECRET'),
        'client_credentials_grant_id'     => env('GATE_CLIENT_CREDENTIALS_GRANT_ID'),
        'client_credentials_grant_secret' => env('GATE_CLIENT_CREDENTIALS_GRANT_SECRET'),
    ],

    'youtube' => [
        'key' => env('YOUTUBE_DEVELOPER_KEY'),
        'url' => env('YOUTUBE_URL'),
        'embedUrl' => env('YOUTUBE_EMBED_URL')
    ]
];
