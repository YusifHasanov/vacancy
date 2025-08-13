<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SocialMediaLinksResource\Pages;
use App\Models\Lookup;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\ButtonAction;

class SocialMediaLinksResource extends Resource
{
    protected static ?string $model = Lookup::class;

    protected static ?string $navigationIcon = 'heroicon-o-link';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make([
                    Forms\Components\TextInput::make('url_whatsapp')
                        ->label('Whatsapp Link')
                        ->required()
                        ->url()
                        ->maxLength(255)
                        ->validationMessages([
                            'required' => 'Whatsapp link tələb olunur.',
                            'url' => 'Doğru link formatı daxil edin.',
                        ])
                        ->default(function () {
                            $link = Lookup::where('type', 'Whatsapp')->first();
                            return $link ? $link->name : '';
                        }),
                ])->label('Whatsapp'),

                Forms\Components\Card::make([
                    Forms\Components\TextInput::make('url_instagram')
                        ->label('Instagram Link')
                        ->required()
                        ->url()
                        ->maxLength(255)
                        ->validationMessages([
                            'required' => 'Instagram link tələb olunur.',
                            'url' => 'Doğru link formatı daxil edin.',
                        ])
                        ->default(function () {
                            $link = Lookup::where('type', 'Instagram')->first();
                            return $link ? $link->name : '';
                        }),
                ])->label('Instagram'),

                Forms\Components\Card::make([
                    Forms\Components\TextInput::make('url_twitter')
                        ->label('Twitter (X) Link')
                        ->required()
                        ->url()
                        ->maxLength(255)
                        ->validationMessages([
                            'required' => 'Twitter link tələb olunur.',
                            'url' => 'Doğru link formatı daxil edin.',
                        ])
                        ->default(function () {
                            $link = Lookup::where('type', 'Twitter')->first();
                            return $link ? $link->name : '';
                        }),
                ])->label('Twitter (X)'),

                Forms\Components\Card::make([
                    Forms\Components\TextInput::make('url_facebook')
                        ->label('Facebook Link')
                        ->required()
                        ->url()
                        ->maxLength(255)
                        ->validationMessages([
                            'required' => 'Facebook link tələb olunur.',
                            'url' => 'Doğru link formatı daxil edin.',
                        ])
                        ->default(function () {
                            $link = Lookup::where('type', 'Facebook')->first();
                            return $link ? $link->name : '';
                        }),
                ])->label('Facebook'),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSocialMediaLinks::route('/'),
            'create' => Pages\CreateSocialMediaLinks::route('/create'),
            'edit' => Pages\EditSocialMediaLinks::route('/{record}/edit'),
        ];
    }

    public function saveSocialMediaLinks(array $data)
    {
        $socialMediaTypes = [
            'Whatsapp' => $data['url_whatsapp'] ?? null,
            'Instagram' => $data['url_instagram'] ?? null,
            'Twitter' => $data['url_twitter'] ?? null,
            'Facebook' => $data['url_facebook'] ?? null,
        ];

        foreach ($socialMediaTypes as $type => $url) {
            if (!empty($url)) { // Ensure the URL is not null or empty
                Lookup::updateOrCreate(
                    ['type' => $type],
                    ['name' => $url, 'type' => $type]
                );
            }
        }

        Filament::notify('success', 'Sosial media linkləri uğurla yadda saxlanıldı.');
    }
}
