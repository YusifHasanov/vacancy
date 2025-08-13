"use client"

import type { Job } from "@/types/job"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Building2,
  Briefcase,
  GraduationCap,
  Clock,
  MapPin,
  Share2,
  BookmarkPlus,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface JobDetailsProps {
  job: Job
}

export function JobDetails({ job }: JobDetailsProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg bg-background flex items-center justify-center overflow-hidden border">
              <img
                src={job.companyLogo || "/placeholder.svg"}
                alt={`${job.companyName} logo`}
                className="w-14 h-14 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="w-4 h-4" />
                <span>{job.companyName}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {job.category && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {job.category}
              </Badge>
            )}
            {job.location && (
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location}
              </Badge>
            )}
            {job.schedule && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {job.schedule}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 font-medium flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            Son tarix{" "}
            {job.applicationDeadline.toLocaleDateString("az-AZ", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>

          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Paylaş</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>


            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Yadda saxla</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="space-y-8 bg-accent/5 p-6 rounded-lg border">
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Vəzifə və öhdəliklər:
          </h2>
          <ul className="space-y-2 pl-6">
            {job.description.duties.map((duty, index) => (
              <li
                key={index}
                className="text-foreground relative before:absolute before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary before:top-2 before:-left-4"
              >
                {duty}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Təhsil və ixtisas tələbləri:
          </h2>
          <ul className="space-y-2 pl-6">
            {job.description.education.map((req, index) => (
              <li
                key={index}
                className="text-foreground relative before:absolute before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary before:top-2 before:-left-4"
              >
                {req}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            İş təcrübəsi:
          </h2>
          <ul className="space-y-2 pl-6">
            {job.description.experience.map((exp, index) => (
              <li
                key={index}
                className="text-foreground relative before:absolute before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary before:top-2 before:-left-4"
              >
                {exp}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="w-5 h-5 text-primary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            Bilik və bacarıqlar:
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3 text-foreground">Tələb olunan:</h3>
              <ul className="space-y-2 pl-6">
                {job.description.requiredSkills.map((skill, index) => (
                  <li
                    key={index}
                    className="text-foreground relative before:absolute before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary before:top-2 before:-left-4"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3 text-foreground">Üstünlük verilir:</h3>
              <ul className="space-y-2 pl-6">
                {job.description.preferredSkills.map((skill, index) => (
                  <li
                    key={index}
                    className="text-foreground relative before:absolute before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary before:top-2 before:-left-4"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="flex-1" size="lg">
          Müraciət et
        </Button>
        <Button variant="outline" className="flex-1" size="lg">
          Əlaqə məlumatları
        </Button>
      </div>
    </motion.div>
  )
}

