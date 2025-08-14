"use client"

import {Heart, MapPin, Clock, Briefcase} from 'lucide-react'
import {Job} from "@/types/job"
import {cn} from "@/lib/utils"
import {formatPostedDate, isNewPost} from "@/util/date"
import {Badge} from "@/components/ui/badge"
import {motion} from "framer-motion"

interface JobListItemProps {
    job: Job
    isSelected: boolean
    onSelect: (job: Job) => void
    onToggleFavorite: (jobId: string) => void
}

export function JobListItem({
                                job,
                                isSelected,
                                onSelect,
                                onToggleFavorite
                            }: JobListItemProps) {
    return (
        <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3}}
            className={cn(
                "flex flex-col gap-4 p-5 cursor-pointer border rounded-lg mb-3 hover:shadow-md transition-all duration-200",
                isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:bg-accent/5"
            )}
            onClick={() => onSelect(job)}
        >
            <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                    <div
                        className="w-14 h-14 rounded-lg bg-background flex items-center justify-center overflow-hidden border">
                        <img
                            src={job.companyLogo || "/placeholder.svg"}
                            alt={`${job.companyName} logo`}
                            className="w-12 h-12 object-contain"
                        />
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggleFavorite(job.id)
                        }}
                        className="absolute -top-2 -right-2 p-1.5 rounded-full bg-background shadow-sm border hover:bg-accent/10 transition-colors"
                        aria-label={job.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Heart
                            className={cn(
                                "w-4 h-4",
                                job.isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                            )}
                        />
                    </button>
                </div>

                <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-foreground">{job.title}</h3>
                        {isNewPost(job.postedAt) && (
                            <Badge variant="destructive" className="text-xs font-medium">
                                YENİ
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{job.companyName}</p>

                    <div className="flex flex-wrap gap-3 mt-3">
                        {job.location && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3"/>
                                <span>{job.location}</span>
                            </div>
                        )}
                        {job.type && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Briefcase className="w-3 h-3"/>
                                <span>{job.type}</span>
                            </div>
                        )}
                        {job.schedule && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3"/>
                                <span>{job.schedule}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-1 pt-2 border-t">
                <div className="text-sm">
                    <span className="text-muted-foreground">{formatPostedDate(job.postedAt)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                    <span className="text-muted-foreground">{job.views}</span>
                    <span className="text-muted-foreground">views</span>
                </div>
            </div>
        </motion.div>
    )
}
