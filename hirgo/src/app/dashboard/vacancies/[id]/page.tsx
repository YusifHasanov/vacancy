"use client";

import { DashboardLayout } from "@/components/dashboard/layout";
import JobDetailsVacancyForm from "@/components/dashboard/vacancies/update/job-details-vacancy-form";
import { Suspense, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { use } from "react";

export default function UpdateVacancyPage({ params }: { params: Promise<{ id: string }> }) {
  const [isClient, setIsClient] = useState(false);
  // Unwrap the params Promise with React.use()
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  // Set isClient to true on mount
  useEffect(() => {
    console.log(`[UpdateVacancyPage] Mounting with vacancyId: ${id}`);
    setIsClient(true);
  }, [id]);

  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center w-full min-h-[500px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Loading vacancy details...</p>
        </div>
      }>
        {isClient ? (
          <JobDetailsVacancyForm vacancyId={id} />
        ) : (
          <div className="flex flex-col items-center justify-center w-full min-h-[500px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Initializing...</p>
          </div>
        )}
      </Suspense>
    </DashboardLayout>
  )
}
