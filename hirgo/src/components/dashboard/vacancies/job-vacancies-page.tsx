"use client";

import {useState, useMemo, useEffect, useCallback, useRef} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Plus, Search, X, Loader2} from 'lucide-react';
import JobVacancyCards from "./job-vacancy-cards";
import {JobVacancy, VacancyStatus} from "@/types/job-vacancy";
import {useMediaQuery} from "@/hooks/use-media-query";
import {Badge} from "@/components/ui/badge";
import Pagination from "@/components/custom-pagination";
import JobVacancyTable from "./job-vacancy-table";
import {useRouter} from "next/navigation";
import {useFilterVacancies} from "@/app/features/vacancy/useVacancy";
import {Pageable} from "@/app/features/vacancy/vacancyApi";
import {useCategoryById, useCategories} from "@/app/features/category";

// Number of items to display per page
const ITEMS_PER_PAGE = 10;

// Custom hook to ensure component is mounted
function useIsMounted() {
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    return isMounted;
}

interface CategoryOption {
    id: string;
    name: string;
}

// Component to fetch a single category and update the category map
function CategoryFetcher({
                             categoryId,
                             onCategoryLoaded
                         }: {
    categoryId: number;
    onCategoryLoaded: (id: number, name: string) => void
}) {
    const {category, error} = useCategoryById(categoryId);

    useEffect(() => {
        if (category?.name) {
            console.log(`Category ${categoryId} loaded: ${category.name}`);
            onCategoryLoaded(categoryId, category.name);
        } else if (error) {
            console.error(`Error loading category ${categoryId}:`, error);
            onCategoryLoaded(categoryId, `Category ${categoryId}`);
        }
    }, [category, categoryId, error, onCategoryLoaded]);

    return null; // This is a non-visual component
}

// Custom hook to manage category ID to name mapping using the existing Redux infrastructure
function useCategoriesById(categoryIds: number[]) {
    const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
    const [pendingIds, setPendingIds] = useState<number[]>([]);

    // Setup pending IDs that need to be fetched
    useEffect(() => {
        const newPendingIds = categoryIds.filter(id => !categoryMap[id]);
        if (newPendingIds.length > 0) {
            setPendingIds(newPendingIds);
        }
    }, [categoryIds, categoryMap]);

    // Callback for when a category is loaded
    const handleCategoryLoaded = useCallback((id: number, name: string) => {
        setCategoryMap(prev => ({
            ...prev,
            [id]: name
        }));

        setPendingIds(prev => prev.filter(pendingId => pendingId !== id));
    }, []);

    return {
        categoryMap,
        pendingIds,
        handleCategoryLoaded
    };
}

export default function JobVacanciesPage() {
    console.log("⚡ JobVacanciesPage rendered");

    const router = useRouter();
    const isInitialMount = useRef(true);
    const isMounted = useIsMounted();
    const [isClient, setIsClient] = useState(false);
    const [isFiltersInitialized, setIsFiltersInitialized] = useState(false);

    // Use the getAllCategories hook to fetch all categories
    const {
        categories: allCategories,
        isLoading: isCategoriesLoading
    } = useCategories();

    // For all vacancies display (both initial and filtered)
    const {
        filter: filterVacancies,
        vacancies: filteredVacancies = [],
        totalItems = 0,
        totalPages = 0,
        isLoading: isFilterLoading,
        error: filterError,
    } = useFilterVacancies();

    const isDesktop = useMediaQuery("(min-width: 768px)");

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
    const [statusFilters, setStatusFilters] = useState<VacancyStatus[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(ITEMS_PER_PAGE);
    const [isFiltered, setIsFiltered] = useState(false);

    // Derived state - simplify now that we only use filter loading
    const isLoading = isFilterLoading || isCategoriesLoading;
    const error = filterError;

    // Log filtered vacancies for debugging
    useEffect(() => {
        console.log(`📋 Vacancies loaded: ${filteredVacancies.length}`);
        console.log(`📋 Current filter state: isFiltered=${isFiltered}`);
        console.log(`📋 Pagination info: page=${currentPage}, totalPages=${totalPages}, totalItems=${totalItems}`);
    }, [filteredVacancies, isFiltered, currentPage, totalPages, totalItems]);

    // Set isClient and trigger initial data fetch on mount (only once)
    useEffect(() => {
        if (isInitialMount.current && isMounted.current) {
            console.log("🔄 Component mounted on client, initializing");
            setIsClient(true);
            isInitialMount.current = false;
            setIsFiltersInitialized(true);

            // Log categories data
            console.log("🔄 All categories from Redux:", allCategories?.length || 0);
            console.log("🔄 Using page size:", pageSize);

            // Initialize with an empty filter request
            console.log("🔄 Initial mount - sending empty filter request");
            const emptyFilter = {};
            const initialPage: Pageable = {
                page: currentPage,
                size: pageSize,
                sort: ["createdAt,desc"]
            };

            // Call filter API with empty criteria for initial load
            filterVacancies(emptyFilter, initialPage)
                .then(result => {
                    console.log("🔄 Initial data loaded:", result);
                    if (Array.isArray(result) && result.length > 0) {
                        console.log(`🔄 Received ${result.length} vacancies in initial load`);
                        console.log(`🔄 Pagination status: currentPage=${currentPage}, totalPages=${totalPages}, totalItems=${totalItems}`);
                    } else {
                        console.log("🔄 No vacancies received in initial load");
                    }
                })
                .catch(err => {
                    console.error("🔄 Error loading initial data:", err);
                });
        }
    }, [filterVacancies, pageSize, allCategories, currentPage, totalPages, totalItems, isMounted]);

    // Extract unique category IDs from vacancies for mapping
    const uniqueCategoryIds = useMemo(() => {
        return [...new Set(filteredVacancies
            .filter(v => v.categoryId)
            .map(v => v.categoryId))];
    }, [filteredVacancies]);

    // Use our custom hook to fetch any missing category names
    const {categoryMap: categoryIdToNameMap, pendingIds, handleCategoryLoaded} = useCategoriesById(uniqueCategoryIds);

    // Now create the category options for the UI using ALL available categories
    const categories = useMemo<CategoryOption[]>(() => {
        // If we have all categories from Redux, use those first
        if (allCategories && allCategories.length > 0) {
            return allCategories.map(category => ({
                id: String(category.id),
                name: category.name
            }));
        }

        // Fallback to using just the categories from vacancies
        return uniqueCategoryIds.map(categoryId => ({
            id: String(categoryId),
            name: categoryIdToNameMap[categoryId] || `Category ${categoryId}`
        }));
    }, [allCategories, uniqueCategoryIds, categoryIdToNameMap]);

    // Hardcoded statuses since they may not be directly available in the API data
    const statuses = useMemo<VacancyStatus[]>(() => {
        return ["active", "draft", "inactive", "closing soon"];
    }, []);

    // Toggle category filter with immediate filter application
    const toggleCategoryFilter = useCallback((categoryId: string) => {
        console.log("🔍 Toggling category filter:", categoryId);
        setCategoryFilters(prev => {
            const newFilters = prev.includes(categoryId)
                ? prev.filter(c => c !== categoryId)
                : [...prev, categoryId];

            return newFilters;
        });
    }, []);

    // Toggle status filter with immediate filter application
    const toggleStatusFilter = useCallback((status: VacancyStatus) => {
        console.log("🔍 Toggling status filter:", status);
        setStatusFilters(prev => {
            const newFilters = prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status];

            return newFilters;
        });
    }, []);

    // Apply filters function for search and pagination
    const applyFilters = useCallback(() => {
        // Skip if filters aren't initialized yet
        if (!isFiltersInitialized || !isClient) {
            console.log("🔍 Skipping applyFilters - filters not initialized or not on client");
            return;
        }

        // Determine if we actually have active filters
        const hasActiveFilters =
            searchTerm !== "" ||
            categoryFilters.length > 0 ||
            statusFilters.length > 0;

        console.log("🔥 Applying filters:", {
            search: searchTerm,
            categories: categoryFilters,
            statuses: statusFilters,
            page: currentPage,
            size: pageSize,
            hasActiveFilters
        });

        // First, update filter state to ensure UI reflects the current filter state
        if (hasActiveFilters !== isFiltered) {
            console.log(`🔍 Updating filter state: ${isFiltered} -> ${hasActiveFilters}`);
            setIsFiltered(hasActiveFilters);
        }

        const filterCriteria: any = {};

        if (searchTerm) {
            filterCriteria.title = searchTerm;
        }

        if (categoryFilters.length > 0) {
            console.log("🔍 Adding categoryIds filter:", categoryFilters);

            // Convert all string category IDs to numbers
            const categoryIds = categoryFilters.map(Number);
            console.log("🔍 Setting categoryIds:", categoryIds);

            // Use categoryIds (plural) as expected by the API
            filterCriteria.categoryIds = categoryIds;
        }

        if (statusFilters.length > 0) {
            console.log("🔍 Adding status filter:", statusFilters);
            // Map UI statuses to API status values
            const statusMap: Record<VacancyStatus, string> = {
                "active": "ACTIVE",
                "draft": "DRAFT",
                "inactive": "INACTIVE",
                "closing soon": "CLOSING_SOON"
            };

            filterCriteria.status = statusFilters
                .map(status => statusMap[status])
                .filter(Boolean);
        }

        const page: Pageable = {
            page: currentPage,
            size: pageSize,
            sort: ["createdAt,desc"]
        };

        console.log("🔍 Final filter criteria:", filterCriteria, "with page:", page);

        // Always call the filter API, with either active filters or an empty object
        console.log("🔍 Calling filterVacancies with criteria");
        filterVacancies(filterCriteria, page);
    }, [searchTerm, categoryFilters, statusFilters, currentPage, pageSize, filterVacancies, isFiltersInitialized, isClient, isFiltered]);

    // Debounce search to prevent too many API calls
    useEffect(() => {
        // Skip if we haven't mounted on client yet or filters aren't initialized
        if (!isClient || !isFiltersInitialized) return;
        // Skip if search term is empty or hasn't changed
        if (searchTerm === "") return;

        console.log("🔍 Search term changed, debouncing...");
        const timer = setTimeout(() => {
            applyFilters();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, applyFilters, isClient, isFiltersInitialized]);

    // When page changes, apply immediately with a small delay
    useEffect(() => {
        // Skip if we haven't mounted on client yet or filters aren't initialized
        if (!isClient || !isFiltersInitialized) return;
        // Skip if we're at page 0 and there are no active filters (initial state)
        if (currentPage === 0 && !isFiltered) return;

        console.log("🔍 Page changed to", currentPage);

        // We want pagination to trigger immediately to avoid UI latency
        applyFilters();

    }, [currentPage, applyFilters, isClient, isFiltered, isFiltersInitialized]);

    // Watch for changes in filter selections to apply filters
    useEffect(() => {
        // Skip if we haven't mounted on client yet or filters aren't initialized
        if (!isClient || !isFiltersInitialized) return;

        // Skip during initial render or when filters are cleared
        if (categoryFilters.length === 0 && statusFilters.length === 0) return;

        console.log("🔍 Filter selection changed:", {categoryFilters, statusFilters});

        // Apply filters immediately - any delay can cause missed selections
        applyFilters();

    }, [categoryFilters, statusFilters, applyFilters, isClient, isFiltersInitialized]);

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        console.log("🔍 Clearing all filters and resetting pagination");
        setSearchTerm("");
        setCategoryFilters([]);
        setStatusFilters([]);
        setCurrentPage(0);
        setIsFiltered(false);

        // Use filter API with empty criteria for reset
        const emptyFilter = {};
        const initialPage: Pageable = {
            page: 0,
            size: pageSize,
            sort: ["createdAt,desc"]
        };

        console.log("🔍 Clearing all filters, using empty filter request");
        filterVacancies(emptyFilter, initialPage)
            .then(() => {
                console.log("🔍 After clear, pagination status:", {
                    totalPages,
                    totalItems,
                    currentPage: 0
                });
            })
            .catch(err => {
                console.error("🔍 Error clearing filters:", err);
            });
    }, [filterVacancies, pageSize, totalPages, totalItems]);

    // Handle row double click
    const handleVacancyClick = useCallback((vacancy: JobVacancy) => {
        console.log("Navigating to vacancy:", vacancy.id);
        router.push(`/dashboard/vacancies/${vacancy.id}`);
    }, [router]);

    // Computed property for active filters
    const hasActiveFilters = searchTerm || categoryFilters.length > 0 || statusFilters.length > 0;

    // Map API vacancies to the format expected by the UI components
    const mappedVacancies = useMemo(() => {
        // Always use filteredVacancies since we're always using the filter endpoint
        const vacancyData = filteredVacancies;

        console.log("Mapping vacancies:", vacancyData?.length || 0);

        if (!vacancyData || vacancyData.length === 0) {
            console.log("No vacancy data available to map");
            return [];
        }

        // Define status mapping based on application properties
        const determineStatus = (vacancy: any): VacancyStatus => {
            // This is a placeholder logic - replace with actual business logic
            // based on your application requirements
            if (vacancy.status === "ACTIVE") return "active";
            if (vacancy.status === "DRAFT") return "draft";
            if (vacancy.status === "INACTIVE") return "inactive";
            if (vacancy.status === "CLOSING_SOON") return "closing soon";

            // Default status as a fallback
            return "active";
        };

        // Helper to find category name from all available sources
        const findCategoryName = (categoryId: number | string): string => {
            // Look in the all categories array first (from Redux)
            if (allCategories && allCategories.length > 0) {
                const category = allCategories.find(c => String(c.id) === String(categoryId));
                if (category) return category.name;
            }

            // Then check our dynamic map for names fetched individually
            if (categoryIdToNameMap[categoryId]) {
                return categoryIdToNameMap[categoryId];
            }

            // Fallback
            return `Category ${categoryId}`;
        };

        return vacancyData.map(vacancy => {
            const categoryId = vacancy.categoryId ? vacancy.categoryId : 0;
            const categoryIdStr = String(categoryId);

            // First try to use the category name from the API response
            // Then fall back to our helper function to find from Redux or individual fetches
            const categoryName = vacancy.categoryName || findCategoryName(categoryId);

            // Cast to JobVacancy type for compatibility with UI components
            const jobVacancy: JobVacancy = {
                id: vacancy.id || "",
                title: vacancy.title || "",
                // Use our category name mapping if the API doesn't provide a name
                category: categoryName,
                // Store the category ID as a string for filtering purposes
                categoryId: categoryIdStr,
                // Default applicants count - safer approach without direct reference
                applicants: 0, // Default to 0 since applicationCount may not exist
                // Map API status to UI status with fallback
                status: determineStatus(vacancy)
            };

            return jobVacancy;
        });
    }, [filteredVacancies, categoryIdToNameMap, allCategories]);

    // Render category fetcher components
    const categoryFetchers = useMemo(() => {
        return pendingIds.map(id => (
            <CategoryFetcher
                key={id}
                categoryId={id}
                onCategoryLoaded={handleCategoryLoaded}
            />
        ));
    }, [pendingIds, handleCategoryLoaded]);

    // If we're still initializing on the client, show a loading spinner
    if (!isClient) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-96">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4"/>
                <span className="text-lg font-medium">Loading vacancies...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            {/* Hidden category fetchers */}
            <div className="hidden">
                {categoryFetchers}
            </div>

            <div className="mb-12 text-left">
                <h1 className="text-4xl font-bold tracking-tight mb-3 text-gray-900 dark:text-gray-50">My Vacancies</h1>
            </div>

            <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <Button
                    onClick={() => router.push("/dashboard/vacancies/new")}
                    size="lg"
                    className="group transition-all duration-300 hover:shadow-md"
                >
                    <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90"/>
                    Add New Vacancy
                </Button>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                    <Input
                        placeholder="Search vacancies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-8"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4"/>
                        </button>
                    )}
                </div>
            </div>

            {/* Active filters display */}
            {hasActiveFilters && (
                <div className="mb-6 flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>

                    {categoryFilters.map(categoryId => {
                        // Find the category name from the ID
                        const category = categories.find(c => c.id === categoryId);
                        return (
                            <Badge
                                key={`category-${categoryId}`}
                                variant="outline"
                                className="bg-gray-100 dark:bg-gray-800 flex items-center gap-1"
                            >
                                {category ? category.name : categoryId}
                                <button onClick={() => toggleCategoryFilter(categoryId)}>
                                    <X className="h-3 w-3 ml-1"/>
                                </button>
                            </Badge>
                        );
                    })}

                    {statusFilters.map(status => (
                        <Badge
                            key={`status-${status}`}
                            variant="outline"
                            className="bg-gray-100 dark:bg-gray-800 flex items-center gap-1"
                        >
                            {status}
                            <button onClick={() => toggleStatusFilter(status)}>
                                <X className="h-3 w-3 ml-1"/>
                            </button>
                        </Badge>
                    ))}

                    {searchTerm && (
                        <Badge
                            variant="outline"
                            className="bg-gray-100 dark:bg-gray-800 flex items-center gap-1"
                        >
                            Search: {searchTerm}
                            <button onClick={() => setSearchTerm("")}>
                                <X className="h-3 w-3 ml-1"/>
                            </button>
                        </Badge>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                        Clear all
                    </Button>
                </div>
            )}

            {/* Loading state */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4"/>
                    <p className="text-gray-500">Loading vacancies...</p>
                </div>
            )}

            {/* Error state */}
            {error && !isLoading && (
                <div className="text-center py-12">
                    <p className="text-red-500">Error loading vacancies. Please try again later.</p>
                    <Button
                        variant="outline"
                        onClick={() => filterVacancies({}, {page: 0, size: pageSize})}
                        className="mt-4"
                    >
                        Retry
                    </Button>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && (!mappedVacancies || mappedVacancies.length === 0) && (
                <div className="text-center py-12">
                    <p className="text-gray-500">
                        {hasActiveFilters
                            ? "No vacancies found matching your filters. Try adjusting your criteria."
                            : "You haven't created any vacancies yet. Click 'Add New Vacancy' to get started."}
                    </p>
                </div>
            )}

            {/* Vacancies list */}
            {!isLoading && !error && mappedVacancies && mappedVacancies.length > 0 && (
                isDesktop ? (
                    <JobVacancyTable
                        vacancies={mappedVacancies}
                        categories={categories}
                        statuses={statuses}
                        categoryFilters={categoryFilters}
                        statusFilters={statusFilters}
                        toggleCategoryFilter={toggleCategoryFilter}
                        toggleStatusFilter={toggleStatusFilter}
                        onRowDoubleClick={handleVacancyClick}
                    />
                ) : (
                    <JobVacancyCards
                        vacancies={mappedVacancies}
                        categories={categories}
                        statuses={statuses}
                        categoryFilters={categoryFilters}
                        statusFilters={statusFilters}
                        toggleCategoryFilter={toggleCategoryFilter}
                        toggleStatusFilter={toggleStatusFilter}
                        onCardClick={handleVacancyClick}
                    />
                )
            )}

            {/* Results count and pagination */}
            {!isLoading && mappedVacancies && mappedVacancies.length > 0 && (
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {`${currentPage * pageSize + 1}-${Math.min((currentPage + 1) * pageSize, totalItems)}`} of {totalItems} vacancies
                    </div>

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage + 1}
                            totalPages={totalPages}
                            onPageChange={(page) => {
                                console.log(`Pagination clicked: changing to page ${page}`);
                                setCurrentPage(page - 1);

                                // Create current filter criteria
                                const filterCriteria: any = {};

                                if (searchTerm) {
                                    filterCriteria.title = searchTerm;
                                }

                                if (categoryFilters.length > 0) {
                                    filterCriteria.categoryIds = categoryFilters.map(Number);
                                }

                                if (statusFilters.length > 0) {
                                    const statusMap: Record<VacancyStatus, string> = {
                                        "active": "ACTIVE",
                                        "draft": "DRAFT",
                                        "inactive": "INACTIVE",
                                        "closing soon": "CLOSING_SOON"
                                    };

                                    filterCriteria.status = statusFilters
                                        .map(status => statusMap[status])
                                        .filter(Boolean);
                                }

                                // Apply current filters with new page
                                const newPage: Pageable = {
                                    page: page - 1,
                                    size: pageSize,
                                    sort: ["createdAt,desc"]
                                };

                                console.log(`Directly applying filters for page ${page - 1}:`, filterCriteria);
                                filterVacancies(filterCriteria, newPage);
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
