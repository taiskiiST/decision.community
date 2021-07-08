<?php /** @noinspection PhpUnhandledExceptionInspection */

namespace Tests\Feature;

use App\Http\Livewire\EmailItemForm;
use App\Mail\ItemOfInterest;
use App\Models\Company;
use App\Models\Item;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Livewire\Livewire;
use Tests\TestCase;

/**
 * Class DashboardTest
 *
 * @package Tests\Feature
 */
class EmailItemFormTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function if_email_formats_are_invalid_an_error_message_is_shown()
    {
        Mail::fake();

        $user = $this->signIn();

        $item = Item::factory()->create([
            'company_id' => $user->company_id,
        ]);

        $firstRecipient = 'wrongEmailFormat';
        $secondRecipient = 'another.wrong.format.gmail.com';

        $sendTo = "$firstRecipient;$secondRecipient";

        Livewire::test(EmailItemForm::class)
                ->set('itemId', $item->id)
                ->set('emailAddressesString', $sendTo)
                ->call('submitForm')
                ->assertSet('errorMessage', 'Wrong email format');

        Mail::assertNothingSent();
    }

    /** @test */
    public function if_there_are_whitespaces_between_recipients_they_are_trimmed()
    {
        Mail::fake();

        $user = $this->signIn();

        $item = Item::factory()->create([
            'company_id' => $user->company_id,
        ]);

        $firstRecipient = 'solagaian.sergei@yandex.ru';
        $secondRecipient = 'ssolagaian@gmail.com';

        $sendTo = "       $firstRecipient     ;      $secondRecipient           ";

        Livewire::test(EmailItemForm::class)
                ->set('itemId', $item->id)
                ->set('emailAddressesString', $sendTo)
                ->call('submitForm');

        // Assert that a mailable was sent...
        Mail::assertSent(function (ItemOfInterest $mail) use ($firstRecipient, $secondRecipient) {
            return $mail->hasTo($firstRecipient) && $mail->hasTo($secondRecipient);
        });
    }

    /** @test */
    public function if_there_are_several_recipients_an_email_is_sent_to_all_of_them()
    {
        Mail::fake();

        $user = $this->signIn();

        $item = Item::factory()->create([
            'company_id' => $user->company_id,
        ]);

        $firstRecipient = 'solagaian.sergei@yandex.ru';
        $secondRecipient = 'ssolagaian@gmail.com';

        $sendTo = "$firstRecipient;$secondRecipient";

        Livewire::test(EmailItemForm::class)
                ->set('itemId', $item->id)
                ->set('emailAddressesString', $sendTo)
                ->call('submitForm');

        // Assert that a mailable was sent...
        Mail::assertSent(function (ItemOfInterest $mail) use ($firstRecipient, $secondRecipient) {
            return $mail->hasTo($firstRecipient) && $mail->hasTo($secondRecipient);
        });
    }

    /** @test */
    public function an_item_has_to_exist()
    {
        Mail::fake();

        $company = Company::factory()->create();

        $user = $this->signIn([
            'company_id' => $company->id,
        ]);

        $item = Item::factory()->create([
            'company_id' => $company->id,
        ]);

        Livewire::test(EmailItemForm::class)
                ->set('itemId', $item->id + 777)
                ->set('emailAddressesString', 'solagaian.sergei@yandex.ru')
                ->call('submitForm')
                ->assertSet('errorMessage', 'Item not found');

        Mail::assertNothingSent();
    }

    /** @test */
    public function a_user_can_not_email_an_item_that_does_not_belong_to_their_company()
    {
        Mail::fake();

        $companyA = Company::factory()->create();

        $user = $this->signIn([
            'company_id' => $companyA->id,
        ]);

        $companyB = Company::factory()->create();

        $item = Item::factory()->create([
            'company_id' => $companyB->id,
        ]);

        Livewire::test(EmailItemForm::class)
                ->set('itemId', $item->id)
                ->set('emailAddressesString', 'solagaian.sergei@yandex.ru')
                ->call('submitForm')
                ->assertForbidden();

        Mail::assertNothingSent();
    }

    /** @test */
    public function an_user_has_to_be_authenticated_to_email_an_item()
    {
        Mail::fake();

        Livewire::test(EmailItemForm::class)
                ->call('submitForm')
                ->assertUnauthorized();

        Mail::assertNothingSent();
    }

    /** @test */
    public function email_address_is_a_required_parameter()
    {
        Mail::fake();

        $user = $this->signIn();

        Livewire::test(EmailItemForm::class)
                ->call('submitForm')
                ->assertHasErrors(['emailAddressesString' => 'required']);

        Mail::assertNothingSent();
    }

    /** @test */
    public function an_email_is_sent_after_submitting_a_form()
    {
        Mail::fake();

        $user = $this->signIn();

        $item = Item::factory()->create([
            'company_id' => $user->company_id,
        ]);

        Livewire::test(EmailItemForm::class)
                ->set('itemId', $item->id)
                ->set('emailAddressesString', 'solagaian.sergei@yandex.ru')
                ->call('submitForm');

        // Assert that a mailable was sent...
        Mail::assertSent(ItemOfInterest::class);
    }
}
