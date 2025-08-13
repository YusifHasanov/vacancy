<?php

namespace App\Filament\Resources\SocialMediaLinksResource\Pages;

use App\Filament\Resources\SocialMediaLinksResource;
use Filament\Resources\Pages\CreateRecord;
use Filament\Pages\Actions\ButtonAction;
use App\Models\Lookup;
use Filament\Facades\Filament;

class CreateSocialMediaLinks extends CreateRecord
{
    protected static string $resource = SocialMediaLinksResource::class;

    protected function getActions(): array
    {
        return [
            ButtonAction::make('save')
                ->label('Yadda saxla')
                ->action(function ($data) {
                    $this->saveSocialMediaLinks($data);
                })
                ->icon('heroicon-o-check'),
        ];
    }

    public function saveSocialMediaLinks(array $data)
    {
        $socialMediaTypes = [
            'Whatsapp'  => $data['url_whatsapp'] ?? null,
            'Instagram' => $data['url_instagram'] ?? null,
            'Twitter'   => $data['url_twitter'] ?? null,
            'Facebook'  => $data['url_facebook'] ?? null,
        ];

        foreach ($socialMediaTypes as $type => $url) {
            if (!empty($url) && filter_var($url, FILTER_VALIDATE_URL)) {
                Lookup::create([
                    'name' => $url,
                    'type' => $type,
                ]);
            }
        }

        Filament::notify('success', 'Social media links saved successfully.');
    }
}
