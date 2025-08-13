import React from "react";
import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Linkedin,
    Instagram,
    Twitter,
    Github,
    Globe,
    // Hobi ikonları
    Music,
    Dumbbell,
    Plane,
    Gamepad2,
    Dices
} from "lucide-react";
import { useResumeStore } from "@/store/resumestore";

// --- YARDIMCI BİLEŞENLER ---

// Ana içerik için bölüm başlığı bileşeni
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h3 className="text-lg font-bold uppercase tracking-[0.2em] text-gray-800 border-b border-gray-300 pb-2 mb-4">
            {title}
        </h3>
        {children}
    </section>
);

// Kenar çubuğu için bölüm başlığı bileşeni
const SidebarSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-800 border-b border-gray-300 pb-1 mb-4">
            {title}
        </h3>
        {children}
    </section>
);

// Beceri/Dil için ilerleme çubuğu bileşeni (Yeniden adlandırıldı ve stil güncellendi)
const LevelBar: React.FC<{ name: string; level: number }> = ({ name, level }) => (
    <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 break-words">{name}</p>
        <div className="h-1.5 w-full bg-gray-200 mt-1 rounded-full">
            <div className="h-1.5 bg-gray-800 rounded-full" style={{ width: `${level}%` }}></div>
        </div>
    </div>
);

// --- ANA CV BİLEŞENİ ---

const ResumeUI4: React.FC = () => {
    const { resumeData: data } = useResumeStore();

    const hasLinks = data.contact.linkedin || data.contact.github || data.contact.website || data.contact.facebook || data.contact.instagram || data.contact.twitter;

    return (
        <div
            style={{minHeight: '100%'}}
            className="bg-white p-8 font-sans text-gray-800 shadow-lg">

            {/* === 1. TAM GENİŞLİKLİ BAŞLIK BÖLÜMÜ === */}
            <header className="flex justify-between items-center border-b-2 border-gray-200 pb-8 mb-8">
                <div>
                    <h1 className="text-4xl font-light uppercase tracking-[0.2em] break-words">
                        {data.firstName || "ANDREW"}
                    </h1>
                    <h1 className="text-4xl font-bold uppercase tracking-[0.2em] break-all">
                        {data.lastName || "WATSON"}
                    </h1>
                    <p className="text-sm uppercase text-gray-500 tracking-[0.3em] mt-2 break-words">
                        {data.jobTitle || "GRAPHIC AND WEB DESIGNER"}
                    </p>
                </div>
                {data.profilePicture ? (
                    <img
                        src={data.profilePicture}
                        alt={`${data.firstName} ${data.lastName}` || "Profile"}
                        className="w-28 h-28 rounded-full object-cover flex-shrink-0"
                    />
                ) : (
                    <div className="w-28 h-28 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl font-bold text-gray-400">
                            {(data.firstName?.[0] || 'A')}{(data.lastName?.[0] || 'W')}
                        </span>
                    </div>
                )}
            </header>

            {/* === 2. İKİ SÜTUNLU ANA İÇERİK BÖLÜMÜ === */}
            <div className="flex gap-12">

                {/* SOL SÜTUN (SIDEBAR) */}
                <aside className="w-1/3 flex flex-col">
                    <SidebarSection title="Contacts">
                        {/*
      - `flex-col` ile öğeleri dikeyde sıralıyoruz.
      - `divide-y divide-gray-200` ile aralarına ince gri bir çizgi ekliyoruz.
    */}
                        <div className="flex flex-col divide-y divide-gray-200">
                            {data.contact.phone && (
                                // Her bir satır için dikey boşluk (py-3) ve yatay boşluk (gap-4)
                                <div className="flex items-center gap-4 py-1">
                                    {/* İkon için siyah arka planlı container */}
                                    <div className="bg-black text-white p-2 flex-shrink-0">
                                        <Phone className="h-4 w-4"/>
                                    </div>
                                    <span className="break-words text-sm text-gray-600">{data.contact.phone}</span>
                                </div>
                            )}
                            {data.contact.email && (
                                <a href={`mailto:${data.contact.email}`} className="flex items-center gap-4 py-1 group">
                                    <div className="bg-black text-white p-2 flex-shrink-0">
                                        <Mail className="h-4 w-4"/>
                                    </div>
                                    <span className="break-all text-sm text-gray-600 group-hover:text-black">{data.contact.email}</span>
                                </a>
                            )}
                            {data.contact.address && (
                                <div className="flex items-center gap-4 py-1">
                                    <div className="bg-black text-white p-2 flex-shrink-0">
                                        <MapPin className="h-4 w-4"/>
                                    </div>
                                    <span className="break-words text-sm text-gray-600">{data.contact.address}</span>
                                </div>
                            )}
                        </div>
                    </SidebarSection>

                    {hasLinks && (
                        <SidebarSection title="Links">
                            <div className="space-y-3 text-sm text-gray-600">
                                {data.contact.linkedin && (
                                    <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-black">
                                        <Linkedin className="h-4 w-4 text-gray-700 flex-shrink-0"/>
                                        <span className="break-all underline">{data.contact.linkedin.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '')}</span>
                                    </a>
                                )}
                                {data.contact.github && (
                                    <a href={data.contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-black">
                                        <Github className="h-4 w-4 text-gray-700 flex-shrink-0"/>
                                        <span className="break-all underline">{data.contact.github.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')}</span>
                                    </a>
                                )}
                                {/* Diğer linkler (facebook, twitter vb.) de buraya aynı mantıkla eklenebilir */}
                            </div>
                        </SidebarSection>
                    )}

                    {/*{data.references?.length > 0 && (*/}
                    {/*    <SidebarSection title="References">*/}
                    {/*        <div className="space-y-4">*/}
                    {/*            {data.references.map((ref) => (*/}
                    {/*                <div key={ref.id} className="text-sm text-gray-600">*/}
                    {/*                    <p className="font-semibold text-gray-800 break-words">{ref.name}</p>*/}
                    {/*                    <p className="text-xs break-words">{ref.company}</p>*/}
                    {/*                    {ref.phone && <p className="text-xs break-words">T: {ref.phone}</p>}*/}
                    {/*                    {ref.email && <p className="text-xs break-words">E: {ref.email}</p>}*/}
                    {/*                </div>*/}
                    {/*            ))}*/}
                    {/*        </div>*/}
                    {/*    </SidebarSection>*/}
                    {/*)}*/}

                    {data.languages?.length > 0 && (
                        <SidebarSection title="Languages">
                            <div className="space-y-3">
                                {data.languages?.map((lang) => (
                                    <LevelBar key={lang.id} name={lang.name} level={lang.level}/>
                                ))}
                            </div>
                        </SidebarSection>
                    )}
                </aside>

                {/* DİKEY ÇİZGİ ve SAĞ SÜTUN */}
                <main className="w-2/3 border-l border-gray-200 pl-12">
                    {data.summary && (
                        <Section title="About Me">
                            <p className="text-sm leading-relaxed text-gray-600 break-words">{data.summary}</p>
                        </Section>
                    )}

                    {data.workExperience?.length > 0 && data.workExperience[0]?.jobTitle && (
                        <Section title="Work Experience">
                            <div className="space-y-6">
                                {data.workExperience.map((exp) => (
                                    <div key={exp.id}>
                                        <h4 className="text-md font-bold text-gray-800 break-words">{exp.jobTitle}, {exp.company}</h4>
                                        <p className="text-sm italic text-gray-500 my-1 break-words">
                                            {exp.startDate} - {exp.endDate}
                                        </p>
                                        <p className="text-sm leading-relaxed text-gray-600 break-words">
                                            {exp.responsibilities?.join(' ')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {data.education?.length > 0 && data.education[0]?.degree && (
                        <Section title="Education">
                            <div className="space-y-6">
                                {data.education.map((edu) => (
                                    <div key={edu.id}>
                                        <h4 className="text-md font-bold text-gray-800 break-words">{edu.degree}, {edu.institution}</h4>
                                        <p className="text-sm italic text-gray-500 my-1 break-words">{edu.graduationYear}</p>
                                        {edu.details && <p className="text-sm leading-relaxed text-gray-600 break-words">{edu.details}</p>}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {data.skills?.length > 0 && (
                        <Section title="Skills">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                {data.skills.map((skill) => (
                                    <LevelBar key={skill.id} name={skill.name} level={skill.level}/>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/*{data.hobbies?.length > 0 && (*/}
                    {/*    <Section title="Hobbies">*/}
                    {/*        <div className="flex flex-wrap gap-x-8 gap-y-4 pt-2">*/}
                    {/*            {data.hobbies.map((hobby) => (*/}
                    {/*                <div key={hobby.id} className="flex flex-col items-center text-gray-700 w-16">*/}
                    {/*                    {hobbyIconMap[hobby.name.toLowerCase()] || <div className="h-6 w-6 mb-1"></div>}*/}
                    {/*                    <span className="text-xs tracking-wider text-center">{hobby.name}</span>*/}
                    {/*                </div>*/}
                    {/*            ))}*/}
                    {/*        </div>*/}
                    {/*    </Section>*/}
                    {/*)}*/}
                </main>
            </div>
        </div>
    );
};

export default ResumeUI4;
