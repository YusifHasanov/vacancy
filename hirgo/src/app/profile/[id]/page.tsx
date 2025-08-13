
import { ApplicantProfileDisplay } from "@/components/profile-applicant/applicant-profile-display";
import { type Applicant } from "@/lib/data-lookups";

// Mock data fetching function
function getApplicantData(id: string): Applicant | null {
  // In a real app, you would fetch this from your database/API
  // For now, returning mock data, ignoring the id for simplicity in this example
  console.log(`Fetching data for applicant ID: ${id}`);
  
  // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 500));

  const mockApplicant: Applicant = {
    id: 12345,
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    phone: "555-123-4567",
    profilePictureUrl: "/placeholder.svg?width=128&height=128&query=female+professional+profile+picture", // Placeholder
    dateOfBirth: "1990-07-15",
    linkedInUrl: "https://www.linkedin.com/in/janedoe",
    githubUrl: "https://github.com/janedoe",
    resumeUrl: "/path/to/jane_doe_resume.pdf", // Placeholder link
    experienceLevelId: 4, // Senior
    educationLevelId: 3, // Bachelor's Degree
    languageSkillsIds: [1, 3], // English, French
    workScheduleId: 1, // Full-time
    expectedSalary: 95000,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-05-15T14:30:00Z",
  };
  
  if (id === "not-found") return null; 

  return mockApplicant;
}


export default async function ApplicantPage({ params }: { params: { id: string } }) {
  const applicant = getApplicantData(params.id);

  if (!applicant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-muted-foreground">Applicant not found.</p>
      </div>
    );
  }

  return <ApplicantProfileDisplay applicant={applicant} />;
}