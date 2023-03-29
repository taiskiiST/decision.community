<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemovePollIdAndCountOfVotingCurrentAndListOfAllCurrentUsersFromQuorums extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('quorums', function (Blueprint $table) {
            $table->dropForeign('quorums_poll_id_foreign');
            $table->dropColumn('poll_id');
            $table->dropColumn('count_of_voting_current');
            $table->dropColumn('list_of_all_current_users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('quorums', function (Blueprint $table) {
            //
        });
    }
}
