"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { mockCandidates, type Candidate } from "../datas/mockData"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, DownloadIcon } from "@radix-ui/react-icons"
import { BriefcaseIcon, MailIcon, MapPinIcon, PhoneIcon, XIcon } from "lucide-react"

export default function CandidatesScreen() {
  const [candidates] = useState<Candidate[]>(mockCandidates)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    candidates.length > 0 ? candidates[4] : null,
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [educationFilter, setEducationFilter] = useState<string>("")
  const [experienceFilter, setExperienceFilter] = useState<string>("")
  const [languageFilter, setLanguageFilter] = useState<string>("")
  const [skillFilter, setSkillFilter] = useState<string>("")

  const filteredCandidates = useMemo(() => {
    return candidates
      .filter(
        (candidate) =>
          (candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.appliedJob.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (educationFilter === "" || candidate.education === educationFilter) &&
          (experienceFilter === "" || mapExperienceToRange(candidate.experience) === experienceFilter) &&
          (languageFilter === "" || candidate.languages.includes(languageFilter)) &&
          (skillFilter === "" ||
            candidate.skills.some((skill) => skill.toLowerCase().includes(skillFilter.toLowerCase()))),
      )
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime()
        } else {
          return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
        }
      })
  }, [candidates, searchTerm, sortOrder, educationFilter, experienceFilter, languageFilter, skillFilter])

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] overflow-hidden">
      {/* On mobile: Full screen list when no candidate is selected, hidden when a candidate is selected */}
      <div
        className={`w-full md:w-1/3 lg:w-1/4 p-3 sm:p-4 bg-white shadow-md overflow-y-auto 
        ${selectedCandidate ? "hidden md:block" : "block"} 
        max-h-[100dvh] md:max-h-[100dvh]`}
      >
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <SortOrder sortOrder={sortOrder} setSortOrder={setSortOrder} />
        <Filters
          setEducationFilter={setEducationFilter}
          setExperienceFilter={setExperienceFilter}
          setLanguageFilter={setLanguageFilter}
          setSkillFilter={setSkillFilter}
        />
        <CandidatesList
          candidates={filteredCandidates}
          setSelectedCandidate={setSelectedCandidate}
          selectedCandidate={selectedCandidate}
        />
      </div>

      {/* On mobile: Full screen details when a candidate is selected, hidden when no candidate is selected */}
      <div
        className={`w-full md:w-2/3 lg:w-3/4 p-3 sm:p-4 overflow-y-auto 
        ${selectedCandidate ? "block" : "hidden md:block"} 
        max-h-[100dvh] md:max-h-[100dvh]`}
      >
        {selectedCandidate && (
          <div className="md:hidden mb-3 sticky top-0 z-10 bg-white pt-1">
            <Button
              onClick={() => setSelectedCandidate(null)}
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <XIcon className="h-4 w-4 mr-2" />
              Back to Candidates List
            </Button>
          </div>
        )}
        {selectedCandidate ? (
          <CandidateDetails candidate={selectedCandidate} />
        ) : (
          <div className="hidden md:flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p>Select a candidate to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
function CandidatesList({
  candidates,
  setSelectedCandidate,
  selectedCandidate,
}: {
  candidates: Candidate[]
  setSelectedCandidate: (candidate: Candidate) => void
  selectedCandidate: Candidate | null
}) {
  return (
    <div className="space-y-2 pb-4">
      {candidates.length === 0 ? (
        <p className="text-center text-gray-500 py-4 text-sm">No candidates match your filters</p>
      ) : (
        <>
          <p className="text-xs text-gray-500 mb-1">{candidates.length} candidates found</p>
          {candidates.map((candidate) => (
            <Card
              key={candidate.id}
              className={`cursor-pointer hover:bg-gray-100 transition-colors ${
                selectedCandidate?.id === candidate.id ? "bg-blue-100 border-blue-500" : "bg-white"
              }`}
              onClick={() => setSelectedCandidate(candidate)}
            >
              <CardContent className="p-2 sm:p-3">
                <div className="flex justify-between items-start">
                  <div className="overflow-hidden">
                    <h3 className="font-semibold text-sm truncate">{candidate.name}</h3>
                    <p className="text-xs text-gray-600 truncate">{candidate.appliedJob}</p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap ml-2">
                    {formatDate(candidate.applicationDate)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  )
}

function CandidateDetails({ candidate }: { candidate: Candidate }) {
  return (
    <Card className="h-full overflow-hidden border-0 md:border">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 sm:p-4 md:p-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{candidate.name}</h2>
          <p className="text-sm sm:text-base md:text-lg opacity-90">{candidate.appliedJob}</p>
        </div>
        <div className="p-3 sm:p-4 md:p-6 space-y-4">
          {/* Application Date */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="bg-blue-100 rounded-full p-2 sm:p-3 flex-shrink-0">
              <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Application Date</p>
              <p className="text-sm sm:text-base font-semibold">{candidate.applicationDate}</p>
            </div>
          </div>

          {/* Candidate Information */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold">Candidate Information</h3>
            <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
              <InfoItem
                icon={<MailIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />}
                label="Email"
                value={candidate.email}
              />
              <InfoItem
                icon={<PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />}
                label="Phone"
                value={candidate.phone}
              />
              <InfoItem
                icon={<MapPinIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />}
                label="Location"
                value={candidate.location}
              />
              <InfoItem
                icon={<BriefcaseIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />}
                label="Experience"
                value={candidate.experience}
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold">Skills</h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {candidate.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 text-xs sm:text-sm font-medium px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              )) || "No skills listed"}
            </div>
          </div>

          {/* Download Button */}
          <div className="pt-2 sm:pt-4 sticky bottom-0 bg-white pb-2">
            <Button asChild className="w-full">
              <a href={candidate.cvFileUrl} download className="flex items-center justify-center">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download CV
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | undefined }) {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex-shrink-0 bg-gray-50 rounded-full p-1.5">{icon}</div>
      <div className="overflow-hidden min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold truncate">{value || "Not provided"}</p>
      </div>
    </div>
  )
}

function mapExperienceToRange(experience: string): string {
  const years = Number.parseInt(experience)
  if (isNaN(years)) return ""
  if (years === 0) return "0"
  if (years >= 1 && years <= 3) return "1-3"
  if (years >= 3 && years <= 5) return "3-5"
  return ""
}

function Filters({
  setEducationFilter,
  setExperienceFilter,
  setLanguageFilter,
  setSkillFilter,
}: {
  setEducationFilter: (value: string) => void
  setExperienceFilter: (value: string) => void
  setLanguageFilter: (value: string) => void
  setSkillFilter: (value: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="mb-3">
      <Button
        variant="outline"
        className="w-full mb-2 flex items-center justify-between text-sm"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Filter Candidates</span>
        <span className="text-xs">{isExpanded ? "▲" : "▼"}</span>
      </Button>

      {isExpanded && (
        <div className="space-y-2 bg-gray-50 p-2 rounded-md">
          <div className="grid grid-cols-2 gap-2">
            <Select onValueChange={(value) => setEducationFilter(value === "all" ? "" : value)}>
              <SelectTrigger className="text-xs h-8">
                <SelectValue placeholder="Education" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Orta">Orta</SelectItem>
                <SelectItem value="Ali">Ali</SelectItem>
                <SelectItem value="Peşə">Peşə təhsili</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setExperienceFilter(value === "all" ? "" : value)}>
              <SelectTrigger className="text-xs h-8">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="0">No Experience</SelectItem>
                <SelectItem value="1-3">1-3 Years</SelectItem>
                <SelectItem value="3-5">3-5 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Select onValueChange={(value) => setLanguageFilter(value === "all" ? "" : value)}>
              <SelectTrigger className="text-xs h-8">
                <SelectValue placeholder="Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Russian">Russian</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Skills"
              onChange={(e) => setSkillFilter(e.target.value)}
              className="text-xs h-8"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function SearchBar({ searchTerm, setSearchTerm }: { searchTerm: string; setSearchTerm: (term: string) => void }) {
  return (
    <Input
      type="text"
      placeholder="Search candidates..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="mb-2 text-sm h-9"
    />
  )
}

function SortOrder({ setSortOrder }: { sortOrder: "asc" | "desc"; setSortOrder: (order: "asc" | "desc") => void }) {
  return (
    <Select onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
      <SelectTrigger className="mb-2 w-full text-sm h-9">
        <SelectValue placeholder="Sort by date" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="desc">Newest first</SelectItem>
        <SelectItem value="asc">Oldest first</SelectItem>
      </SelectContent>
    </Select>
  )
}

function formatDate(dateString: string): string {
  // Convert YYYY-MM-DD to MM/DD format for more compact display on mobile
  try {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}`
  } catch (e : any) {
    return dateString
  }
}

