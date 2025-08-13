export type VacancyStatus = "active" | "inactive" | "draft" | "closing soon"

export interface JobVacancy {
  id: string
  title: string
  category: string
  categoryId?: string
  applicants: number
  status: VacancyStatus
}

