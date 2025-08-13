"use client"

import type { JobVacancy, VacancyStatus } from "@/types/job-vacancy"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, Filter, ArrowUpDown, ChevronUp, ChevronDown, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// Interface for category with ID and name
interface CategoryOption {
  id: string;
  name: string;
}

interface JobVacancyCardsProps {
  vacancies: JobVacancy[]
  categories: CategoryOption[]
  statuses: VacancyStatus[]
  categoryFilters: string[]
  statusFilters: VacancyStatus[]
  applicantsSort?: "none" | "asc" | "desc"
  toggleCategoryFilter: (category: string) => void
  toggleStatusFilter: (status: VacancyStatus) => void
  setApplicantsSort?: (sort: "none" | "asc" | "desc") => void
  onCardClick?: (vacancy: JobVacancy) => void
}

export default function JobVacancyCards({
  vacancies,
  categories,
  statuses,
  categoryFilters,
  statusFilters,
  applicantsSort = "none",
  toggleCategoryFilter,
  toggleStatusFilter,
  setApplicantsSort,
  onCardClick
}: JobVacancyCardsProps) {
  if (vacancies.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        No job vacancies found matching your criteria.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Filters panel */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4">
        {/* Mobile filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {/* Category filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={categoryFilters.length > 0 ? "border-primary text-primary" : ""}
              >
                <Filter className="h-4 w-4 mr-2" />
                Category
                {categoryFilters.length > 0 && <span className="ml-1">({categoryFilters.length})</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuGroup>
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category.id}
                    checked={categoryFilters.includes(category.id)}
                    onCheckedChange={() => toggleCategoryFilter(category.id)}
                  >
                    {category.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
              {categoryFilters.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => categoryFilters.forEach((c) => toggleCategoryFilter(c))}
                    className="justify-center text-gray-500 focus:text-gray-500"
                  >
                    Clear filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={statusFilters.length > 0 ? "border-primary text-primary" : ""}
              >
                <Filter className="h-4 w-4 mr-2" />
                Status
                {statusFilters.length > 0 && <span className="ml-1">({statusFilters.length})</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuGroup>
                {statuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilters.includes(status)}
                    onCheckedChange={() => toggleStatusFilter(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
              {statusFilters.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => statusFilters.forEach((s) => toggleStatusFilter(s))}
                    className="justify-center text-gray-500 focus:text-gray-500"
                  >
                    Clear filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Applicants sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={applicantsSort !== "none" ? "border-primary text-primary" : ""}
              >
                {applicantsSort === "none" && <ArrowUpDown className="h-4 w-4 mr-2" />}
                {applicantsSort === "asc" && <ChevronUp className="h-4 w-4 mr-2" />}
                {applicantsSort === "desc" && <ChevronDown className="h-4 w-4 mr-2" />}
                Applicants
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => setApplicantsSort?.("asc")}>
                <ChevronUp className="mr-2 h-4 w-4" />
                <span>Low to High</span>
                {applicantsSort === "asc" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setApplicantsSort?.("desc")}>
                <ChevronDown className="mr-2 h-4 w-4" />
                <span>High to Low</span>
                {applicantsSort === "desc" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              {applicantsSort !== "none" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setApplicantsSort?.("none")}
                    className="justify-center text-gray-500 focus:text-gray-500"
                  >
                    Clear sort
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Cards */}
      {vacancies.map((vacancy) => (
        <Card 
          key={vacancy.id} 
          className="overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer"
          onClick={() => onCardClick?.(vacancy)}
        >
          <CardContent className="p-0">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-gray-400" />
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{vacancy.title}</h3>
                </div>
                <StatusBadge status={vacancy.status} />
              </div>

              <div className="flex justify-between items-center">
                <div className="text-gray-700 dark:text-gray-300">{vacancy.category}</div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Users className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{vacancy.applicants} applicants</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = () => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
      case "draft":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "closing soon":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  return (
    <Badge className={`font-medium ${getStatusStyles()}`} variant="outline">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

