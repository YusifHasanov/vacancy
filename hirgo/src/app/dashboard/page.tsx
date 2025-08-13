"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import {
    Clock,
    Download,
    ExternalLink,
    Filter,
    MoreHorizontal,
    PlusCircle,
    RefreshCcw,
    Users,
    Briefcase,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    return (
        <DashboardLayout>
            <div className="flex items-center justify-between space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="h-9">
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                    <Button size="sm" className="h-9" onClick={() => router.push("/dashboard/vacancies/new")}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Vacancy
                    </Button>
                </div>
            </div>

            <div className="space-y-4 mt-6">
                {/* Key Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Vacancies</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24</div>
                            <p className="text-xs text-muted-foreground">+2 from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Vacancies</CardTitle>
                            <Filter className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">+1 from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">156</div>
                            <p className="text-xs text-muted-foreground">+43 from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Applicants</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">32</div>
                            <p className="text-xs text-muted-foreground">+18% from last week</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Applicants Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Applicants</CardTitle>
                        <CardDescription>You received 32 applicants this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <div className="w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead>
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium">Applicant</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Position</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Applied</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { name: "Emma Wilson", position: "Senior Developer", date: "Mar 21, 2023", status: "Review" },
                                            {
                                                name: "Michael Brown",
                                                position: "Marketing Specialist",
                                                date: "Mar 20, 2023",
                                                status: "Screening",
                                            },
                                            {
                                                name: "Olivia Davis",
                                                position: "Product Designer",
                                                date: "Mar 19, 2023",
                                                status: "Interview",
                                            },
                                            { name: "James Taylor", position: "Data Analyst", date: "Mar 18, 2023", status: "New" },
                                            { name: "Sophia Martinez", position: "Content Writer", date: "Mar 17, 2023", status: "Review" },
                                        ].map((application, i) => (
                                            <tr
                                                key={i}
                                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                            >
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center">
                                                        <Avatar className="h-8 w-8 mr-2">
                                                            <AvatarFallback>
                                                                {application.name
                                                                    .split(" ")
                                                                    .map((n) => n[0])
                                                                    .join("")}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        {application.name}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">{application.position}</td>
                                                <td className="p-4 align-middle">{application.date}</td>
                                                <td className="p-4 align-middle">
                                                    <Badge
                                                        variant={
                                                            application.status === "New"
                                                                ? "default"
                                                                : application.status === "Review"
                                                                    ? "secondary"
                                                                    : application.status === "Screening"
                                                                        ? "outline"
                                                                        : "default"
                                                        }
                                                    >
                                                        {application.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                            <DropdownMenuItem>Download Resume</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>Reject Application</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                        <Button variant="outline">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View All Applicants
                        </Button>
                    </CardFooter>
                </Card>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <Button className="justify-start" variant="outline">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create New Vacancy
                            </Button>
                            <Button className="justify-start" variant="outline">
                                <Users className="mr-2 h-4 w-4" />
                                Review Applicants
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 md:col-span-1 lg:col-span-3">
                        <CardHeader className="flex flex-row justify-between items-start">
                            <div>
                                <CardTitle>Vacancy Status Overview</CardTitle>
                                <CardDescription>Current status of all your vacancies</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                See All
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {[
                                    { title: "Senior Frontend Developer", department: "Engineering", applicants: 28, status: "Active" },
                                    { title: "Marketing Manager", department: "Marketing", applicants: 15, status: "Active" },
                                    { title: "UX/UI Designer", department: "Design", applicants: 34, status: "Closing Soon" },
                                    { title: "Data Analyst", department: "Analytics", applicants: 12, status: "Draft" },
                                ].map((vacancy, i) => (
                                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                                        <div>
                                            <p className="font-medium">{vacancy.title}</p>
                                            <p className="text-sm text-muted-foreground">{vacancy.department}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm text-muted-foreground">{vacancy.applicants} applicants</div>
                                            <Badge
                                                variant={
                                                    vacancy.status === "Active"
                                                        ? "default"
                                                        : vacancy.status === "Closing Soon"
                                                            ? "destructive"
                                                            : "outline"
                                                }
                                            >
                                                {vacancy.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}

