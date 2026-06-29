<?php

if (! function_exists('base64_image')) {
    function base64_image(string $path): string
    {
        if (! file_exists($path) || ! is_readable($path)) {
            return '';
        }

        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $mime = match (strtolower($extension)) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            default => 'image/jpeg',
        };

        $contents = file_get_contents($path);

        if ($contents === false) {
            return '';
        }

        return 'data:' . $mime . ';base64,' . base64_encode($contents);
    }
}
