<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ExperienceLevelResource\Pages;
use App\Filament\Resources\ExperienceLevelResource\RelationManagers;
use App\Models\Lookup;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Hidden;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\Rule;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;

class ExperienceLevelResource extends Resource
{
    protected static ?string $model = Lookup::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationLabel = 'Təcrübə Səviyyələri';
    protected static ?string $navigationGroup = 'Məzmun İdarəsi';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                    ->label('Təcrübə Səviyyəsi adı')
                    ->required()
                    ->maxLength(255)
                    ->rules([
                        'required',
                        Rule::unique('lookups', 'name')->where('type', 'ExperienceLevel')
                    ])
                    ->validationMessages([
                        'unique' => 'Bu təcrübə səviyyəsi adı artıq mövcuddur.',
                        'required' => 'Təcrübə səviyyəsi adı tələb olunur.',
                    ]),
                Hidden::make('type')
                    ->default('ExperienceLevel'),
            ]);
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('type', 'ExperienceLevel');
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Təcrübə Səviyyəsi')
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

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListExperienceLevels::route('/'),
            'create' => Pages\CreateExperienceLevel::route('/create'),
            'edit' => Pages\EditExperienceLevel::route('/{record}/edit'),
        ];
    }
    public static function getModelLabel(): string
    {
        return 'Təcrübə Səviyyəsi';
    }

    public static function getPluralModelLabel(): string
    {
        return 'Təcrübə Səviyyələri';
    }
}
