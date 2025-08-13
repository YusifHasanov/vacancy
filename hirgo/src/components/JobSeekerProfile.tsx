import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, MapPin, Phone, FileText, Briefcase, GraduationCap } from "lucide-react"

interface ProfileData {
    name: string
    email: string
    phone: string
    location: string
    about: string
    experience: string
    education: string
}

const JobSeekerProfile: React.FC = () => {
    const [profileData, setProfileData] = useState<ProfileData>({
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "+1 (555) 123-4567",
        location: "New York, NY",
        about: "Passionate software developer with 5 years of experience in web technologies.",
        experience: "5 years of experience in frontend development",
        education: "BS in Computer Science, XYZ University",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setProfileData((prev) => ({ ...prev, [name]: value }))
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Handle file upload logic here
        console.log("File uploaded:", e.target.files?.[0]?.name)
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card className="w-full">
                <CardHeader className="relative">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg"></div>
                    <div className="relative z-10 flex items-center">
                        <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                            <AvatarImage src="/placeholder.svg?height=96&width=96" alt={profileData.name} />
                            <AvatarFallback>
                                {profileData.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="ml-4 text-white">
                            <CardTitle className="text-2xl font-bold">{profileData.name}</CardTitle>
                            <CardDescription className="text-gray-200">Software Developer</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="personal" className="w-full mt-6">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="personal">Personal Info</TabsTrigger>
                            <TabsTrigger value="professional">Professional</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                        </TabsList>
                        <TabsContent value="personal" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="text-gray-500" size={18} />
                                        <Input id="email" name="email" value={profileData.email} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <div className="flex items-center space-x-2">
                                        <Phone className="text-gray-500" size={18} />
                                        <Input id="phone" name="phone" value={profileData.phone} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="text-gray-500" size={18} />
                                        <Input id="location" name="location" value={profileData.location} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="about">About Me</Label>
                                <Textarea
                                    id="about"
                                    name="about"
                                    value={profileData.about}
                                    onChange={handleInputChange}
                                    className="min-h-[100px]"
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="professional" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="experience">Experience</Label>
                                <div className="flex items-start space-x-2">
                                    <Briefcase className="text-gray-500 mt-2" size={18} />
                                    <Textarea
                                        id="experience"
                                        name="experience"
                                        value={profileData.experience}
                                        onChange={handleInputChange}
                                        className="min-h-[100px]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="education">Education</Label>
                                <div className="flex items-start space-x-2">
                                    <GraduationCap className="text-gray-500 mt-2" size={18} />
                                    <Textarea
                                        id="education"
                                        name="education"
                                        value={profileData.education}
                                        onChange={handleInputChange}
                                        className="min-h-[100px]"
                                    />
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="documents" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="cv-upload">Upload CV</Label>
                                <div className="flex items-center space-x-2">
                                    <FileText className="text-gray-500" size={18} />
                                    <Input id="cv-upload" type="file" onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
                                </div>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Uploaded Documents</h4>
                                <ul className="list-disc list-inside">
                                    <li>Resume_AlexJohnson.pdf</li>
                                    <li>CoverLetter_SoftwareDev.docx</li>
                                </ul>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default JobSeekerProfile