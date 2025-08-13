import CandidatesScreen from "@/components/candidates-screen";
import { DashboardLayout } from "@/components/dashboard/layout";

export default function AddVacancyPage() {
  return (
    <DashboardLayout className="!p-0">
        <CandidatesScreen />
    </DashboardLayout>
  )
}