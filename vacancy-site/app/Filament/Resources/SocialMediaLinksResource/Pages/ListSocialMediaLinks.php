<?php

namespace App\Filament\Resources\SocialMediaLinksResource\Pages;

use App\Filament\Resources\SocialMediaLinksResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListSocialMediaLinks extends ListRecords
{
    protected static string $resource = SocialMediaLinksResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
