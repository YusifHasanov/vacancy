<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EmploymentTypeResource\Pages;
use App\Models\Lookup;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\Rule;

class EmploymentTypeResource extends Resource
{
    protected static ?string $model = Lookup::class;

    protected static ?string $navigationIcon = 'heroicon-s-swatch';

    protected static ?string $navigationLabel = 'İş Növü';

    protected static ?string $navigationGroup = 'Məzmun İdarəsi';

    public static function getModelLabel(): string
    {
        return 'İş Növü';
    }

    public static function getPluralModelLabel(): string
    {
        return 'İş Növləri';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('İş Növü')
                    ->required()
                    ->maxLength(255)
                    ->rules([
                        'required',
                        Rule::unique('lookups', 'name')
                            ->where('type', 'EmploymentType')
                    ])
                    ->validationMessages([
                        'unique' => 'Bu ad artıq mövcuddur.',
                    ]),
                Forms\Components\Hidden::make('type')
                    ->default('EmploymentType'),
            ]);
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('type', 'EmploymentType');
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Növ')
                    ->searchable()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\Filter::make('EmploymentType')
                    ->query(fn (Builder $query) => $query->where('type', 'EmploymentType'))
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

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListEmploymentTypes::route('/'),
            'create' => Pages\CreateEmploymentType::route('/create'),
            'edit' => Pages\EditEmploymentType::route('/{record}/edit'),
        ];
    }
}
