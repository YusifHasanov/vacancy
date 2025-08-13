<?php

namespace App\Filament\Resources\SocialMediaLinksResource\Pages;

use App\Filament\Resources\SocialMediaLinksResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditSocialMediaLinks extends EditRecord
{
    protected static string $resource = SocialMediaLinksResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
