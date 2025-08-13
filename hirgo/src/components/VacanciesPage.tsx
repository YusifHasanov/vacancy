'use client'

import { useState } from "react"
import { Filters } from "@/components/filters"
import { JobListItem } from "@/components/job-list-item"
import { JobDetails } from "@/components/job-details"
import { Job } from "@/types/job"



export default function VacanciesPage() {
    const [selectedJob, setSelectedJob] = useState<Job | null>(null)
    const [, setFavorites] = useState<Set<string>>(new Set())
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([])

    const handleFilterChange = (key: string, value: string) => {
        setFilteredJobs([])
    }

    const handleToggleFavorite = (jobId: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev)
            if (newFavorites.has(jobId)) {
                newFavorites.delete(jobId)
            } else {
                newFavorites.add(jobId)
            }
            return newFavorites
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Filters */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <Filters onFilterChange={handleFilterChange} />
                </div>
            </div>

            {/* Main content */}
            <main className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Job listings */}
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="divide-y">
                            {filteredJobs.map((job) => (
                                <JobListItem
                                    key={job.id}
                                    job={job}
                                    isSelected={selectedJob?.id === job.id}
                                    onSelect={setSelectedJob}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Job details */}
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        {selectedJob && <JobDetails job={selectedJob} />}
                    </div>
                </div>
            </main>
        </div>
    )
}

