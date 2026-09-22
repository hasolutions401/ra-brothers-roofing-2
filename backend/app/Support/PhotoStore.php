<?php

namespace App\Support;

use App\Models\Submission;
use App\Models\SubmissionPhoto;
use GdImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Saves uploaded roof photos on the private disk.
 *
 * The website already shrinks photos before sending them. Re-encoding here
 * as well means every stored file is a plain JPEG the server produced
 * itself: camera metadata (including GPS location) is removed and nothing
 * but pixel data survives from the upload. Without GD the validated
 * original is kept instead.
 */
class PhotoStore
{
    public function store(Submission $submission, UploadedFile $file): SubmissionPhoto
    {
        $directory = $submission->photoDirectory();
        $jpeg = $this->reencode($file);

        if ($jpeg !== null) {
            $path = $directory.'/'.Str::uuid().'.jpg';
            Storage::disk('local')->put($path, $jpeg);
            $mime = 'image/jpeg';
            $size = strlen($jpeg);
        } else {
            $path = $file->storeAs($directory, Str::uuid().'.'.($file->guessExtension() ?: 'jpg'), 'local');
            $mime = (string) $file->getMimeType();
            $size = (int) $file->getSize();
        }

        return $submission->photos()->create([
            'path' => $path,
            'original_name' => mb_substr($file->getClientOriginalName(), 0, 255) ?: 'photo.jpg',
            'mime_type' => $mime,
            'size' => $size,
        ]);
    }

    private function reencode(UploadedFile $file): ?string
    {
        if (! function_exists('imagecreatefromstring')) {
            return null;
        }

        $source = @imagecreatefromstring((string) file_get_contents($file->getRealPath()));

        if (! $source instanceof GdImage) {
            return null;
        }

        $max = (int) config('leads.options.photos.maxDimension');
        [$width, $height] = [imagesx($source), imagesy($source)];
        $scale = min(1, $max / max($width, $height));
        [$w, $h] = [max(1, (int) round($width * $scale)), max(1, (int) round($height * $scale))];

        // White background, so transparent PNG areas do not turn black.
        $canvas = imagecreatetruecolor($w, $h);
        imagefill($canvas, 0, 0, imagecolorallocate($canvas, 255, 255, 255));
        imagecopyresampled($canvas, $source, 0, 0, 0, 0, $w, $h, $width, $height);

        ob_start();
        imagejpeg($canvas, null, 82);

        return (string) ob_get_clean();
    }
}
