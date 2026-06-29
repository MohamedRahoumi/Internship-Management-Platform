<?php

namespace App\Mail;

use App\Models\OffreStage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OffreStageMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public OffreStage $offre,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Votre offre de stage - OCP Group',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.offre-stage',
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromPath(storage_path('app/public/' . $this->offre->file_path))
                ->as('Offre_de_Stage_' . $this->offre->reference . '.pdf')
                ->withMime('application/pdf'),
        ];
    }
}
