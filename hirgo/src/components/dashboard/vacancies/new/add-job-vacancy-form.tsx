"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useCategories } from "@/app/features/category"
import { useEducationLevels, useEmploymentTypes, useExperienceLevels, useLanguageSkills, useLocations, useWorkSchedules } from "@/app/features/lookup"
import { CategoryItem } from "@/app/features/category/categoryApi"
import { useCreateVacancy } from "@/app/features/vacancy/useVacancy"

// Form schema with validation
const formSchema = z.object({
    title: z.string().min(5, "Job title must be at least 5 characters"),
    experienceLevelId: z.number().min(1, "Please select an experience level"),
    locationTypeId: z.number().min(1, "Please select a location type"),
    employmentTypeId: z.number().min(1, "Please select an employment type"),
    educationLevelId: z.number().min(1, "Please select an education level"),
    languageSkillsIds: z.array(z.number()).min(1, "Please select at least one language"),
    workScheduleId: z.number().min(1, "Please select a work schedule"),
    salary: z.number().min(1, "Please enter a valid salary"),
    applicationDeadline: z.date({
        required_error: "Please select an application deadline",
    }),
    categoryId: z.number().min(1, "Please select a category"),
    description: z.object({
        responsibilities: z
            .array(z.string().min(1, "Responsibility cannot be empty"))
            .min(1, "Add at least one responsibility"),
        education: z
            .array(z.string().min(1, "Education requirement cannot be empty"))
            .min(1, "Add at least one education requirement"),
        experience: z
            .array(z.string().min(1, "Experience requirement cannot be empty"))
            .min(1, "Add at least one experience requirement"),
        requiredSkills: z
            .array(z.string().min(1, "Required skill cannot be empty"))
            .min(1, "Add at least one required skill"),
        preferredSkills: z
            .array(z.string().min(1, "Preferred skill cannot be empty"))
            .min(1, "Add at least one preferred skill"),
    }),
})

type FormValues = z.infer<typeof formSchema>

export default function AddJobVacancyForm() {
    const { toast } = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { categories, isLoading: isCategoriesLoading } = useCategories()
    const { lookups: educationLevels } = useEducationLevels();
    const { lookups: employmentTypes } = useEmploymentTypes();
    const { lookups: experienceLevels } = useExperienceLevels();
    const { lookups: languageSkills } = useLanguageSkills();
    const { lookups: locations } = useLocations();
    const { lookups: workSchedules } = useWorkSchedules();
    const { createVacancy, isCreating } = useCreateVacancy();

    // Initialize form with default values
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            experienceLevelId: 0,
            locationTypeId: 0,
            employmentTypeId: 0,
            educationLevelId: 0,
            languageSkillsIds: [],
            workScheduleId: 0,
            salary: 0,
            categoryId: 0,
            description: {
                responsibilities: [""],
                education: [""],
                experience: [""],
                requiredSkills: [""],
                preferredSkills: [""],
            },
        },
    })

    // Helper function to add items to arrays in the description
    const addDescriptionItem = (field: keyof FormValues["description"]) => {
        const currentValues = form.getValues().description[field]
        form.setValue(`description.${field}`, [...currentValues, ""])
    }

    // Helper function to remove items from arrays in the description
    const removeDescriptionItem = (field: keyof FormValues["description"], index: number) => {
        const currentValues = form.getValues().description[field]
        if (currentValues.length > 1) {
            const newValues = [...currentValues]
            newValues.splice(index, 1)
            form.setValue(`description.${field}`, newValues)
        }
    }

    // Form submission handler
    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true)

        try {
            // Format the data to match the expected API structure
            const formattedData = {
                ...data,
                postedAt: new Date().toISOString(),
                applicationDeadline: data.applicationDeadline.toISOString().split('.')[0], // ISO format with T separator, removing milliseconds
            }

            // Call the create vacancy API
            const result = await createVacancy({
                categoryId: formattedData.categoryId,
                title: formattedData.title,
                description: formattedData.description,
                salary: formattedData.salary,
                locationTypeId: formattedData.locationTypeId,
                employmentTypeId: formattedData.employmentTypeId,
                workScheduleId: formattedData.workScheduleId,
                experienceLevelId: formattedData.experienceLevelId,
                educationLevelId: formattedData.educationLevelId,
                languageSkillsIds: formattedData.languageSkillsIds,
                applicationDeadline: formattedData.applicationDeadline
            });

            // Show success message and redirect
            toast({
                title: "Success!",
                description: "Job vacancy has been successfully created.",
            });

            // Navigate to the vacancy details page
            router.push(`/dashboard/vacancies/${result.id}`);
        } catch (error) {
            console.error("Error submitting form:", error)

            // Show error message
            toast({
                title: "Error",
                description: "Failed to create job vacancy. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto max-w-4xl">
            <div className="text-left mb-12">
                <h1 className="text-4xl font-bold text-blue-600/90">
                    Add New Job Vacancy
                </h1>
            </div>
            <Card className="w-full max-w-4xl mx-auto overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">

                <CardContent className="p-6 pt-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                            <div className="space-y-8">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="pb-6 mb-6 border-b border-gray-100 dark:border-gray-800"
                                >
                                    <h2 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                                        <span className="inline-block w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-2">
                                            1
                                        </span>
                                        Basic Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem className="md:col-span-2">
                                                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Job Title
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="e.g. Senior Software Engineer"
                                                            {...field}
                                                            className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="categoryId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Category
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={(value) => field.onChange(Number(value))}
                                                        defaultValue=""
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200">
                                                                <SelectValue placeholder="Select category" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {isCategoriesLoading ? (
                                                                <div className="flex items-center justify-center py-2">
                                                                    <Loader2 className="h-4 w-4 animate-spin text-blue-500 mr-2" />
                                                                    <span>Loading categories...</span>
                                                                </div>
                                                            ) : categories.length === 0 ? (
                                                                <div className="p-2 text-center text-gray-500">No categories found</div>
                                                            ) : (
                                                                categories.map((category: CategoryItem) => (
                                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                                        {category.name}
                                                                    </SelectItem>
                                                                ))
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="salary"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Salary</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="e.g. 75000"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                            className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="text-gray-500 dark:text-gray-400">
                                                        Annual salary in USD
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </motion.div>

                                {/* Job Details */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="pb-6 mb-6 border-b border-gray-100 dark:border-gray-800"
                                >
                                    <h2 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                                        <span className="inline-block w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-2">
                                            2
                                        </span>
                                        Job Details
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FormField
                                            control={form.control}
                                            name="applicationDeadline"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Application Deadline
                                                    </FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full justify-start text-left font-normal h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                                                >
                                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                disabled={(date) => date < new Date()}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="experienceLevelId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Experience Level
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                        defaultValue=""
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200">
                                                                <SelectValue placeholder="Select experience level" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {experienceLevels.map((level) => (
                                                                <SelectItem key={level.id} value={level.id.toString()}>
                                                                    {level.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="locationTypeId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Location Type
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                        defaultValue=""
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200">
                                                                <SelectValue placeholder="Select location type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {locations.map((type) => (
                                                                <SelectItem key={type.id} value={type.id.toString()}>
                                                                    {type.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="employmentTypeId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Employment Type
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                        defaultValue=""
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200">
                                                                <SelectValue placeholder="Select employment type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {employmentTypes.map((type) => (
                                                                <SelectItem key={type.id} value={type.id.toString()}>
                                                                    {type.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="educationLevelId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Education Level
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                        defaultValue=""
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200">
                                                                <SelectValue placeholder="Select education level" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {educationLevels.map((level) => (
                                                                <SelectItem key={level.id} value={level.id.toString()}>
                                                                    {level.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="languageSkillsIds"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Language Skills
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={(value) => {
                                                            const id = Number.parseInt(value)
                                                            if (!field.value.includes(id)) {
                                                                field.onChange([...field.value, id])
                                                            }
                                                        }}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200">
                                                                <SelectValue placeholder="Select languages" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {languageSkills.map((language) => (
                                                                <SelectItem key={language.id} value={language.id.toString()}>
                                                                    {language.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {field.value.map((id) => {
                                                            const language = languageSkills.find((l) => l.id === id)
                                                            return language ? (
                                                                <div
                                                                    key={id}
                                                                    className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm"
                                                                >
                                                                    {language.name}
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-auto p-0 ml-2"
                                                                        onClick={() => {
                                                                            field.onChange(field.value.filter((val) => val !== id))
                                                                        }}
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                        <span className="sr-only">Remove {language.name}</span>
                                                                    </Button>
                                                                </div>
                                                            ) : null
                                                        })}
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="workScheduleId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Work Schedule
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                        defaultValue=""
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200">
                                                                <SelectValue placeholder="Select work schedule" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {workSchedules.map((schedule) => (
                                                                <SelectItem key={schedule.id} value={schedule.id.toString()}>
                                                                    {schedule.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </motion.div>

                                {/* Detailed Description */}
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                                    <h2 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                                        <span className="inline-block w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-2">
                                            3
                                        </span>
                                        Detailed Job Description
                                    </h2>

                                    <Accordion type="single" collapsible className="w-full">
                                        {/* Responsibilities */}
                                        <AccordionItem
                                            value="responsibilities"
                                            className="border border-gray-100 dark:border-gray-800 rounded-lg mb-4 overflow-hidden "
                                        >
                                            <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors  underline-none">
                                                Responsibilities
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-4 pt-2">
                                                <div className="space-y-4">
                                                    {form.watch("description.responsibilities").map((_, index) => (
                                                        <div key={index} className="flex items-start gap-2">
                                                            <FormField
                                                                control={form.control}
                                                                name={`description.responsibilities.${index}`}
                                                                render={({ field }) => (
                                                                    <FormItem className="flex-1">
                                                                        <FormControl>
                                                                            <Textarea
                                                                                placeholder="Describe a key responsibility"
                                                                                {...field}
                                                                                className="border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => removeDescriptionItem("responsibilities", index)}
                                                                disabled={form.watch("description.responsibilities").length <= 1}
                                                                className="rounded-full hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addDescriptionItem("responsibilities")}
                                                        className="mt-2 rounded-full bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/40 transition-colors"
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add Responsibility
                                                    </Button>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>

                                        {/* Education */}
                                        <AccordionItem
                                            value="education"
                                            className="border border-gray-100 dark:border-gray-800 rounded-lg mb-4 overflow-hidden"
                                        >
                                            <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                Education Requirements
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-4 pt-2">
                                                <div className="space-y-4">
                                                    {form.watch("description.education").map((_, index) => (
                                                        <div key={index} className="flex items-start gap-2">
                                                            <FormField
                                                                control={form.control}
                                                                name={`description.education.${index}`}
                                                                render={({ field }) => (
                                                                    <FormItem className="flex-1">
                                                                        <FormControl>
                                                                            <Textarea
                                                                                placeholder="Describe education requirements"
                                                                                {...field}
                                                                                className="border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => removeDescriptionItem("education", index)}
                                                                disabled={form.watch("description.education").length <= 1}
                                                                className="rounded-full hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addDescriptionItem("education")}
                                                        className="mt-2 rounded-full bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/40 transition-colors"
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add Education Requirement
                                                    </Button>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>

                                        {/* Experience */}
                                        <AccordionItem
                                            value="experience"
                                            className="border border-gray-100 dark:border-gray-800 rounded-lg mb-4 overflow-hidden"
                                        >
                                            <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                Experience Requirements
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-4 pt-2">
                                                <div className="space-y-4">
                                                    {form.watch("description.experience").map((_, index) => (
                                                        <div key={index} className="flex items-start gap-2">
                                                            <FormField
                                                                control={form.control}
                                                                name={`description.experience.${index}`}
                                                                render={({ field }) => (
                                                                    <FormItem className="flex-1">
                                                                        <FormControl>
                                                                            <Textarea
                                                                                placeholder="Describe experience requirements"
                                                                                {...field}
                                                                                className="border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => removeDescriptionItem("experience", index)}
                                                                disabled={form.watch("description.experience").length <= 1}
                                                                className="rounded-full hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addDescriptionItem("experience")}
                                                        className="mt-2 rounded-full bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/40 transition-colors"
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add Experience Requirement
                                                    </Button>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>

                                        {/* Required Skills */}
                                        <AccordionItem
                                            value="requiredSkills"
                                            className="border border-gray-100 dark:border-gray-800 rounded-lg mb-4 overflow-hidden"
                                        >
                                            <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                Required Skills
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-4 pt-2">
                                                <div className="space-y-4">
                                                    {form.watch("description.requiredSkills").map((_, index) => (
                                                        <div key={index} className="flex items-start gap-2">
                                                            <FormField
                                                                control={form.control}
                                                                name={`description.requiredSkills.${index}`}
                                                                render={({ field }) => (
                                                                    <FormItem className="flex-1">
                                                                        <FormControl>
                                                                            <Input
                                                                                placeholder="e.g. JavaScript"
                                                                                {...field}
                                                                                className="border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => removeDescriptionItem("requiredSkills", index)}
                                                                disabled={form.watch("description.requiredSkills").length <= 1}
                                                                className="rounded-full hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addDescriptionItem("requiredSkills")}
                                                        className="mt-2 rounded-full bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/40 transition-colors"
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add Required Skill
                                                    </Button>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>

                                        {/* Preferred Skills */}
                                        <AccordionItem
                                            value="preferredSkills"
                                            className="border border-gray-100 dark:border-gray-800 rounded-lg mb-4 overflow-hidden"
                                        >
                                            <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                Preferred Skills
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-4 pt-2">
                                                <div className="space-y-4">
                                                    {form.watch("description.preferredSkills").map((_, index) => (
                                                        <div key={index} className="flex items-start gap-2">
                                                            <FormField
                                                                control={form.control}
                                                                name={`description.preferredSkills.${index}`}
                                                                render={({ field }) => (
                                                                    <FormItem className="flex-1">
                                                                        <FormControl>
                                                                            <Input
                                                                                placeholder="e.g. TypeScript, Team Leadership"
                                                                                {...field}
                                                                                className="border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => removeDescriptionItem("preferredSkills", index)}
                                                                disabled={form.watch("description.preferredSkills").length <= 1}
                                                                className="rounded-full hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addDescriptionItem("preferredSkills")}
                                                        className="mt-2 rounded-full bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/40 transition-colors"
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add Preferred Skill
                                                    </Button>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="pt-4"
                                >
                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-white font-medium rounded-lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Creating Job Vacancy...
                                            </>
                                        ) : (
                                            "Create Job Vacancy"
                                        )}
                                    </Button>
                                </motion.div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

