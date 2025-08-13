import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { useResumeStore } from '@/store/resumestore';

// ÖNEMLİ: Skill tipinin projenizde nasıl tanımlandığına bağlı olarak
// bu tanımı kendi dosyanızdan import etmeniz gerekebilir.
// Bu, kodun çalışması için bir varsayımdır.
type Skill = {
    id: string;
    name: string;
    level: number; // level, 0-100 arası bir sayı varsayılıyor.
};

// Kenar Çubuğu (Sidebar) için yardımcı bölüm bileşeni (Değişiklik yok)
const SidebarSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="text-lg font-bold uppercase tracking-wider text-white mb-3 border-b-2 border-gray-500 pb-2">
            {title}
        </h3>
        {children}
    </div>
);

// Ana İçerik Alanı için yardımcı bölüm bileşeni (Değişiklik yok)
const MainSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h3 className="text-xl font-bold uppercase tracking-wider text-gray-700 mb-4 border-b-2 border-gray-300 pb-2">
            {title}
        </h3>
        {children}
    </section>
);

// Beceri seviyesini göstermek için yardımcı bileşen
const SkillBar: React.FC<{ skill: Skill }> = ({ skill }) => (
    <div>
        {/* DÜZELTME: Çok uzun beceri isimlerinin taşmasını önlemek için 'break-words' eklendi. */}
        <p className="text-sm font-medium break-words">{skill.name}</p>
        <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
            <div
                className="h-2 bg-gray-500 rounded-full"
                style={{ width: `${skill.level || 100}%` }} // level yoksa %100 doldur
            ></div>
        </div>
    </div>
);


const ResumeUI2: React.FC = () => {
    const { resumeData: data } = useResumeStore();


    return (
        <div
            // style={{ minHeight: '1123px' }}
             style={{ minHeight: '100%' }}
             className="flex bg-white font-sans text-gray-800">
            {/* SOL SÜTUN (SIDEBAR) */}
            <aside className="w-1/3 bg-[#414141] text-white p-8 flex flex-col">
                {data.profilePicture && (
                    <div className="flex justify-center mb-8">
                        <img
                            src={data.profilePicture}
                            alt={`${data.firstName} ${data.lastName}` || "Profile"}
                            className="w-40 h-40 rounded-full object-cover border-4 border-gray-500"
                        />
                    </div>
                )}

                {data.summary && (
                    <SidebarSection title="About Me">
                        {/* DÜZELTME: Uzun ve bölünemeyen kelimelerin taşmasını engellemek için 'break-words' eklendi. */}
                        <p className="text-sm text-gray-300 leading-relaxed break-words">{data.summary}</p>
                    </SidebarSection>
                )}

                {(data.contact.website || data.contact.linkedin || data.contact.github) && (
                    <SidebarSection title="Website & Social Links">
                        <div className="space-y-3 text-sm text-gray-300">
                            {data.contact.linkedin && (
                                <div>
                                    Linkedin:
                                    {/* DÜZELTME: 'truncate' yerine 'break-all' kullanıldı. Bu, uzun linklerin kesilmek yerine alt satıra geçmesini sağlar. */}
                                    <a href={`https://${data.contact.linkedin}`} target="_blank"
                                       rel="noopener noreferrer" className="block hover:text-white break-all">
                                        {data.contact.linkedin}
                                    </a>
                                </div>
                            )}
                            {data.contact.github && (
                                <div>
                                    Github:
                                    <a href={`https://github.com/${data.contact.github}`} target="_blank" rel="noopener noreferrer"
                                       className="block hover:text-white break-all">
                                        {data.contact.github}
                                    </a>
                                </div>
                            )}
                            {data.contact.website && (
                                <div>
                                    Portfolio:
                                    <a href={`https://${data.contact.website}`} target="_blank"
                                       rel="noopener noreferrer"
                                       className="block hover:text-white break-all">
                                        {data.contact.website}
                                    </a>
                                </div>
                            )}
                        </div>
                    </SidebarSection>
                )}

                {data.languages?.length > 0 && (
                    <SidebarSection title="Languages">
                        {/* Dikey (space-y-3) yerine yatay ve saran (flex-wrap) bir yapı kullanıyoruz */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            {data.languages.map((lang) => (
                                // Her bir dil için basit bir flex container
                                <div key={lang.id} className="flex items-center">
                                    {/* CSS ile oluşturulmuş dairesel nokta */}
                                    <span className="h-1.5 w-1.5 bg-gray-200 rounded-full mr-2 flex-shrink-0"></span>
                                    {/* Dilin adı (büyük harf ve hafif harf aralığı ile) */}
                                    <span className="uppercase text-sm tracking-wide font-medium text-gray-300">{lang.name}</span>
                                </div>
                            ))}
                        </div>
                    </SidebarSection>
                )}
            </aside>

            {/* SAĞ SÜTUN (ANA İÇERİK) */}
            <main className="w-2/3 p-10 text-gray-700">
                <header className="flex justify-between items-start mb-10 gap-4">
                    {/*
                      DÜZELTME:
                      - İsim/unvan bloğuna `min-w-0` eklendi. Bu, flexbox'ın bu elemanı gerekirse içeriğinden daha küçük yapabilmesini sağlar.
                      - h1 ve h2'ye `break-all` eklendi. Bu, "asdasdasd..." gibi uzun, bölünemez metinlerin taşmasını engeller.
                    */}
                    <div className="min-w-0">
                        <h1 className="text-5xl font-extrabold tracking-tight text-gray-800 break-all">{`${data.firstName} ${data.lastName}` || "Michelle Robinson"}</h1>
                        <h2 className="text-xl font-semibold text-gray-500 mt-1 break-all">{data.jobTitle || "Graphic Designer"}</h2>
                    </div>
                    {/* DÜZELTME: İletişim bilgilerinin sıkışmaması için `flex-shrink-0` eklendi. */}
                    <div className="text-xs text-right space-y-1 flex-shrink-0">
                        {data.contact.phone && (
                            <span className="flex items-center justify-end">
                                <Phone className="h-3 w-3 mr-2"/> {data.contact.phone}
                            </span>
                        )}
                        {data.contact.email && (
                            // DÜZELTME: Uzun e-posta adreslerinin taşmaması için `min-w-0` ve içindeki span'e `break-all` eklendi.
                            <a href={`mailto:${data.contact.email}`}
                               className="flex items-center justify-end hover:text-gray-900 min-w-0">
                                <Mail className="h-3 w-3 mr-2 flex-shrink-0"/>
                                <span className="break-all">{data.contact.email}</span>
                            </a>
                        )}
                    </div>
                </header>

                {data.workExperience.length > 0 && (
                    <MainSection title="Work Experience">
                        <div className="relative border-l-2 border-gray-200 pl-8">
                            {data.workExperience.map((exp, index) => (
                                <div key={exp.id}
                                     className={`relative mb-8 ${index === data.workExperience.length - 1 ? 'last:mb-0' : ''}`}>
                                    <div
                                        className="absolute -left-[41px] top-1 h-4 w-4 rounded-full bg-gray-400 border-4 border-white"></div>
                                    <p className="text-sm text-gray-500 font-medium">{exp.startDate || "Start"} - {exp.endDate || "End"}</p>
                                    {/* DÜZELTME: `break-words` ile uzun unvanların taşması engellendi. */}
                                    <h4 className="text-lg font-bold mt-1 break-words">{exp.jobTitle || "Job Title"}</h4>
                                    <p className="text-md font-semibold text-gray-600 mb-2 break-words">{exp.company || "Company Name"}</p>
                                    <p className="text-sm leading-relaxed break-words">
                                        {exp.responsibilities.join(' ')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </MainSection>
                )}

                {data.education.length > 0 && (
                    <MainSection title="Education">
                        <div className="relative border-l-2 border-gray-200 pl-8">
                            {data.education.map((edu, index) => (
                                <div key={edu.id}
                                     className={`relative mb-8 ${index === data.education.length - 1 ? 'last:mb-0' : ''}`}>
                                    <div
                                        className="absolute -left-[41px] top-1 h-4 w-4 rounded-full bg-gray-400 border-4 border-white"></div>
                                    <p className="text-sm text-gray-500 font-medium">{edu.graduationYear || "Year"}</p>
                                    {/* DÜZELTME: `break-words` ile uzun derece/kurum adlarının taşması engellendi. */}
                                    <h4 className="text-lg font-bold mt-1 break-words">{edu.degree || "Degree"}</h4>
                                    <p className="text-md font-semibold text-gray-600 break-words">{edu.institution || "Institution Name"}</p>
                                    {edu.details && <p className="text-sm italic mt-1 break-words">{edu.details}</p>}
                                </div>
                            ))}
                        </div>
                    </MainSection>
                )}

                {data.skills.length > 0 && (
                    <MainSection title="Skills">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            {/* Becerileri ikiye bölmek yerine tümünü haritalayıp grid'in kendisinin yerleştirmesini sağlamak daha dinamiktir. */}
                            {data.skills.map((skill) => (
                                <SkillBar key={skill.id} skill={skill}/>
                            ))}
                        </div>
                    </MainSection>
                )}
            </main>
        </div>
    );
};

export default ResumeUI2;
