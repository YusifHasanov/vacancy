import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { JobVacancy, VacancyStatus } from "@/types/job-vacancy";
  import { Badge } from "@/components/ui/badge";
  import { ChevronDown, ChevronUp, Filter, ArrowUpDown, Check } from 'lucide-react';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button";
  
  // Interface for category with ID and name
  interface CategoryOption {
    id: string;
    name: string;
  }

  interface JobVacancyTableProps {
    vacancies: JobVacancy[];
    categories: CategoryOption[];
    statuses: VacancyStatus[];
    categoryFilters: string[];
    statusFilters: VacancyStatus[];
    applicantsSort?: "none" | "asc" | "desc";
    toggleCategoryFilter: (category: string) => void;
    toggleStatusFilter: (status: VacancyStatus) => void;
    setApplicantsSort?: (sort: "none" | "asc" | "desc") => void;
    onRowDoubleClick?: (vacancy: JobVacancy) => void;
  }
  
  export default function JobVacancyTable({ 
    vacancies,
    categories,
    statuses,
    categoryFilters,
    statusFilters,
    applicantsSort = "none",
    toggleCategoryFilter,
    toggleStatusFilter,
    setApplicantsSort,
    onRowDoubleClick
  }: JobVacancyTableProps) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900">
              <TableHead className="w-[300px] py-4 text-gray-700 dark:text-gray-300 font-medium">Job Title</TableHead>
              
              {/* Category column with filter */}
              <TableHead className="w-[200px] text-gray-700 dark:text-gray-300 font-medium">
                <div className="flex items-center gap-2">
                  Category
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Filter className={`h-4 w-4 ${categoryFilters.length > 0 ? 'text-primary' : 'text-gray-400'}`} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuGroup>
                        {categories.map(category => (
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
                            onClick={() => categoryFilters.forEach(c => toggleCategoryFilter(c))}
                            className="justify-center text-gray-500 focus:text-gray-500"
                          >
                            Clear filters
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              
              {/* Applicants column with sort */}
              <TableHead className="w-[150px] text-gray-700 dark:text-gray-300 font-medium">
                <div className="flex items-center gap-2">
                  Applicants
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        {applicantsSort === "none" && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
                        {applicantsSort === "asc" && <ChevronUp className="h-4 w-4 text-primary" />}
                        {applicantsSort === "desc" && <ChevronDown className="h-4 w-4 text-primary" />}
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
              </TableHead>
              
              {/* Status column with filter */}
              <TableHead className="w-[150px] text-gray-700 dark:text-gray-300 font-medium">
                <div className="flex items-center gap-2">
                  Status
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Filter className={`h-4 w-4 ${statusFilters.length > 0 ? 'text-primary' : 'text-gray-400'}`} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuGroup>
                        {statuses.map(status => (
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
                            onClick={() => statusFilters.forEach(s => toggleStatusFilter(s))}
                            className="justify-center text-gray-500 focus:text-gray-500"
                          >
                            Clear filters
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vacancies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-gray-500 dark:text-gray-400">
                  No job vacancies found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              vacancies.map((vacancy) => (
                <TableRow 
                  key={vacancy.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onDoubleClick={() => onRowDoubleClick?.(vacancy)}
                >
                  <TableCell className="py-4 font-medium text-gray-900 dark:text-gray-100">
                    {vacancy.title}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {vacancy.category}
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {vacancy.applicants}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={vacancy.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
  
  function StatusBadge({ status }: { status: VacancyStatus }) {
    const getStatusStyles = () => {
      switch (status) {
        case 'active':
          return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
        case 'inactive':
          return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
        case 'draft':
          return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
        case 'closing soon':
          return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
      }
    };
  
    return (
      <Badge className={`font-medium ${getStatusStyles()}`} variant="outline">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  }
  