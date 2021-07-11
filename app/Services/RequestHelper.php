<?php

namespace App\Services;

use Illuminate\Support\Facades\App;

/**
 * Class RequestHelper
 *
 * @package App\Services
 */
class RequestHelper
{
    /**
     * @return string|string[]|null
     */
    public function shouldVerifySslCert() {
        return !(App::isLocal() || App::runningUnitTests());
    }
}
