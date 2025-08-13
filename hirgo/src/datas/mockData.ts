export interface Candidate {
    id: string;
    name: string;
    appliedJob: string;
    applicationDate: string;
    cvFileUrl: string;
    email: string;
    phone: string;
    location: string;
    experience: string;
    education: string;
    skills: string[];
    languages: string[],
}

export const mockCandidates: Candidate[] = [
    {
        id: '1',
        name: 'John Doe',
        appliedJob: 'Frontend Developer',
        applicationDate: '2023-06-15',
        cvFileUrl: '/cv/john-doe-cv.pdf',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        experience: '5 years',
        education: 'Ali',
        languages: ['English', 'Russian'],
        skills: ['React', 'TypeScript', 'CSS', 'HTML', 'JavaScript'],
    },
    {
        id: '2',
        name: 'Jane Smith',
        appliedJob: 'UX Designer',
        applicationDate: '2023-06-10',
        cvFileUrl: '/cv/jane-smith-cv.pdf',
        email: 'jane.smith@example.com',
        phone: '+1 (555) 987-6543',
        location: 'San Francisco, CA',
        experience: '3 years',
        education: 'Ali',
        languages: ['English', 'Russian'],
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Wireframing'],
    },
    {
        id: '3',
        name: 'Mike Johnson',
        appliedJob: 'Backend Developer',
        applicationDate: '2023-06-20',
        cvFileUrl: '/cv/mike-johnson-cv.pdf',
        email: 'mike.johnson@example.com',
        phone: '+1 (555) 246-8135',
        location: 'Chicago, IL',
        experience: '7 years',
        education: 'Ali',
        languages: ['English', 'Russian'],
        skills: ['Node.js', 'Python', 'MongoDB', 'SQL', 'Docker'],
    },
    {
        id: '4',
        name: 'Emily Brown',
        appliedJob: 'Data Scientist',
        applicationDate: '2023-06-18',
        cvFileUrl: '/cv/emily-brown-cv.pdf',
        email: 'emily.brown@example.com',
        phone: '+1 (555) 369-2580',
        location: 'Boston, MA',
        experience: '4 years',
        education: 'Ali',
        skills: ['Python', 'R', 'Machine Learning', 'Data Visualization', 'SQL'],
        languages: ['English', 'Russian'],
    },
    {
        id: '5',
        name: 'Alex Lee',
        appliedJob: 'DevOps Engineer',
        applicationDate: '2023-06-22',
        cvFileUrl: '/cv/alex-lee-cv.pdf',
        email: 'alex.lee@example.com',
        phone: '+1 (555) 159-7530',
        location: 'Seattle, WA',
        experience: '6 years',
        education: 'Ali',
        languages: ['English', 'Russian'],
        skills: ['AWS', 'Kubernetes', 'Jenkins', 'Terraform', 'Linux'],
    }
];

