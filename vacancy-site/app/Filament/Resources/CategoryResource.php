<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CategoryResource\Pages;
use App\Filament\Resources\CategoryResource\RelationManagers;
use App\Models\Category;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static ?string $navigationIcon = 'heroicon-m-queue-list';

    protected static ?string $navigationLabel = 'Kateqoriyalar';

    // Customize the resource group name in the sidebar (optional)
    protected static ?string $navigationGroup = 'Məzmun İdarəsi';

    public static function getModelLabel(): string
    {
        return 'Kateqoriya';
    }

    public static function getPluralModelLabel(): string
    {
        return 'Kateqoriyalar';
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('name')
                ->label('Kateqoriya adı')
                ->required()
                ->unique(
                    table: Category::class,
                    column: 'name',
                    ignorable: fn($record) => $record
                )
                ->maxLength(255)
                ->validationMessages([
                    'unique' => 'Bu kateqoriya adı artıq mövcuddur. Fərqli ad daxil edin.'
                ])
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('id')->label('ID')->sortable(),
            TextColumn::make('name')->label('Kateqoriya adı')->sortable()->searchable(),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCategories::route('/'),
            'create' => Pages\CreateCategory::route('/create'),
            'edit' => Pages\EditCategory::route('/{record}/edit'),
        ];
    }
}
