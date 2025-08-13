import React from "react";
import { Mail, Phone, Linkedin, Github, Globe, CalendarDays } from "lucide-react";
import { useResumeStore } from "@/store/resumestore";

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({
                                                                                                 title,
                                                                                                 children,
                                                                                                 className
                                                                                             }) => (
    <section className={`mb-5 ${className}`}>
        <h3 className="text-sm font-bold text-sky-700 dark:text-sky-500 border-b-2 border-sky-600 dark:border-sky-400 pb-1 mb-2 tracking-wider uppercase">
            {title}
        </h3>
        {children}
    </section>
);

const ResumeUI1: React.FC = () => {
    const { resumeData: data } = useResumeStore();

    return (
        // overflow-hidden, en dış katmanda bir güvenlik ağı görevi görür.
        <div className="bg-white p-8 font-sans text-gray-800 overflow-hidden">
            <header className="text-center mb-6">
                {/*
                  DÜZELTME:
                  - `break-words` yerine `break-all` kullanıldı.
                  - `break-all`, "asddassdass..." gibi boşluk içermeyen çok uzun metinlerin herhangi bir karakterden sonra alt satıra geçmesini zorunlu kılar.
                  - Bu, ekran görüntüsündeki taşma sorununu doğrudan çözer.
                */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-50 break-all">
                    {`${data.firstName} ${data.lastName}` || "Your Name"}
                </h1>
                <h2 className="text-lg sm:text-xl text-sky-600 dark:text-sky-400 font-semibold break-all">
                    {data.jobTitle || "Your Job Title"}
                </h2>

                <div
                    className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300 flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
                    {data.contact.email && (
                        // Bu yapı, uzun e-posta adresleri için zaten sağlamdır.
                        <a href={`mailto:${data.contact.email}`}
                           className="flex items-center hover:text-sky-600 dark:hover:text-sky-400 min-w-0">
                            <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                            <span className="break-all">{data.contact.email}</span>
                        </a>
                    )}
                    {data.contact.phone && (
                        <span className="flex items-center">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1"/> {data.contact.phone}
                        </span>
                    )}
                    {data.contact.linkedin && (
                        <a href={`https://${data.contact.linkedin}`} target="_blank" rel="noopener noreferrer"
                           className="flex items-center hover:text-sky-600 dark:hover:text-sky-400 min-w-0">
                            <Linkedin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                            <span className="break-all">{data.contact.linkedin}</span>
                        </a>
                    )}
                    {data.contact.github && (
                        <a href={`https://github.com/${data.contact.github}`} target="_blank" rel="noopener noreferrer"
                           className="flex items-center hover:text-sky-600 dark:hover:text-sky-400 min-w-0">
                            <Github className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                            <span className="break-all">{data.contact.github}</span>
                        </a>
                    )}
                    {data.contact.website && (
                        <a href={`https://${data.contact.website}`} target="_blank" rel="noopener noreferrer"
                           className="flex items-center hover:text-sky-600 dark:hover:text-sky-400 min-w-0">
                            <Globe className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                            <span className="break-all">{data.contact.website}</span>
                        </a>
                    )}
                </div>
            </header>

            {data.summary && (
                <Section title="Summary">
                    {/* Paragraflar için `break-words` genellikle daha iyidir, çünkü kelimeleri tercih eder. */}
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed break-words">{data.summary}</p>
                </Section>
            )}

            {data.workExperience.length > 0 && (
                <Section title="Work Experience">
                    {data.workExperience.map((exp) => (
                        <div key={exp.id} className="mb-3 last:mb-0">
                            <h4 className="text-base sm:text-lg font-semibold text-gray-750 dark:text-gray-100 break-words">{exp.jobTitle || "Job Title"}</h4>
                            <div className="flex flex-wrap justify-between items-baseline gap-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-0.5">
                                <span className="font-medium break-words min-w-0">{exp.company || "Company Name"}</span>
                                <span className="flex items-center flex-shrink-0 whitespace-nowrap">
                                    <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-gray-500 dark:text-gray-400" />
                                    {exp.startDate || "Start Date"} - {exp.endDate || "End Date"}
                                </span>
                            </div>
                            {exp.responsibilities && exp.responsibilities.length > 0 && exp.responsibilities[0] !== "" && (
                                <ul className="list-disc list-outside ml-4 text-xs sm:text-sm text-gray-700 dark:text-gray-200 space-y-0.5">
                                    {exp.responsibilities.map((resp, i) => (
                                        <li key={i} className="leading-snug break-words">{resp}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </Section>
            )}

            {data.education.length > 0 && (
                <Section title="Education">
                    {data.education.map((edu) => (
                        <div key={edu.id} className="mb-3 last:mb-0">
                            <h4 className="text-base sm:text-lg font-semibold text-gray-750 dark:text-gray-100 break-words">{edu.degree || "Degree / Certificate"}</h4>
                            <div className="flex flex-wrap justify-between items-baseline gap-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-0.5">
                                <span className="font-medium break-words min-w-0">{edu.institution || "Institution Name"}</span>
                                <span className="flex items-center flex-shrink-0 whitespace-nowrap">
                                    <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-gray-500 dark:text-gray-400" />
                                    {edu.graduationYear || "Graduation Year"}
                                </span>
                            </div>
                            {edu.details &&
                                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 italic break-words">{edu.details}</p>}
                        </div>
                    ))}
                </Section>
            )}

            {data.skills.length > 0 && (
                <Section title="Skills">
                    <ul className="flex flex-wrap gap-2 mt-1">
                        {data.skills.map((skill) => (
                            <li
                                key={skill.id}
                                className="bg-sky-100 dark:bg-sky-700 text-sky-700 dark:text-sky-200 text-sm px-3 py-1 rounded-full font-medium min-h-[32px] flex items-center text-center break-all"
                            >
                                {skill.name}
                            </li>
                        ))}
                    </ul>
                </Section>
            )}
        </div>
    );
};

export default ResumeUI1;
