<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Class ThumbMaker
 *
 * @package App\Services
 */
class ThumbMaker
{
  /**
   * @param string $imageUrl
   * @param string $outputPath
   *
   * @return bool
   */
  public function makeFromImageUrl(string $imageUrl, string $outputPath): bool
  {
    $response = Http::get($imageUrl);
    if ($response->failed()) {
      logger(
        __METHOD__ .
          ' - request failed, client error: ' .
          $response->clientError() .
          ', server error: ' .
          $response->serverError()
      );

      return false;
    }

    $originalImagePath = 'tmp/' . Str::uuid()->toString() . '.jpg';

    $originalImageSavedSuccessfully = Storage::put(
      $originalImagePath,
      $response->body()
    );
    if (!$originalImageSavedSuccessfully) {
      logger(__METHOD__ . ' - failed to save original image');

      return false;
    }

    return $this->makeFromFile($originalImagePath, $outputPath, true);
  }

  /**
   * @param string $filePath
   * @param string $outputFilePath
   * @param bool $removeOriginalFile
   *
   * @return bool
   */
  public function makeFromFile(
    string $filePath,
    string $outputFilePath,
    bool $removeOriginalFile = false
  ): bool {
    $fileFullPath = storage_path("app/{$filePath}");
    $outputFileFullPath = storage_path("app/{$outputFilePath}");

    $command = "/usr/bin/convert -define jpeg:size=256x256 {$fileFullPath} -thumbnail 256x256^ -gravity center -extent 256x256 {$outputFileFullPath}";

    exec("$command", $output, $returnVar);

    if ($removeOriginalFile) {
      Storage::delete($filePath);
    }

    if ($returnVar !== 0) {
      logger(
        __METHOD__ .
          " - error occurred, filePath: {$filePath}, output path: {$outputFilePath}, return var: {$returnVar}, output:",
        $output
      );
    }

    return $returnVar === 0;
  }
}
