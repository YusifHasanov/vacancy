<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LanguageSkillsResource\Pages;
use App\Models\Lookup;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\Rule;

class LanguageSkillsResource extends Resource
{
    protected static ?string $model = Lookup::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationLabel = 'Dil Bilikləri';
    protected static ?string $navigationGroup = 'Məzmun İdarəsi';

    public static function getModelLabel(): string
    {
        return 'Dil Biliyi';
    }

    public static function getPluralModelLabel(): string
    {
        return 'Dil Bilikləri';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Dil')
                    ->required()
                    ->maxLength(255)
                    ->rules([
                        'required',
                        Rule::unique('lookups', 'name')
                            ->where('type', 'LanguageSkills')
                    ])
                    ->validationMessages([
                        'unique' => 'Bu dil artıq mövcuddur.',
                        'required' => 'Ad tələb olunur.',
                    ]),

                Forms\Components\Hidden::make('type')
                    ->default('LanguageSkills'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Dil Bilikləri')
                    ->searchable()
                    ->sortable(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('type', 'LanguageSkills');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLanguageSkills::route('/'),
            'create' => Pages\CreateLanguageSkills::route('/create'),
            'edit' => Pages\EditLanguageSkills::route('/{record}/edit'),
        ];
    }
}
