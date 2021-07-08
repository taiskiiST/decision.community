<?php

namespace App\Extensions\SocialiteProviders\LaravelPassport;

/**
 * Class ProviderWithGuzzleAdditionalKey
 *
 * @package App\Extensions\SocialiteProviders\LaravelPassport
 */
class ProviderWithGuzzleAdditionalKey extends \SocialiteProviders\LaravelPassport\Provider
{
    /**
     * @return array|string[]
     */
    public static function additionalConfigKeys()
    {
        return array_merge(parent::additionalConfigKeys(), ['guzzle']);
    }
}
