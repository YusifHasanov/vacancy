import React from 'react';
import {Mail, Phone} from 'lucide-react';
import {useResumeStore} from '@/store/resumestore';

// Bölüm başlıkları için yardımcı bileşen (Değişiklik yok)
const SectionTitle: React.FC<{ title: string }> = ({title}) => (
    <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-gray-700 mb-6">{title}</h3>
);

const ResumeUI3: React.FC = () => {
    const {resumeData: data} = useResumeStore();

    return (
        <div
            style={{minHeight: "100%"}}
            // style={{ minHeight: "1123px" }}
            className="bg-white p-8 font-sans text-gray-800 shadow-lg">

            {/* BAŞLIK BÖLÜMÜ */}
            <header className="flex justify-between items-start mb-12 gap-8">
                {/* DÜZELTME: İsim bloğuna `min-w-0` ve metinlere `break-all` ekleyerek taşmaları engelliyoruz. */}
                <div className="min-w-0">
                    <h1 className="text-3xl tracking-[0.2em] font-light break-all">{data.firstName}</h1>
                    <h1 className="text-5xl tracking-[0.15em] font-bold break-all">{data.lastName}</h1>
                    <p className="text-lg tracking-[0.3em] text-gray-500 mt-2 break-words">{data.jobTitle || "LEAD UX DESIGNER"}</p>
                </div>
                {/* DÜZELTME: Profil resminin sıkışmaması için `flex-shrink-0` eklendi. */}
                {data.profilePicture ? (
                    <img
                        src={data.profilePicture}
                        alt={`${data.firstName} ${data.lastName}` || "Profile"}
                        className="w-32 h-32 rounded-full object-cover flex-shrink-0"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex-shrink-0"></div>
                )}
            </header>

            <div className="border-t border-gray-300 pt-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* SOL SÜTUN */}
                    <aside className="col-span-1">
                        {/* İLETİŞİM */}
                        <div className="mb-10">
                            <SectionTitle title="Contact"/>
                            <div className="space-y-3 text-sm pl-8 ">
                                {data.contact.phone && (
                                    <div className="flex items-center">
                                        <Phone className="h-4 w-4 mr-3 text-black flex-shrink-0"/>
                                        <span className="break-words">{data.contact.phone}</span>
                                    </div>
                                )}
                                {data.contact.email && (
                                    <div className="flex items-start">
                                        <Mail className="h-4 w-4 mr-3 mt-0.5 text-black flex-shrink-0"/>
                                        {/* Zaten break-all vardı, bu doğru bir kullanım. */}
                                        <a href={`mailto:${data.contact.email}`}
                                           className="hover:text-black break-all">{data.contact.email}</a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* BECERİLER */}
                        {data.skills.length > 0 && (
                            <div className="mb-10">
                                <SectionTitle title="Skills"/>
                                <div className="pl-8">
                                    <h4 className="font-bold mb-3 text-sm">PROFESSIONAL</h4>
                                    <ul className="space-y-2 text-sm list-none">
                                        {data.skills.map(skill => (
                                            // DÜZELTME: Uzun beceri isimlerinin taşmasını engellemek için `break-words`.
                                            <li key={skill.id} className="flex items-start break-words">
                                                <span
                                                    className="h-1.5 w-1.5 bg-black rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                                                {skill.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* EĞİTİM */}
                        {data.education.length > 0 && (
                            <div>
                                <SectionTitle title="Education"/>
                                <ol className="relative border-s border-gray-300">
                                    {data.education.map((edu, index) => (
                                        <li key={edu.id}
                                            className={`ms-8 ${index === data.education.length - 1 ? '' : 'mb-8'}`}>
                                            <span
                                                className="absolute flex items-center justify-center w-3 h-3 bg-black rounded-full -start-[7px] ring-4 ring-white"></span>
                                            {/* DÜZELTME: Tüm metin alanlarına `break-words` eklenerek taşma önlendi. */}
                                            <h3 className="text-md font-bold uppercase text-gray-800 break-words">{edu.degree || "DEGREE TITLE"}</h3>
                                            <p className="text-sm font-semibold text-gray-600 break-words">{edu.institution || "UNIVERSITY NAME"}</p>
                                            {edu.details &&
                                                <p className="text-sm text-gray-500 italic break-words">{edu.details}</p>}
                                            <time
                                                className="block text-sm font-normal leading-none text-gray-400 mt-1">{edu.graduationYear || "2024"}</time>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </aside>

                    {/* SAĞ SÜTUN */}
                    <main className="col-span-1 md:col-span-2">
                        {/* PROFİL */}
                        {data.summary && (
                            <div className="mb-10">
                                <SectionTitle title="Profile"/>
                                {/* DÜZELTME: Özet metninin taşmasını engellemek için `break-words`. */}
                                <p className="text-sm leading-relaxed text-gray-600 break-words">{data.summary}</p>
                            </div>
                        )}

                        {/* DENEYİM */}
                        {data.workExperience.length > 0 && (
                            <div>
                                <SectionTitle title="Experience"/>
                                <ol className="relative border-s border-gray-300">
                                    {data.workExperience.map((exp, index) => (
                                        <li key={exp.id}
                                            className={`ms-8 ${index === data.workExperience.length - 1 ? '' : 'mb-8'}`}>
                                            <span
                                                className="absolute flex items-center justify-center w-3 h-3 bg-black rounded-full -start-[7px] ring-4 ring-white"></span>

                                            {/*
                                              DÜZELTME: En kritik değişiklik.
                                              - `flex-wrap` eklendi, böylece küçük ekranlarda veya uzun metinlerde tarih alta kayabilir.
                                              - Unvanın (h3) etrafına min-w-0 içeren bir div sarmalandı. Bu, unvanın küçülüp satır atlamasına izin verir.
                                              - Tarih (time) elemanına `flex-shrink-0` eklendi, böylece sıkışmaz.
                                            */}
                                            <div className="flex flex-wrap justify-between items-start gap-x-4 mb-1">
                                                <div className="min-w-0">
                                                    <h3 className="text-lg font-bold text-gray-800 break-words">{exp.jobTitle || "JOB TITLE HERE"}</h3>
                                                </div>
                                                <time
                                                    className="text-sm font-normal leading-none text-gray-400 flex-shrink-0 whitespace-nowrap">
                                                    {exp.startDate || "2024"} - {exp.endDate || "PRESENT"}
                                                </time>
                                            </div>
                                            <p className="text-md font-semibold text-gray-600 mb-2 break-words">{exp.company || "COMPANY NAME"}</p>

                                            {exp.responsibilities && exp.responsibilities.length > 0 && exp.responsibilities[0] !== "" && (
                                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                    {exp.responsibilities.map((resp, i) => (
                                                        // DÜZELTME: Sorumluluk maddelerinin taşmasını engellemek için `break-words`.
                                                        <li key={i} className="break-words">{resp}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ResumeUI3;
