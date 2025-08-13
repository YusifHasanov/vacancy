"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { AlertTriangle, CalendarIcon, Loader2, Plus, Trash2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useCategories } from "@/app/features/category"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useVacancy, useDeleteVacancy, useUpdateVacancy } from "@/app/features/vacancy/useVacancy"
import { 
  useEducationLevels, 
  useEmploymentTypes, 
  useExperienceLevels,
  useWorkSchedules,
  useLocations,
  useLanguageSkills
} from "@/app/features/lookup/useLookupHooks"


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

interface JobDetailsVacancyFormProps {
  vacancyId: string
}

export default function JobDetailsVacancyForm({ vacancyId }: JobDetailsVacancyFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { categories, isLoading: isCategoriesLoading } = useCategories()
  
  // Ensure we're rendering on client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Get vacancy data using the hook
  const { vacancy, loading: isLoadingVacancy, error, refetch } = useVacancy(vacancyId)
  const { updateVacancy } = useUpdateVacancy()
  const { deleteVacancy, isDeleting } = useDeleteVacancy()
  
  // Get lookup data
  const { lookups: educationLevels } = useEducationLevels();
  const { lookups: employmentTypes } = useEmploymentTypes();
  const { lookups: experienceLevels } = useExperienceLevels();
  const { lookups: locations } = useLocations();
  const { lookups: workSchedules } = useWorkSchedules();
  const { lookups: languageSkills } = useLanguageSkills();

  // Set isLoading based on vacancy loading state
  useEffect(() => {
    console.log(`[JobDetailsVacancyForm] Vacancy loading state changed: ${isLoadingVacancy}`);
    setIsLoading(isLoadingVacancy);
  }, [isLoadingVacancy]);

  // Description item management functions
  const addDescriptionItem = (field: keyof FormValues["description"]) => {
    const currentValues = form.getValues().description[field];
    form.setValue(`description.${field}`, [...currentValues, ""]);
  }

  const removeDescriptionItem = (field: keyof FormValues["description"], index: number) => {
    const currentValues = form.getValues().description[field];
    if (currentValues.length > 1) {
      const newValues = [...currentValues];
      newValues.splice(index, 1);
      form.setValue(`description.${field}`, newValues);
    }
  }

  // Initialize form with empty values
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

  // Fetch vacancy data on component mount
  useEffect(() => {
    console.log("[JobDetailsVacancyForm] Vacancy data updated", vacancy);
    
    if (vacancy && !isLoadingVacancy) {
      try {
        // Parse the description if it's stored as JSON string
        let parsedDescription = vacancy.description;
        try {
          if (typeof vacancy.description === 'string') {
            parsedDescription = JSON.parse(vacancy.description as string);
          }
        } catch (e) {
          console.error("Failed to parse description JSON:", e);
        }
        
        // Parse the date string to a Date object
        let applicationDeadlineDate = new Date();
        if (vacancy.applicationDeadline) {
          applicationDeadlineDate = new Date(vacancy.applicationDeadline);
        }
        
        // Map API values to form values
        const formValues = {
          title: vacancy.title || "",
          experienceLevelId: vacancy.experienceLevelId || 0,
          locationTypeId: vacancy.locationTypeId || 0,
          employmentTypeId: vacancy.employmentTypeId || 0,
          educationLevelId: vacancy.educationLevelId || 0,
          languageSkillsIds: vacancy.languageSkillsIds || [],
          workScheduleId: vacancy.workScheduleId || 0,
          salary: vacancy.salary || 0,
          applicationDeadline: applicationDeadlineDate,
          categoryId: vacancy.categoryId || 1,
          description: parsedDescription || {
            responsibilities: [""],
            education: [""],
            experience: [""],
            requiredSkills: [""],
            preferredSkills: [""],
          }
        };
        
        console.log("[JobDetailsVacancyForm] Updating form with values:", formValues);
        // Update form values
        form.reset(formValues);
      } catch (err) {
        console.error("Error processing vacancy data:", err);
        toast({
          title: "Error",
          description: "Failed to load vacancy data correctly.",
          variant: "destructive",
        });
      }
    }
  }, [vacancy, isLoadingVacancy, form]);  // Removed dependencies that don't affect this process

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Format the data for the API
      const updatedVacancy = {
        title: data.title,
        description: data.description,
        salary: data.salary,
        experienceLevelId: data.experienceLevelId,
        locationTypeId: data.locationTypeId,
        workScheduleId: data.workScheduleId,
        employmentTypeId: data.employmentTypeId,
        educationLevelId: data.educationLevelId,
        languageSkillsIds: data.languageSkillsIds,  
        categoryId: data.categoryId,
        applicationDeadline: format(data.applicationDeadline, "yyyy-MM-dd'T'HH:mm:ss")
      };

      // Call the update API
      await updateVacancy(vacancyId, updatedVacancy);

      // Show success message
      toast({
        title: "Success!",
        description: "Job vacancy has been successfully updated.",
      });
      
      // Reload the vacancy data
      refetch();
    } catch (error) {
      console.error("Error updating form:", error);
      toast({
        title: "Error",
        description: "Failed to update job vacancy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete vacancy handler
  const handleDelete = async () => {
    try {
      await deleteVacancy(vacancyId);
      
      toast({
        title: "Vacancy Deleted",
        description: "The job vacancy has been successfully deleted.",
      });
      
      // Navigate back to vacancies list
      router.push("/dashboard/vacancies");
    } catch (error) {
      console.error("Error deleting vacancy:", error);
      toast({
        title: "Error",
        description: "Failed to delete job vacancy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  // Check if we should render the form
  if (!isClient) {
    return (
      <Card className="w-full max-w-4xl mx-auto overflow-hidden border-0 shadow-lg">
        <CardContent className="p-6 pt-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
            <Skeleton className="h-40" />
            <div className="flex justify-between">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Add debug logging for rendering
  console.log(`[JobDetailsVacancyForm] Rendering with vacancyId: ${vacancyId}`);
  console.log(`[JobDetailsVacancyForm] Vacancy loaded:`, vacancy);
  console.log(`[JobDetailsVacancyForm] Loading state:`, isLoading);
  console.log(`[JobDetailsVacancyForm] Error state:`, error);

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Vacancy</h2>
          <p className="text-gray-500 mb-6">Failed to load vacancy data. Please try again.</p>
          <Button onClick={() => refetch()}>
            Retry
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard/vacancies")} className="mt-2">
            Return to Vacancies
          </Button>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto overflow-hidden border-0 shadow-lg">
        <CardContent className="p-6 pt-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
            <Skeleton className="h-40" />
            <div className="flex justify-between">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl">
        <div className="text-left mb-12">
            <h1 className="text-4xl font-bold mb-3 text-blue-600">Vacancy Details</h1>
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
                            value={field.value ? field.value.toString() : vacancy?.categoryId?.toString()}
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
                                categories.map((category) => (
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
                            value={field.value ? field.value.toString() : vacancy?.experienceLevelId?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200">
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {experienceLevels.map((level: any) => (
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
                            value={field.value ? field.value.toString() : vacancy?.locationTypeId?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200">
                                <SelectValue placeholder="Select location type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {locations.map((type: any) => (
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
                            value={field.value ? field.value.toString() : vacancy?.employmentTypeId?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200">
                                <SelectValue placeholder="Select employment type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {employmentTypes.map((type: any) => (
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
                            value={field.value ? field.value.toString() : vacancy?.educationLevelId?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200">
                                <SelectValue placeholder="Select education level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {educationLevels.map((level: any) => (
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
                              {languageSkills.map((language: any) => (
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
                            value={field.value ? field.value.toString() : vacancy?.workScheduleId?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200">
                                <SelectValue placeholder="Select work schedule" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {workSchedules.map((schedule: any) => (
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
                      className="border border-gray-100 dark:border-gray-800 rounded-lg mb-4 overflow-hidden"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
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
                            Add Item
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
                            Add Item
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
                            Add Item
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
                                        placeholder="e.g. JavaScript, Project Management"
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
                            Add Item
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
                            Add Item
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
                  className="pt-4 flex flex-col md:flex-row gap-4 justify-between"
                >
                  <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Vacancy
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the job vacancy and remove it from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button
                    type="submit"
                    className="h-12 bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Updating Job Vacancy...
                      </>
                    ) : (
                      "Update Vacancy"
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
