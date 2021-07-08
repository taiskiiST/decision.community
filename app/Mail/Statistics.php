<?php

namespace App\Mail;

use App\Exports\ItemVisitsExport;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Maatwebsite\Excel\Facades\Excel;

/**
 * Class ItemOfInterest
 *
 * @package App\Mail
 */
class Statistics extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    /**
     * Create a new message instance.
     *
     * @param \App\Models\User $user
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $startDate = now()->subDay()->startOfDay();
        $endDate = now()->subDay()->endOfDay();

        $fileName = 'statistics_for_user_' . $this->user->id . '.xlsx';

        Excel::store(new ItemVisitsExport(
            $this->user,
            '',
            $startDate,
            $endDate,
            null,
            true,
            true
        ), $fileName, 'statistics_emails');

        return $this->markdown('emails.statistics')
            ->attachFromStorageDisk('statistics_emails', $fileName)
            ->subject('Information DOT statistics');
    }
}
