export type JobGrade =
    | "Experienced Köməkçi"
    | "mutaxəssis"
    | "manager"
    | "Director"
    | "up guidance"

export type JobType =
    | "Full"
    | "I'm not sure"
    | "experience"
    | "temporary"
    | "distance"
    | "Frilans (Xidmət)"

export type SalaryRange =
    | "0-500"
    | "500-1000"
    | "1000-2000"
    | "2000-5000"
    | "5000+"

export type PostingType =
    | "job postings"
    | "Experience program"
    | "Taqaud program"
    | "Tender"
    | "Qrant"
    | "Other"

export interface Job {
    id: string
    title: string
    companyName: string
    companyLogo: string
    views: number
    postedAt: Date
    isFavorite: boolean
    grade: string
    type: string
    salary: string
    location: string
    postingType: string
    description: {
        duties: string[]
        education: string[]
        experience: string[]
        requiredSkills: string[]
        preferredSkills: string[]
    }
    applicationDeadline: Date
    category: string
    schedule: string
}