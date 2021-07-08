<?php

namespace App\Services;

use App\Models\TokenScope;
use App\Models\User;
use GraphQL\Client as GraphQlClient;
use GraphQL\Query;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\LazyCollection;

/**
 * Class GateInternalApi
 *
 * @package App\Services
 */
class GateInternalApi
{
    public $newsFeedWeatherEventsConstraints;

    /**
     * @var \GraphQL\Client
     */
    protected $client;

    /**
     * GateApi constructor.
     *
     * @throws \Exception
     */
    public function __construct()
    {
        $verifyCert = app(RequestHelper::class)->shouldVerifySslCert();

        $tokenUrl = config('services.gate.token_url');

        $params = [
            'grant_type'    => 'client_credentials',
            'client_id'     => config('services.gate.client_credentials_grant_id'),
            'client_secret' => config('services.gate.client_credentials_grant_secret'),
            'scope'         => TokenScope::INTERNAL_USE,
        ];

        if ($verifyCert) {
            $response = Http::post($tokenUrl, $params);
        } else {
            $response = Http::withoutVerifying()->post($tokenUrl, $params);
        }

        if (! $response->ok()) {
            throw new \Exception('Gate rejected client credentials grant request.');
        }

        $token = json_decode((string)$response->body(), true)['access_token'];

        $graphQlClient = new GraphQlClient(
            config('services.gate.internal_graph_api_url'), [
            'Authorization' => "Bearer $token",
        ], [
                'verify' => $verifyCert,
            ]
        );

        $this->client = $graphQlClient;
    }

    /**
     * @param \App\Models\User $employee
     *
     * @return \Illuminate\Support\LazyCollection
     */
    public function employeeGrowers(User $employee): LazyCollection
    {
        $results = $this->client->runQuery((new Query('employeeGrowers'))
            ->setArguments([
                'gateUserId' => $employee->gate_user_id
            ])
            ->setSelectionSet(
                [
                    'id',
                    'email',
                ]
            ));

        $data = $results->getData();

        if (empty($data->employeeGrowers)) {
            return new LazyCollection();
        }

        return new LazyCollection($data->employeeGrowers);
    }

    /**
     * @param \App\Models\User $manager
     *
     * @return \Illuminate\Support\LazyCollection
     */
    public function managerSalespeople(User $manager): LazyCollection
    {
        $results = $this->client->runQuery((new Query('managerSalespeople'))
            ->setArguments([
                'gateUserId' => $manager->gate_user_id
            ])
            ->setSelectionSet(
                [
                    'id',
                    'email',
                ]
            ));

        $data = $results->getData();

        if (empty($data->managerSalespeople)) {
            return new LazyCollection();
        }

        return new LazyCollection($data->managerSalespeople);
    }
}
