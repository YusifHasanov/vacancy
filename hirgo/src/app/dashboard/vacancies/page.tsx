"use client";

import JobVacanciesPage from "@/components/dashboard/vacancies/job-vacancies-page"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function VacanciesPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center w-full min-h-[500px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Loading vacancies...</p>
        </div>
      }>
        <JobVacanciesPage />
      </Suspense>
    </DashboardLayout>
  );
}

