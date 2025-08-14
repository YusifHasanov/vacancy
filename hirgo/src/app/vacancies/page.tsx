"use client"

import type React from "react"

import {useState, useEffect, useRef, useCallback} from "react"
import {Button} from "@/components/ui/button"
import {Filters} from "@/components/filters"
import {JobListItem} from "@/components/job-list-item"
import {JobDetails} from "@/components/job-details"
import type {Job} from "@/types/job"
import {useJobSeekerVacancies, useJobSeekerVacancy} from "@/app/features/jobseeker"
import {Loader2, Search, Filter, X, ArrowLeft} from "lucide-react"
import {Input} from "@/components/ui/input"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"
import {useMediaQuery} from "@/hooks/use-media-query"
import {Drawer, DrawerContent, DrawerHeader, DrawerTitle} from "@/components/ui/drawer"

const NoVacancySelected = () => {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-center p-6">
            <div className="w-16 h-16 text-muted-foreground mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">No Job Selected</h3>
            <p className="text-muted-foreground max-w-md">Select a job from the list to view its details.</p>
        </div>
    )
}

const NoVacanciesFound = () => {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 text-muted-foreground mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">No Vacancies Found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
                We couldn&#39;t find any vacancies matching your criteria. Try adjusting your filters.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
                Reset Filters
            </Button>
        </div>
    )
}

// Helper function to create a compatible job object
const createCompatibleJob = (job: any): Job => {
    return {
        id: job.id || job._id || "unknown-id",
        title: job.title || "Untitled Job",
        companyName: job.companyName || job.company_name || "Unknown Company",
        companyLogo: job.companyLogo || job.company_logo || "/placeholder.svg",
        views: typeof job.views === "number" ? job.views : 0,
        postedAt: job.postedAt || job.posted_at || new Date(),
        isFavorite: false, // We don't need favorites
        grade: job.grade || "",
        type: job.type || "",
        salary: job.salary?.toString() || "",
        location: job.location || "",
        postingType: job.postingType || "",
        description: {
            duties: Array.isArray(job.duties)
                ? job.duties
                : job.description && Array.isArray(job.description.duties)
                    ? job.description.duties
                    : [],
            education: Array.isArray(job.education)
                ? job.education
                : job.description && Array.isArray(job.description.education)
                    ? job.description.education
                    : [],
            experience: Array.isArray(job.experience)
                ? job.experience
                : job.description && Array.isArray(job.description.experience)
                    ? job.description.experience
                    : [],
            requiredSkills: Array.isArray(job.requiredSkills)
                ? job.requiredSkills
                : job.description && Array.isArray(job.description.requiredSkills)
                    ? job.description.requiredSkills
                    : [],
            preferredSkills: Array.isArray(job.preferredSkills)
                ? job.preferredSkills
                : job.description && Array.isArray(job.description.preferredSkills)
                    ? job.description.preferredSkills
                    : [],
        },
        applicationDeadline: job.applicationDeadline || new Date(),
        category: job.category || "",
        schedule: job.schedule || "",
    }
}

const VacanciesPage = () => {
    // Initial page size for infinite scroll
    const INITIAL_PAGE_SIZE = 10

    // State for search query
    const [searchQuery, setSearchQuery] = useState("")

    // State for filter values
    const [filterValues, setFilterValues] = useState<Record<string, any>>({})

    // State for filter visibility
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Use the hook to get vacancies data with infinite scroll
    const {
        vacancies: initialVacancies,
        loading: initialLoading,
        error,
        totalPages,
        currentPage,
        changePage,
        applyFilter,
        filter,
    } = useJobSeekerVacancies(0, INITIAL_PAGE_SIZE)

    // State to manage all loaded vacancies for infinite scroll
    const [allVacancies, setAllVacancies] = useState<Job[]>([])
    const [hasMore, setHasMore] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    // Function to load more vacancies
    const loadMoreVacancies = useCallback(async () => {
        if (currentPage + 1 >= totalPages || !hasMore || isLoadingMore) {
            setHasMore(false)
            return
        }

        setIsLoadingMore(true)

        try {
            // Call the API to get the next page
            const nextPage = currentPage + 1
            changePage(nextPage)
        } catch (error) {
            console.error("Error loading more vacancies:", error)
            setIsLoadingMore(false)
        }
    }, [currentPage, totalPages, hasMore, isLoadingMore, changePage])

    // Observer for infinite scroll
    const observer = useRef<IntersectionObserver | null>(null)
    const lastVacancyElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (initialLoading || isLoadingMore) return
            if (observer.current) observer.current.disconnect()

            observer.current = new IntersectionObserver(
                (entries) => {
                    // Only load more when the element is fully visible
                    if (entries[0].isIntersecting && entries[0].intersectionRatio >= 0.9 && hasMore) {
                        console.log("Last item fully visible, loading more...");
                        loadMoreVacancies()
                    }
                },
                {
                    rootMargin: "0px", // No extra margin
                    threshold: 0.9, // 90% of the element must be visible
                }
            )

            if (node) observer.current.observe(node)
        },
        [initialLoading, isLoadingMore, hasMore, loadMoreVacancies],
    )

    // Update allVacancies when initialVacancies changes
    useEffect(() => {
        if (initialVacancies && Array.isArray(initialVacancies)) {
            const transformedVacancies = initialVacancies.map(job => createCompatibleJob(job));

            if (currentPage === 0) {
                // Reset the list if we're on the first page (new filter applied)
                setAllVacancies(transformedVacancies)
            } else {
                // Append to the list for infinite scroll, avoiding duplicates
                const newVacancies = transformedVacancies.filter(
                    (newJob) => !allVacancies.some((existingJob) => existingJob.id === newJob.id),
                )

                if (newVacancies.length > 0) {
                    setAllVacancies((prev) => [...prev, ...newVacancies])
                }
            }
            console.log(`Page ${currentPage}: Loaded ${initialVacancies?.length || 0} vacancies`)
        }
    }, [initialVacancies, currentPage])

    // Reset hasMore when totalPages changes
    useEffect(() => {
        setHasMore(currentPage + 1 < totalPages)
        setIsLoadingMore(false)
    }, [currentPage, totalPages])

    // Store selected job ID
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

    // State for mobile drawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    // Get selected job details
    const {vacancy: selectedJob, loading: loadingJob} = useJobSeekerVacancy(selectedJobId || undefined)

    // Set first job as selected by default when vacancies load
    useEffect(() => {
        if (Array.isArray(initialVacancies) && initialVacancies.length > 0 && !selectedJobId) {
            setSelectedJobId(initialVacancies[0].id.toString())
        }
    }, [initialVacancies, selectedJobId])

    // Handle filter changes
    const handleFilterChange = (key: string, value: string) => {
        setFilterValues((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    // Apply all filters at once
    const applyAllFilters = () => {
        // Create a mapping object to translate UI filter keys to API parameters
        const filterMap: Record<string, string> = {
            location: "locationTypeId",
            category: "categoryId",
            employmentType: "employmentTypeId",
            workSchedule: "workScheduleId",
            minSalary: "minSalary",
            maxSalary: "maxSalary",
            postingDate: "postedTime",
            search: "search",
        }

        // Create a new filter object based on the current filter
        const newFilter: Record<string, any> = {...filter}

        // Update filter with all collected values
        Object.entries(filterValues).forEach(([key, value]) => {
            const apiKey = filterMap[key]
            if (apiKey) {
                if (
                    key === "minSalary" ||
                    key === "maxSalary" ||
                    key === "category" ||
                    key === "location" ||
                    key === "employmentType" ||
                    key === "workSchedule"
                ) {
                    // Convert to number for these fields
                    newFilter[apiKey] = value && value !== "" ? Number.parseInt(value) : undefined
                } else {
                    // String value for posting date and search
                    newFilter[apiKey] = value || undefined
                }
            }
        })

        // Apply the updated filter
        applyFilter(newFilter)

        // Reset selected job when filter changes
        setSelectedJobId(null)

        // Reset to first page when applying a new filter
        changePage(0)

        // Reset hasMore
        setHasMore(true)

        // Close filter sheet on mobile
        setIsFilterOpen(false)
    }

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        handleFilterChange("search", searchQuery)
        applyAllFilters()
    }

    // Handle job selection
    const handleJobSelect = (job: Job) => {
        setSelectedJobId(job.id.toString())

        // On mobile, open the drawer when a job is selected
        if (isMobile) {
            setIsDrawerOpen(true)
        }
    }

    // Add favorite status to jobs (remove since we don't need favorites)
    const jobsWithFavorites = Array.isArray(allVacancies) ? allVacancies : []

    // Check if we're on mobile
    const isMobile = useMediaQuery("(max-width: 768px)")

    // Update the scroll effect to handle Radix ScrollArea properly
    useEffect(() => {
        // ScrollArea from Radix UI uses a different structure with a viewport element
        const handleScroll = () => {
            if (isLoadingMore || !hasMore || initialLoading) return;

            // Find all scroll viewports within scroll areas
            const scrollViewports = document.querySelectorAll('[data-radix-scroll-area-viewport]');

            scrollViewports.forEach(viewport => {
                if (viewport instanceof HTMLElement) {
                    const scrollPosition = viewport.scrollTop + viewport.clientHeight;
                    const scrollHeight = viewport.scrollHeight;
                    const scrollRemaining = scrollHeight - scrollPosition;
                    const scrollPercentage = scrollPosition / scrollHeight;

                    // Only load more when very close to the bottom (last 5% of content)
                    if (scrollPercentage > 0.95) {
                        console.log("Reached end of scroll area", {
                            scrollPercentage: scrollPercentage.toFixed(2),
                            scrollRemaining,
                        });
                        loadMoreVacancies();
                    }
                }
            });
        };

        // Add scroll event listeners to Radix ScrollArea viewports
        const scrollViewports = document.querySelectorAll('[data-radix-scroll-area-viewport]');
        scrollViewports.forEach(viewport => {
            viewport.addEventListener('scroll', handleScroll);
        });

        return () => {
            // Clean up
            const scrollViewports = document.querySelectorAll('[data-radix-scroll-area-viewport]');
            scrollViewports.forEach(viewport => {
                viewport.removeEventListener('scroll', handleScroll);
            });
        };
    }, [hasMore, isLoadingMore, initialLoading, loadMoreVacancies]);

    return (
        <main className="container mx-auto px-4 py-6 ">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <form onSubmit={handleSearch} className="relative">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                        <Input
                            type="text"
                            placeholder="Search for jobs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4"
                        />
                    </form>
                </div>

                {isMobile ? (
                    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter className="h-4 w-4"/>
                                Filters
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[85vw] sm:w-[385px] p-4">
                            <Filters onFilterChange={handleFilterChange} onApplyFilters={applyAllFilters}/>
                        </SheetContent>
                    </Sheet>
                ) : (
                    <Button variant="outline" className="flex items-center gap-2"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}>
                        {isFilterOpen ? (
                            <>
                                <X className="h-4 w-4"/>
                                Hide Filters
                            </>
                        ) : (
                            <>
                                <Filter className="h-4 w-4"/>
                                Show Filters
                            </>
                        )}
                    </Button>
                )}
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex md:flex-row gap-6">
                {/* Filters - Desktop */}
                {!isMobile && isFilterOpen && (
                    <div className="w-full md:w-1/4 lg:w-1/5">
                        <div className="sticky top-4 bg-background rounded-lg border p-4">
                            <Filters onFilterChange={handleFilterChange} onApplyFilters={applyAllFilters}/>
                        </div>
                    </div>
                )}

                {/* Main content area - Desktop */}
                <div
                    className={`flex flex-col md:flex-row gap-6 w-full ${!isMobile && isFilterOpen ? "md:w-3/4 lg:w-4/5" : "w-full"}`}
                >
                    {/* Job List Section */}
                    <div className="w-full md:w-2/5 lg:w-1/3">
                        <div className="bg-background rounded-lg border h-[calc(100vh-140px)] flex flex-col">
                            <div className="p-3 border-b">
                                <h2 className="font-medium">
                                    {jobsWithFavorites.length > 0 ? `${jobsWithFavorites.length} vacancies found` : "Vacancies"}
                                </h2>
                            </div>

                            <ScrollArea className="flex-grow overflow-auto h-full scroll-container"
                                        style={{position: "relative"}}>
                                {initialLoading && currentPage === 0 ? (
                                    <div className="flex justify-center items-center h-40">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                                    </div>
                                ) : error ? (
                                    <div className="p-4 text-red-500">Error loading vacancies: {error}</div>
                                ) : jobsWithFavorites.length === 0 ? (
                                    <NoVacanciesFound/>
                                ) : (
                                    <div className="p-3">
                                        {jobsWithFavorites.map((job: Job, index: number) => {
                                            // Create a compatible job object from the raw data
                                            const compatibleJob = createCompatibleJob(job)

                                            // If this is the last item, attach the ref for infinite scrolling
                                            if (index === jobsWithFavorites.length - 1) {
                                                return (
                                                    <div ref={lastVacancyElementRef} key={job.id}>
                                                        <JobListItem
                                                            job={compatibleJob}
                                                            isSelected={selectedJobId === job.id.toString()}
                                                            onSelect={handleJobSelect}
                                                            onToggleFavorite={() => {
                                                            }} // Empty function since we don't need favorites
                                                        />
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <JobListItem
                                                        key={job.id}
                                                        job={compatibleJob}
                                                        isSelected={selectedJobId === job.id.toString()}
                                                        onSelect={handleJobSelect}
                                                        onToggleFavorite={() => {
                                                        }} // Empty function since we don't need favorites
                                                    />
                                                )
                                            }
                                        })}

                                        {isLoadingMore ? (
                                            <div className="flex justify-center py-4">
                                                <Loader2 className="h-6 w-6 animate-spin text-primary"/>
                                            </div>
                                        ) : hasMore && totalPages > 1 ? (
                                            <div className="flex justify-center py-4">
                                                <Button variant="outline" onClick={loadMoreVacancies}
                                                        className="text-sm">
                                                    Load More ({currentPage + 1}/{totalPages})
                                                </Button>
                                            </div>
                                        ) : totalPages > 1 ? (
                                            <div className="text-center text-muted-foreground text-sm py-4">
                                                All vacancies loaded
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>

                    {/* Job Details Section - Desktop */}
                    <div className="w-full md:w-3/5 lg:w-2/3">
                        <div className="bg-background rounded-lg border p-6 h-[calc(100vh-140px)] overflow-auto">
                            {loadingJob ? (
                                <div className="flex justify-center items-center h-96">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                                </div>
                            ) : selectedJob ? (
                                <JobDetails job={selectedJob}/>
                            ) : (
                                <NoVacancySelected/>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
                <div className="bg-background rounded-lg border flex flex-col h-[calc(100vh-140px)]">
                    <div className="p-3 border-b">
                        <h2 className="font-medium">
                            {jobsWithFavorites.length > 0 ? `${jobsWithFavorites.length} vacancies found` : "Vacancies"}
                        </h2>
                    </div>

                    <ScrollArea className="flex-grow overflow-auto h-full">
                        {initialLoading && currentPage === 0 ? (
                            <div className="flex justify-center items-center h-40">
                                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                            </div>
                        ) : error ? (
                            <div className="p-4 text-red-500">Error loading vacancies: {error}</div>
                        ) : jobsWithFavorites.length === 0 ? (
                            <NoVacanciesFound/>
                        ) : (
                            <div className="p-3">
                                {jobsWithFavorites.map((job: Job, index: number) => {
                                    // Create a compatible job object from the raw data
                                    const compatibleJob = createCompatibleJob(job)

                                    // If this is the last item, attach the ref for infinite scrolling
                                    if (index === jobsWithFavorites.length - 1) {
                                        return (
                                            <div ref={lastVacancyElementRef} key={job.id}>
                                                <JobListItem
                                                    job={compatibleJob}
                                                    isSelected={selectedJobId === job.id.toString()}
                                                    onSelect={handleJobSelect}
                                                    onToggleFavorite={() => {
                                                    }} // Empty function since we don't need favorites
                                                />
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <JobListItem
                                                key={job.id}
                                                job={compatibleJob}
                                                isSelected={selectedJobId === job.id.toString()}
                                                onSelect={handleJobSelect}
                                                onToggleFavorite={() => {
                                                }} // Empty function since we don't need favorites
                                            />
                                        )
                                    }
                                })}

                                {isLoadingMore ? (
                                    <div className="flex justify-center py-4">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary"/>
                                    </div>
                                ) : hasMore && totalPages > 1 ? (
                                    <div className="flex justify-center py-4">
                                        <Button variant="outline" onClick={loadMoreVacancies} className="text-sm">
                                            Load More ({currentPage + 1}/{totalPages})
                                        </Button>
                                    </div>
                                ) : totalPages > 1 ? (
                                    <div className="text-center text-muted-foreground text-sm py-4">
                                        All vacancies loaded
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                {/* Mobile Drawer for Job Details */}
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerContent className="max-h-[90vh]">
                        <DrawerHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(false)}
                                        className="absolute left-2">
                                    <ArrowLeft className="h-5 w-5"/>
                                </Button>
                                <DrawerTitle className="text-center w-full">Job Details</DrawerTitle>
                            </div>
                        </DrawerHeader>
                        <div className="p-4 overflow-auto max-h-[calc(90vh-60px)]">
                            {loadingJob ? (
                                <div className="flex justify-center items-center h-96">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                                </div>
                            ) : selectedJob ? (
                                <JobDetails job={selectedJob}/>
                            ) : (
                                <NoVacancySelected/>
                            )}
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </main>
    )
}

export default VacanciesPage

