<?php

namespace App\Filament\Resources\LocationsResource\Pages;

use App\Filament\Resources\LocationResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListLocation extends ListRecords
{
    protected static string $resource = LocationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
