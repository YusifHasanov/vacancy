import { api } from "@/app/services/api";

export interface DashboardMetrics {
    totalVacancies: number;
    activeVacancies: number;
    totalApplicants: number;
    newApplicants: number;
}

export interface RecentApplicant {
    id: number;
    fullName: string;
    email: string;
    createdAt: string;
}

export interface RecentVacancy {
    id: string;
    title: string;
    applicants: number;
    status: string;
}

export interface DashboardResponse {
    metrics: DashboardMetrics;
    recentApplicants: RecentApplicant[];
    vacancyOverview: RecentVacancy[];
}

export const dashboardApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCompanyDashboard: builder.query<DashboardResponse, void>({
            query: () => ({
                url: `v1/dashboard/company`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetCompanyDashboardQuery } = dashboardApi;


