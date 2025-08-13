<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LocationsResource\Pages;
use App\Models\Lookup;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\Rule;

class LocationResource extends Resource
{
    protected static ?string $model = Lookup::class;

    protected static ?string $navigationIcon = 'heroicon-s-map-pin';

    protected static ?string $navigationLabel = 'Şəhər/Bölgə';

    protected static ?string $navigationGroup = 'Məzmun İdarəsi';

    public static function getModelLabel(): string
    {
        return 'Şəhər/Bölgə';
    }

    public static function getPluralModelLabel(): string
    {
        return 'Şəhər/Bölgə';
    }

    /**
     * Configure the form for creating and editing locations.
     */
    public static function form(Form $form): Form
    {
        return $form->schema([

            TextInput::make('name')
                ->label('Ad')
                ->required()
                ->maxLength(255)
                ->rules([
                    'required',
                    Rule::unique('lookups', 'name')
                        ->where('type', 'Location')
                ])
                ->validationMessages([
                    'unique' => 'Bu ad artıq mövcuddur.',
                ]),

            Hidden::make('type')
                ->default('Location'),
        ]);
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('type', 'Location');
    }

    /**
     * Configure the table view for the locations.
     */
    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')
                ->label('Şəhər/Bölgə')
                ->searchable()
                ->sortable(),
        ])
            ->actions([
                EditAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    /**
     * Define the pages for this resource.
     */
    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLocation::route('/'),
            'create' => Pages\CreateLocation::route('/create'),
            'edit' => Pages\EditLocation::route('/{record}/edit'),
        ];
    }
}
