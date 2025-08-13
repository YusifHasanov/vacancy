<?php

namespace App\Filament\Resources\LanguageSkillsResource\Pages;

use App\Filament\Resources\LanguageSkillsResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditLanguageSkills extends EditRecord
{
    protected static string $resource = LanguageSkillsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
