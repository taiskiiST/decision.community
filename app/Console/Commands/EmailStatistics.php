<?php

namespace App\Console\Commands;

use App\Mail\Statistics;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Throwable;

/**
 * Class EmailStatistics
 *
 * @package App\Console\Commands
 */
class EmailStatistics extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'statistics:email';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Email statistics to managers and employees';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->alert('START: ' . now()->toCookieString() . " | $this->signature");
        $start_time = microtime(true);

        // Clean temp files created by the previous run of the command.
        $this->cleanup();

        User::thatCanAccessStatistics()->get()->each(function (User $user) {
            if (! $user->canViewStatistics()) {
                return;
            }

            $this->info('Emailing to: ' . $user->email);

            try {
                Mail::to($user->email)->send(new Statistics($user));
            } catch (Throwable $e) {
                $errorMessage = ' - error occurred while emailing: ' . $e->getMessage();

                logger(__METHOD__ . $errorMessage);

                $this->warn($errorMessage);

                return;
            }
        });

        $this->alert('END: ' . now()->toCookieString() . ' | Time elapsed (in seconds): ' . round((microtime(true) - $start_time)));

        return 0;
    }

    /**
     *
     */
    protected function cleanup(): void
    {
        $files = Storage::disk('statistics_emails')->allfiles();

        foreach ($files as $file) {
            Storage::delete($file);
        }
    }
}
