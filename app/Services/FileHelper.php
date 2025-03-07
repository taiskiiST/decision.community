<?php

namespace App\Services;

use Symfony\Component\HttpFoundation\File\File;

/**
 * Class FileHelper
 *
 * @package App\Services
 */
class FileHelper
{
  /**
   *
   * @param \Symfony\Component\HttpFoundation\File\File $file
   *
   * @return string
   */
  public function getFileNameWithoutExtension(File $file): string
  {
    $fileInfo = pathinfo($file->getClientOriginalName());

    return $fileInfo['filename'] ?? '';
  }
}
