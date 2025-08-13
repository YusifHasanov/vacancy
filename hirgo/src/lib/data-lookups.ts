export const EXPERIENCE_LEVELS: { [key: number]: string } = {
    1: "Entry-Level",
    2: "Junior",
    3: "Mid-Level",
    4: "Senior",
    5: "Lead",
    6: "Principal",
  };
  
  export const EDUCATION_LEVELS: { [key: number]: string } = {
    1: "High School Diploma",
    2: "Associate's Degree",
    3: "Bachelor's Degree",
    4: "Master's Degree",
    5: "Doctorate",
    6: "PhD",
  };
  
  export const LANGUAGE_SKILLS: { [key: number]: string } = {
    1: "English",
    2: "Spanish",
    3: "French",
    4: "German",
    5: "Mandarin Chinese",
    6: "Japanese",
    7: "Arabic",
  };
  
  export const WORK_SCHEDULES: { [key: number]: string } = {
    1: "Full-time",
    2: "Part-time",
    3: "Contract",
    4: "Internship",
    5: "Remote",
    6: "Hybrid",
  };
  
  export interface Applicant {
    id: number; // Using number for simplicity, could be string for very large IDs
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profilePictureUrl: string;
    dateOfBirth: string; // Assuming "YYYY-MM-DD" string format for LocalDate
    linkedInUrl?: string;
    githubUrl?: string;
    resumeUrl: string;
    experienceLevelId: number;
    educationLevelId: number;
    languageSkillsIds: number[];
    workScheduleId: number;
    expectedSalary?: number; // Assuming it's optional
    createdAt: string; // Assuming ISO string format for LocalDateTime
    updatedAt: string; // Assuming ISO string format for LocalDateTime
  }