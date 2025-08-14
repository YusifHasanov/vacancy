import { type Applicant, EXPERIENCE_LEVELS, EDUCATION_LEVELS, LANGUAGE_SKILLS, WORK_SCHEDULES } from "@/lib/data-lookups";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // CardDescription removed as it wasn't used in CardHeader
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Briefcase,
    CalendarDays,
    DollarSign,
    Download,
    // FileText, // Not used
    Github,
    GraduationCap,
    Languages,
    Linkedin,
    Mail,
    // MapPin, // Not used
    Phone,
    // User, // Not used directly in this file, Info used instead
    Clock,
    Edit3,
    Info,
    Sparkles,
    Award,
    BookOpen
} from "lucide-react";
import Link from "next/link";
interface ApplicantProfileDisplayProps {
    applicant: Applicant;
}
const formatDate = (dateString: string, includeTime: boolean = false) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date";
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        return date.toLocaleDateString(undefined, options);
    } catch (error) {
        return dateString;
    }
};
const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};
const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | React.ReactNode }) => (
    <div className="flex items-start space-x-3">
        <span className="text-primary pt-1">{icon}</span> {/* Keeping primary color for icon emphasis */}
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-base text-foreground">{value}</p> {/* Ensured value text is standard foreground */}
        </div>
    </div>
);
export function ApplicantProfileDisplay({ applicant }: ApplicantProfileDisplayProps) {
    return (
        // Solid, light neutral background for the page
        <div className="bg-slate-50 min-h-screen p-4 md:p-8 selection:bg-primary/20">
            <div className="container mx-auto max-w-5xl">
                {/* Header Section */}
                <header className="mb-10">
                    {/* Simplified header card: no backdrop-blur, subtle shadow, light border */}
                    <Card className="overflow-hidden shadow-sm border border-slate-200 bg-background">
                        {/* Removed bg-primary/10 from this div */}
                        <div className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                {/* Simplified Avatar: reduced border, no ring, subtle shadow */}
                                <Avatar className="h-28 w-28 md:h-36 md:w-36 border-2 border-background shadow-sm">
                                    <AvatarImage src={applicant.profilePictureUrl} alt={`${applicant.firstName} ${applicant.lastName}`} />
                                    <AvatarFallback className="text-4xl bg-muted"> {/* Changed fallback bg to muted */}
                                        {getInitials(applicant.firstName, applicant.lastName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
                                        {applicant.firstName} {applicant.lastName}
                                    </h1>
                                    <p className="text-lg text-muted-foreground mt-1">
                                        {EXPERIENCE_LEVELS[applicant.experienceLevelId] || "N/A"} professional
                                    </p>
                                    <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                                        <div className="flex items-center justify-center md:justify-start gap-2 hover:text-primary transition-colors">
                                            <Mail className="h-4 w-4" />
                                            <a href={`mailto:${applicant.email}`}>{applicant.email}</a>
                                        </div>
                                        <div className="flex items-center justify-center md:justify-start gap-2 hover:text-primary transition-colors">
                                            <Phone className="h-4 w-4" />
                                            <span>{applicant.phone}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center md:items-end space-y-3 mt-4 md:mt-0">
                                    {/* Primary button retains its style for emphasis */}
                                    <Button size="lg" asChild className="w-full md:w-auto shadow-sm hover:shadow-md transition-shadow bg-primary hover:bg-primary/90 text-primary-foreground">
                                        <Link href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer" download>
                                            <Download className="mr-2 h-5 w-5" /> Download Resume
                                        </Link>
                                    </Button>
                                    <div className="flex gap-2">
                                        {applicant.linkedInUrl && (
                                            <Button variant="outline" size="icon" className="rounded-full shadow-xs hover:shadow-sm transition-shadow border-slate-300" asChild>
                                                <Link href={applicant.linkedInUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                                                    <Linkedin className="h-5 w-5 text-blue-600" />
                                                </Link>
                                            </Button>
                                        )}
                                        {applicant.githubUrl && (
                                            <Button variant="outline" size="icon" className="rounded-full shadow-xs hover:shadow-sm transition-shadow border-slate-300" asChild>
                                                <Link href={applicant.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                                                    <Github className="h-5 w-5 text-gray-800" />
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </header>
                {/* Main Content Grid */}
                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Left Column / First Card on Mobile */}
                    <div className="lg:col-span-1 space-y-6 md:space-y-8">
                        {/* Content Cards: subtle shadow, light border, no header background tint */}
                        <Card className="shadow-sm hover:shadow-md transition-shadow border border-slate-200 bg-background">
                            {/* Removed bg-muted/30 from CardHeader */}
                            <CardHeader>
                                <CardTitle className="flex items-center text-xl font-semibold text-foreground"> {/* Title text to standard foreground */}
                                    <Info className="mr-2 h-5 w-5 text-primary" /> Personal Information {/* Icon color primary for emphasis */}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <DetailItem
                                    icon={<CalendarDays className="h-5 w-5" />}
                                    label="Date of Birth"
                                    value={formatDate(applicant.dateOfBirth)}
                                />
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm hover:shadow-md transition-shadow border border-slate-200 bg-background">
                            <CardHeader>
                                <CardTitle className="flex items-center text-xl font-semibold text-foreground">
                                    <Languages className="mr-2 h-5 w-5 text-primary" /> Language Skills
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {applicant.languageSkillsIds.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {applicant.languageSkillsIds.map((id) => (
                                            <Badge key={id} variant="secondary" className="px-3 py-1 text-sm font-medium shadow-xs border border-slate-200"> {/* Subtle border on badge */}
                                                {LANGUAGE_SKILLS[id] || `Unknown ID: ${id}`}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No language skills listed.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column / Second set of Cards on Mobile */}
                    <div className="lg:col-span-2 space-y-6 md:space-y-8">
                        <Card className="shadow-sm hover:shadow-md transition-shadow border border-slate-200 bg-background">
                            <CardHeader>
                                <CardTitle className="flex items-center text-xl font-semibold text-foreground">
                                    <Sparkles className="mr-2 h-5 w-5 text-primary" /> Professional Profile
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <DetailItem
                                    icon={<Award className="h-5 w-5" />}
                                    label="Experience Level"
                                    value={EXPERIENCE_LEVELS[applicant.experienceLevelId] || "N/A"}
                                />
                                <DetailItem
                                    icon={<GraduationCap className="h-5 w-5" />}
                                    label="Education Level"
                                    value={EDUCATION_LEVELS[applicant.educationLevelId] || "N/A"}
                                />
                                <DetailItem
                                    icon={<Briefcase className="h-5 w-5" />}
                                    label="Preferred Work Schedule"
                                    value={WORK_SCHEDULES[applicant.workScheduleId] || "N/A"}
                                />
                                {applicant.expectedSalary && (
                                    <DetailItem
                                        icon={<DollarSign className="h-5 w-5" />}
                                        label="Expected Salary (USD)"
                                        value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(applicant.expectedSalary)}
                                    />
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm hover:shadow-md transition-shadow border border-slate-200 bg-background">
                            <CardHeader>
                                <CardTitle className="flex items-center text-xl font-semibold text-foreground">
                                    <BookOpen className="mr-2 h-5 w-5 text-primary" /> Application Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4 text-sm">
                                <div className="flex justify-between items-center text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>Profile Created:</span>
                                    </div>
                                    <span className="text-foreground">{formatDate(applicant.createdAt, true)}</span>
                                </div>
                                <Separator className="my-3" /> {/* Added margin to separator for clarity */}
                                <div className="flex justify-between items-center text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Edit3 className="h-4 w-4" />
                                        <span>Last Updated:</span>
                                    </div>
                                    <span className="text-foreground">{formatDate(applicant.updatedAt, true)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
