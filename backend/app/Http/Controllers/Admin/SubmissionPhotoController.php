<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\SubmissionPhoto;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Sends one private photo to a signed-in admin. The route uses scoped
 * bindings, so a photo is only found through its own submission.
 */
class SubmissionPhotoController extends Controller
{
    public function show(Submission $submission, SubmissionPhoto $photo): StreamedResponse
    {
        $disk = Storage::disk('local');
        abort_unless($disk->exists($photo->path), 404);

        return $disk->response($photo->path, $photo->original_name, [
            'Content-Type' => $photo->mime_type,
            'Cache-Control' => 'private, max-age=600',
            'Content-Security-Policy' => "default-src 'none'",
        ]);
    }
}
