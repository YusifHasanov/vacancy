// ResumeForm.tsx

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card} from "@/components/ui/card";
import { Pencil, PlusCircle, Trash2, UploadCloud } from "lucide-react";
import { useResumeStore } from "@/store/resumestore";
import { Slider } from "@/components/ui/slider";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const ResumeForm: React.FC = () => {
    const {
        resumeData,
        handleChange,
        handleContactChange,
        handleWorkExperienceChange,
        addWorkExperience,
        removeWorkExperience,
        // YENİ FONKSİYONLARI İMPORT EDİYORUZ
        handleResponsibilityChange,
        addResponsibility,
        removeResponsibility,
        //
        handleEducationChange,
        addEducation,
        removeEducation,
        handleSkillChange,
        handleImageUpload,
        addSkill,
        addLanguage,
        removeLanguage,
        handleLanguageChange,
        removeSkill,
        removeProfilePicture
    } = useResumeStore();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
        }
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    return (
        <Accordion type="multiple" className="w-full space-y-4">
            {/* ... Diğer AccordionItem'lar (Personal, Contact) aynı kalacak ... */}

            <AccordionItem value="personal-info" className="border bg-white rounded-lg">
                <AccordionTrigger className="px-6 py-4">
                    <div className="text-left">
                        <h3 className="font-semibold">Personal Information</h3>
                        <p className="text-sm text-muted-foreground">Name, title, summary, and profile picture.</p>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-0">
                    <div className="space-y-6">
                        {/* Profil Resmi Alanı */}
                        <div>
                            <div className="mt-2 flex items-center gap-6">
                                {/* ... (Resim yükleme kodunun tamamı buraya gelecek, değişiklik yok) ... */}
                                <div className="relative h-24 w-24 rounded-full group">
                                    {resumeData.profilePicture ? (
                                        <img
                                            src={resumeData.profilePicture}
                                            alt="Profile Preview"
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="h-full w-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <span className="text-3xl text-gray-400 dark:text-gray-500">?</span>
                                        </div>
                                    )}
                                    {/* Resim varken gösterilen butonlar */}
                                    {resumeData.profilePicture && (
                                        <div
                                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center gap-2 rounded-full transition-opacity">
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="outline"
                                                className="h-8 w-8 rounded-full bg-white bg-opacity-75 opacity-0 group-hover:opacity-100"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Pencil className="h-4 w-4 text-gray-800"/>
                                            </Button>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="destructive"
                                                className="h-8 w-8 rounded-full bg-opacity-75 opacity-0 group-hover:opacity-100"
                                                onClick={removeProfilePicture}
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                {/* Resim yokken gösterilen buton */}
                                {!resumeData.profilePicture && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <UploadCloud className="h-4 w-4 mr-2"/>
                                        Upload Image
                                    </Button>
                                )}
                                {/* Gizli dosya input'u */}
                                <input
                                    ref={fileInputRef}
                                    id="profile-picture-upload"
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" name="firstName" value={resumeData.firstName}
                                       onChange={handleChange}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" name="lastName" value={resumeData.lastName}
                                       onChange={handleChange}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jobTitle">Job Title / Headline</Label>
                                <Input id="jobTitle" name="jobTitle" value={resumeData.jobTitle}
                                       onChange={handleChange}/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="summary">Summary</Label>
                            <Textarea id="summary" name="summary" value={resumeData.summary} onChange={handleChange}
                                      rows={4}/>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* 2. İLETİŞİM BİLGİLERİ BÖLÜMÜ */}
            <AccordionItem value="contact-info" className="border bg-white  rounded-lg">
                <AccordionTrigger className="px-6 py-4">
                    <div className="text-left">
                        <h3 className="font-semibold">Contact Information</h3>
                        <p className="text-sm text-muted-foreground">Email, phone, and social links.</p>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-0">
                    <div className="space-y-4">
                        {/* ... (İletişim formu alanları buraya gelecek, değişiklik yok) ... */}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={resumeData.contact.email}
                                   onChange={handleContactChange}/>
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" value={resumeData.contact.phone} onChange={handleContactChange}/>
                        </div>
                        <div>
                            <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                            <Input id="linkedin" name="linkedin" value={resumeData.contact.linkedin}
                                   onChange={handleContactChange}/>
                        </div>
                        <div>
                            <Label htmlFor="github">GitHub Profile URL</Label>
                            <Input id="github" name="github" value={resumeData.contact.github}
                                   onChange={handleContactChange}/>
                        </div>
                        <div>
                            <Label htmlFor="website">Personal Website/Portfolio URL</Label>
                            <Input id="website" name="website" value={resumeData.contact.website}
                                   onChange={handleContactChange}/>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* 3. İŞ DENEYİMİ BÖLÜMÜ (GÜNCELLENDİ) */}
            <AccordionItem value="work-experience" className="border bg-white  rounded-lg">
                <AccordionTrigger className="px-6 py-4">
                    <div className="text-left">
                        <h3 className="font-semibold">Work Experience</h3>
                        <p className="text-sm text-muted-foreground">Add your professional roles.</p>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-0">
                    <div className="space-y-4">
                        {resumeData.workExperience.map((exp, index) => (
                            <Card key={exp.id} className="p-4 space-y-3 relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                    onClick={() => removeWorkExperience(exp.id)}
                                >
                                    <Trash2 className="h-4 w-4"/>
                                    <span className="sr-only">Remove Experience</span>
                                </Button>
                                <div>
                                    <Label htmlFor={`exp-jobTitle-${index}`}>Job Title</Label>
                                    <Input id={`exp-jobTitle-${index}`} name="jobTitle" value={exp.jobTitle}
                                           onChange={(e) => handleWorkExperienceChange(index, "jobTitle", e.target.value)}/>
                                </div>
                                <div>
                                    <Label htmlFor={`exp-company-${index}`}>Company</Label>
                                    <Input id={`exp-company-${index}`} name="company" value={exp.company}
                                           onChange={(e) => handleWorkExperienceChange(index, "company", e.target.value)}/>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor={`exp-startDate-${index}`}>Start Date</Label>
                                        <Input id={`exp-startDate-${index}`} name="startDate" type="month"
                                               value={exp.startDate}
                                               onChange={(e) => handleWorkExperienceChange(index, "startDate", e.target.value)}/>
                                    </div>
                                    <div>
                                        <Label htmlFor={`exp-endDate-${index}`}>End Date</Label>
                                        <Input id={`exp-endDate-${index}`} name="endDate" type="month" value={exp.endDate}
                                               onChange={(e) => handleWorkExperienceChange(index, "endDate", e.target.value)}/>
                                    </div>
                                </div>

                                {/* --- YENİ SORUMLULUK ALANI --- */}
                                <div className="space-y-2">
                                    <Label>Responsibilities</Label>
                                    <br/>
                                    {exp.responsibilities.map((resp, respIndex) => (
                                        <div key={respIndex} className="flex items-center gap-2">
                                            <Input
                                                placeholder="e.g., Developed new features"
                                                value={resp}
                                                onChange={(e) => handleResponsibilityChange(index, respIndex, e.target.value)}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 shrink-0"
                                                onClick={() => removeResponsibility(index, respIndex)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => addResponsibility(index)}
                                    >
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        Add Responsibility
                                    </Button>
                                </div>
                                {/* --- ESKİ TEXTAREA KALDIRILDI --- */}

                            </Card>
                        ))}
                    </div>
                    <Button variant="outline" onClick={addWorkExperience} className="w-full mt-4">
                        <PlusCircle className="mr-2 h-4 w-4"/> Add Work Experience
                    </Button>
                </AccordionContent>
            </AccordionItem>

            {/* ... Diğer AccordionItem'lar (Education, Skills) aynı kalacak ... */}
            {/* 4. EĞİTİM BÖLÜMÜ */}
            <AccordionItem value="education" className="border bg-white  rounded-lg">
                <AccordionTrigger className="px-6 py-4">
                    <div className="text-left">
                        <h3 className="font-semibold">Education</h3>
                        <p className="text-sm text-muted-foreground">Detail your academic background.</p>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-0">
                    {/* ... (Eğitim bölümünün içeriği buraya gelecek) ... */}
                    <div className="space-y-4">
                        {resumeData.education.map((edu, index) => (
                            <Card key={edu.id} className="p-4 space-y-3 relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                    onClick={() => removeEducation(edu.id)}
                                >
                                    <Trash2 className="h-4 w-4"/>
                                    <span className="sr-only">Remove Education</span>
                                </Button>
                                <div>
                                    <Label htmlFor={`edu-degree-${index}`}>Degree/Certificate</Label>
                                    <Input id={`edu-degree-${index}`} name="degree" value={edu.degree}
                                           onChange={(e) => handleEducationChange(index, "degree", e.target.value)}/>
                                </div>
                                <div>
                                    <Label htmlFor={`edu-institution-${index}`}>Institution</Label>
                                    <Input id={`edu-institution-${index}`} name="institution" value={edu.institution}
                                           onChange={(e) => handleEducationChange(index, "institution", e.target.value)}/>
                                </div>
                                <div>
                                    <Label htmlFor={`edu-graduationYear-${index}`}>Graduation Year</Label>
                                    <Input id={`edu-graduationYear-${index}`} name="graduationYear" type="date"
                                           placeholder="YYYY or YYYY-MM" value={edu.graduationYear}
                                           onChange={(e) => handleEducationChange(index, "graduationYear", e.target.value)}/>
                                </div>
                                <div>
                                    <Label htmlFor={`edu-details-${index}`}>Details (e.g., GPA, honors, relevant
                                        coursework)</Label>
                                    <Textarea id={`edu-details-${index}`} name="details" value={edu.details}
                                              onChange={(e) => handleEducationChange(index, "details", e.target.value)}
                                              rows={6}/>
                                </div>
                            </Card>
                        ))}
                    </div>
                    <Button variant="outline" onClick={addEducation} className="w-full mt-4">
                        <PlusCircle className="mr-2 h-4 w-4"/> Add Education
                    </Button>
                </AccordionContent>
            </AccordionItem>

            {/* 5. BECERİLER BÖLÜMÜ */}
            <AccordionItem value="skills" className="border  bg-white rounded-lg">
                <AccordionTrigger className="px-6 py-4">
                    <div className="text-left">
                        <h3 className="font-semibold">Skills</h3>
                        <p className="text-sm text-muted-foreground">Add skills and specify proficiency.</p>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-0">
                    {/* ... (Beceriler bölümünün içeriği buraya gelecek) ... */}
                    <div className="space-y-4">
                        {resumeData.skills.map((skill, index) => (
                            <div key={skill.id} className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-center justify-between gap-4">
                                    <Input
                                        placeholder="Skill Name (e.g., React)"
                                        value={skill.name}
                                        onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                                        className="flex-grow"
                                    />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeSkill(skill.id)}
                                    >
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Slider
                                        min={0}
                                        max={100}
                                        step={5}
                                        value={[skill.level]}
                                        onValueChange={(value) => handleSkillChange(index, 'level', value[0])}
                                        className="flex-grow"
                                    />
                                    <span className="font-mono text-sm w-12 text-center">{skill.level}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button onClick={addSkill} variant="outline" className="w-full mt-4">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Skill
                    </Button>
                </AccordionContent>
            </AccordionItem>


            {/* 5. BECERİLER BÖLÜMÜ */}
            <AccordionItem value="languages" className="border  bg-white rounded-lg">
                <AccordionTrigger className="px-6 py-4">
                    <div className="text-left">
                        <h3 className="font-semibold">Languages</h3>
                        <p className="text-sm text-muted-foreground">Add language.</p>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-0">
                    {/* ... (Beceriler bölümünün içeriği buraya gelecek) ... */}
                    <div className="space-y-4">
                        {resumeData.languages?.map((language, index) => (
                            <div key={language.id} className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-center justify-between gap-4">
                                    <Input
                                        placeholder="Skill Name (e.g., React)"
                                        value={language.name}
                                        onChange={(e) => handleLanguageChange(index, 'name', e.target.value)}
                                        className="flex-grow"
                                    />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeLanguage(language.id)}
                                    >
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Slider
                                        min={0}
                                        max={100}
                                        step={5}
                                        value={[language.level]}
                                        onValueChange={(value) => handleLanguageChange(index, 'level', value[0])}
                                        className="flex-grow"
                                    />
                                    <span className="font-mono text-sm w-12 text-center">{language.level}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button onClick={addLanguage} variant="outline" className="w-full mt-4">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Language
                    </Button>
                </AccordionContent>
            </AccordionItem>

        </Accordion>
    );
};

export default ResumeForm;
