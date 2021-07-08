<?php

namespace App\Services;

use GraphQL\Client as GraphQlClient;
use GraphQL\Query;
use Illuminate\Support\LazyCollection;

/**
 * Class GateApi
 *
 * @package App\Services
 */
class GateApi
{
    public $newsFeedWeatherEventsConstraints;

    /**
     * @var \GraphQL\Client
     */
    protected $client;

    /**
     * GateApi constructor.
     *
     * @param string $strippedToken
     */
    public function __construct(string $strippedToken)
    {
        $graphQlClient = new GraphQlClient(
            config('services.gate.graphQL_url'), [
            'Authorization' => "Bearer $strippedToken",
        ], [
                'verify' => app(RequestHelper::class)->shouldVerifySslCert(),
            ]
        );

        $this->client = $graphQlClient;
    }

    /**
     * @return \Illuminate\Support\LazyCollection
     */
    public function employeeGrowers(): LazyCollection
    {
        $results = $this->client->runQuery((new Query('employeeGrowers'))
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
     * @return \Illuminate\Support\LazyCollection
     */
    public function managerSalespeople(): LazyCollection
    {
        $results = $this->client->runQuery((new Query('managerSalespeople'))
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
