"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []

    // Always show first page
    pageNumbers.push(1)

    // Calculate range around current page
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pageNumbers.push("ellipsis-start")
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push("ellipsis-end")
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className="flex items-center space-x-1" aria-label="Pagination">
      {/* Previous button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 border-gray-200 dark:border-gray-800"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <div key={`ellipsis-${index}`} className="flex items-center justify-center h-8 w-8">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </div>
            )
          }

          return (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(page as number)}
              className={`h-8 w-8`}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </Button>
          )
        })}
      </div>

      {/* Next button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 border-gray-200 dark:border-gray-800"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}

