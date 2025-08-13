export interface ContactInfo {
    email: string;
    phone: string;
    linkedin?: string;
    github?: string;
    website?: string;
    address?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
}

export interface WorkExperience {
    id: string;
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
    location?: string;
}

export interface Skill {
    id: string;
    name: string;
    level: number; // 0-100 arası bir değer
}


export interface Language {
    id: string;
    name: string;
    level: number; // 0-100 arası bir değer
}


export interface Education {
    id: string;
    degree: string;
    institution: string;
    graduationYear: string;
    details?: string;
    location?: string;
}


export interface ResumeData {
    firstName: string,
    lastName: string,
    jobTitle: string;
    contact: ContactInfo;
    summary: string;
    workExperience: WorkExperience[];
    education: Education[];
    skills: Skill[];
    languages: Language[];
    profilePicture?: string | null; // <-- BU SATIRI EKLEYİN
}

export type ResumeFormSectionProps = {
    resumeData: ResumeData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleContactChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleWorkExperienceChange: (index: number, field: keyof WorkExperience, value: string | string[]) => void;
    addWorkExperience: () => void;
    removeWorkExperience: (id: string) => void;
    handleEducationChange: (index: number, field: keyof Education, value: string) => void;
    addEducation: () => void;
    removeEducation: (id: string) => void;
    handleSkillChange: (index: number, field: keyof Skill, value: string | number) => void;
    addSkill: () => void;
    removeSkill: (id: string) => void;
    handleImageUpload: (file: File) => void;
};


export interface ResumePreviewProps {
    data: ResumeData;
}


export type UiType = 'ui1' | 'ui2' | 'ui3' | 'ui4' | 'ui5';

export interface CommonApiResponse<T> {
    data: T;
    status: {
        code: string;
        message: string;
    };
}
