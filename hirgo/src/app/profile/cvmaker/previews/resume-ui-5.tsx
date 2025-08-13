import React from "react";
import {
    Mail,
    Phone,
    MapPin,
} from "lucide-react";
import { useResumeStore } from "@/store/resumestore";

// Renk paleti
const COLORS = {
    primary: '#1e293b', // Koyu Lacivert (slate-800)
    secondary: '#b49b6c', // Altın Sarısı/Taba
    background: '#f1f5f9', // Açık Gri Arkaplan (slate-100)
    textDark: '#334155', // Koyu Metin (slate-700)
    textLight: '#64748b', // Açık Metin (slate-500)
};

// --- YARDIMCI BİLEŞENLER ---

// Sol Sütun (Kenar Çubuğu) Bölüm Başlığı
const SidebarSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8 w-full">
        <h3 style={{ color: COLORS.primary }} className="text-base font-bold uppercase tracking-[0.2em] mb-3">{title}</h3>
        <div style={{ backgroundColor: COLORS.primary }} className="h-px w-full opacity-50 mb-4"></div>
        {children}
    </section>
);

// Sağ Sütun (Ana İçerik) Bölüm Başlığı
const MainSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h3 style={{ color: COLORS.primary }} className="text-base font-bold uppercase tracking-[0.2em] mb-3">{title}</h3>
        <div style={{ backgroundColor: COLORS.primary }} className="h-px w-full opacity-50 mb-6"></div>
        {children}
    </section>
);

// Beceri/Dil için ilerleme çubuğu bileşeni
const LevelBar: React.FC<{ name: string; level: number }> = ({ name, level }) => (
    <div className="mb-4">
        <p style={{ color: COLORS.textDark }} className="text-sm font-medium">{name}</p>
        <div className="h-1.5 w-full bg-gray-300 mt-1">
            <div style={{ backgroundColor: COLORS.secondary , width: `${level}%`}} className="h-1.5" ></div>
        </div>
    </div>
);


// --- ANA CV BİLEŞENİ ---

const ResumeUI5: React.FC = () => {
    const { resumeData: data } = useResumeStore();

    const getInitials = () => {
        const first = data.firstName?.[0] || '';
        const last = data.lastName?.[0] || '';
        return first && last ? `${first} | ${last}` : (first || last);
    };

    return (
        <div
            style={{
                minHeight: '100%',
            }}
            className="bg-white font-sans flex  shadow-lg">

            {/* === SOL SÜTUN (SIDEBAR) === */}
            <aside style={{ backgroundColor: COLORS.background }} className="w-1/3 p-8 flex flex-col items-center">
                {data.profilePicture && (
                    <img
                        src={data.profilePicture}
                        alt="Profile"
                        className="w-36 h-36 rounded-full object-cover mb-8 border-4 border-white shadow-md"
                    />
                )}

                {data.education?.length > 0 && (
                    <SidebarSection title="Education">
                        <div className="space-y-6">
                            {data.education.map(edu => (
                                <div key={edu.id}>
                                    <h4 style={{ color: COLORS.primary }} className="text-sm font-bold uppercase">{edu.degree}</h4>
                                    <p style={{ color: COLORS.secondary }} className="text-sm italic my-1">
                                        {edu.institution} / {edu.location} / {edu.graduationYear}
                                    </p>
                                    <p style={{ color: COLORS.textLight }} className="text-xs leading-relaxed">{edu.details}</p>
                                </div>
                            ))}
                        </div>
                    </SidebarSection>
                )}

                {data.languages?.length > 0 && (
                    <SidebarSection title="Languages">
                        <div className="space-y-2">
                            {data.languages.map(lang => (
                                <LevelBar key={lang.id} name={lang.name} level={lang.level} />
                            ))}
                        </div>
                    </SidebarSection>
                )}
            </aside>

            {/* === SAĞ SÜTUN (ANA İÇERİK) === */}
            <main className="w-2/3 bg-white flex flex-col">

                {/* Başlık (Header) */}
                <header style={{ backgroundColor: COLORS.primary, color: 'white' }} className="p-10 text-center">
                    <p className="text-lg tracking-[0.5em] opacity-80 mb-2">{getInitials() || "C | M"}</p>
                    <h1 className="text-5xl font-bold tracking-wider break-words">{data.firstName || "CARLA"} <span className="font-light">{data.lastName || "MORANDI"}</span></h1>
                    <div className="w-full my-4 flex items-center justify-center gap-4">
                        <div style={{ borderColor: COLORS.secondary }} className="flex-grow border-t opacity-50"></div>
                        <h2 style={{ color: COLORS.secondary }} className="text-sm uppercase tracking-[0.3em]">{data.jobTitle || "MARKETING MANAGER"}</h2>
                        <div style={{ borderColor: COLORS.secondary }} className="flex-grow border-t opacity-50"></div>
                    </div>
                    <div className="flex justify-around items-center mt-6 text-xs tracking-wider opacity-90">
                        {data.contact.address && (
                            <div className="flex items-center gap-2">
                                <MapPin style={{ color: COLORS.secondary }} className="h-4 w-4" />
                                <span>{data.contact.address}</span>
                            </div>
                        )}
                        {data.contact.phone && (
                            <>
                                <div style={{ borderColor: 'white' }} className="h-6 border-l opacity-30"></div>
                                <div className="flex items-center gap-2">
                                    <Phone style={{ color: COLORS.secondary }} className="h-4 w-4" />
                                    <span>{data.contact.phone}</span>
                                </div>
                            </>
                        )}
                        {data.contact.email && (
                            <>
                                <div style={{ borderColor: 'white' }} className="h-6 border-l opacity-30"></div>
                                <a href={`mailto:${data.contact.email}`} className="flex items-center gap-2 hover:text-white">
                                    <Mail style={{ color: COLORS.secondary }} className="h-4 w-4" />
                                    <span>{data.contact.email}</span>
                                </a>
                            </>
                        )}
                    </div>
                </header>

                {/* İçerik Alanı */}
                <div className="p-10">
                    {data.summary && (
                        <p style={{ color: COLORS.textLight }} className="text-sm leading-relaxed mb-8">{data.summary}</p>
                    )}

                    {data.workExperience?.length > 0 && (
                        <MainSection title="Work Experience">
                            <div className="space-y-6">
                                {data.workExperience.map(exp => (
                                    <div key={exp.id}>
                                        <h4 style={{ color: COLORS.primary }} className="text-sm font-bold uppercase">{exp.jobTitle}</h4>
                                        <p style={{ color: COLORS.secondary }} className="text-sm italic my-1">
                                            {exp.company} / {exp.startDate} - {exp.endDate} / {exp.location}
                                        </p>
                                        <p style={{ color: COLORS.textLight }} className="text-xs leading-relaxed">
                                            {exp.responsibilities.join(' ')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </MainSection>
                    )}

                    {data.skills?.length > 0 && (
                        <MainSection title="Skills">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                {data.skills.map(skill => (
                                    <LevelBar key={skill.id} name={skill.name} level={skill.level} />
                                ))}
                            </div>
                        </MainSection>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ResumeUI5;
