<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WorkScheduleResource\Pages;
use App\Models\Lookup;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\Rule;

class WorkScheduleResource extends Resource
{
    protected static ?string $model = Lookup::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationLabel = 'İş Qrafikləri';

    protected static ?string $navigationGroup = 'Məzmun İdarəsi';

    public static function getModelLabel(): string
    {
        return 'İş Qrafiki';
    }

    public static function getPluralModelLabel(): string
    {
        return 'İş Qrafikləri';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('İş qrafiki adı')
                    ->required()
                    ->maxLength(255)
                    ->rules([
                        'required',
                        Rule::unique('lookups', 'name')
                            ->where('type', 'WorkSchedule')
                    ])
                    ->validationMessages([
                        'unique' => 'Bu ad artıq mövcuddur.',
                        'required' => 'İş qrafiki adı tələb olunur.',
                    ]),

                Forms\Components\Hidden::make('type')
                    ->default('WorkSchedule'),
            ]);
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('type', 'WorkSchedule');
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Qrafik')
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

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListWorkSchedules::route('/'),
            'create' => Pages\CreateWorkSchedule::route('/create'),
            'edit' => Pages\EditWorkSchedule::route('/{record}/edit'),
        ];
    }
}
