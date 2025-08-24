"use client"

import {useState} from "react"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Check, Eye, EyeOff, AlertCircle} from "lucide-react"
import {Alert, AlertDescription} from "@/components/ui/alert"
import Link from "next/link"
import {motion} from "framer-motion"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {CalendarIcon} from "lucide-react"
import {format} from "date-fns"
import {useRegisterCompanyMutation, useRegisterJobSeekerMutation} from "@/app/features/auth/authSlice"
import {useDispatch} from 'react-redux'
import {setAuthenticated} from '@/app/features/auth/authSlice'
import {useRouter} from 'next/navigation'
import {cn} from "@/lib/utils";

// Define a simple schema for the initial state (just the user type selection)
const userTypeSchema = z.object({
    userType: z.enum(["company", "jobSeeker"]).optional(),
})

// Define the schemas for each form type
const companySchema = z
    .object({
        userType: z.literal("company"),
        companyName: z.string().min(2, {message: "Company name must be at least 2 characters."}),
        phoneNumber: z.string().min(10, {message: "Please enter a valid phone number."}),
        email: z.string().email({message: "Please enter a valid email address."}),
        password: z.string().min(8, {message: "Password must be at least 8 characters."}),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })

const jobSeekerSchema = z
    .object({
        userType: z.literal("jobSeeker"),
        email: z.string().email({message: "Please enter a valid email address."}),
        name: z.string().min(2, {message: "Name must be at least 2 characters."}),
        surname: z.string().min(2, {message: "Surname must be at least 2 characters."}),
        phoneNumber: z.string().min(10, {message: "Please enter a valid phone number."}),
        dateOfBirth: z.string().refine(
            (dob) => {
                const date = new Date(dob)
                const today = new Date()
                const age = today.getFullYear() - date.getFullYear()
                const m = today.getMonth() - date.getMonth()
                if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
                    return age - 1 >= 18
                }
                return age >= 18
            },
            {message: "You must be at least 18 years old."},
        ),
        password: z.string().min(8, {message: "Password must be at least 8 characters."}),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })

type UserTypeFormValues = z.infer<typeof userTypeSchema>
type CompanyFormValues = z.infer<typeof companySchema>
type JobSeekerFormValues = z.infer<typeof jobSeekerSchema>

export default function SignupPage() {
    const [userType, setUserType] = useState<"company" | "jobSeeker" | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const dispatch = useDispatch();
    const router = useRouter();

    // Redux hooks for API calls
    const [registerCompany] = useRegisterCompanyMutation();
    const [registerJobSeeker] = useRegisterJobSeekerMutation();

    // Initialize the user type selection form
    const userTypeForm = useForm<UserTypeFormValues>({
        resolver: zodResolver(userTypeSchema),
        defaultValues: {
            userType: undefined,
        },
    })

    // Initialize the company form
    const companyForm = useForm<CompanyFormValues>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            userType: "company",
            companyName: "",
            phoneNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        mode: "onChange",
    })

    // Initialize the job seeker form
    const jobSeekerForm = useForm<JobSeekerFormValues>({
        resolver: zodResolver(jobSeekerSchema),
        defaultValues: {
            userType: "jobSeeker",
            name: "",
            surname: "",
            email: "",
            phoneNumber: "",
            dateOfBirth: "",
            password: "",
            confirmPassword: "",
        },
        mode: "onChange",
    })

    // Get the active form based on user type
    const getActiveForm = () => {
        if (userType === "company") return companyForm
        if (userType === "jobSeeker") return jobSeekerForm
        return null
    }

    const handleUserTypeChange = (value: string) => {
        if (value === "company" || value === "jobSeeker") {
            setUserType(value as "company" | "jobSeeker")
            userTypeForm.setValue("userType", value as never)
        }
    }

    const onSubmit = async (data: CompanyFormValues | JobSeekerFormValues) => {
        setIsSubmitting(true)
        setError(null)

        try {
            let response;

            if (data.userType === "company") {
                const companyData = data as CompanyFormValues;
                response = await registerCompany({
                    name: companyData.companyName,
                    phone: companyData.phoneNumber,
                    email: companyData.email,
                    password: companyData.password,
                }).unwrap();
            } else {
                const jobSeekerData = data as JobSeekerFormValues;
                response = await registerJobSeeker({
                    firstName: jobSeekerData.name,
                    lastName: jobSeekerData.surname,
                    dateOfBirth: jobSeekerData.dateOfBirth,
                    email: jobSeekerData.email,
                    password: jobSeekerData.password,
                    phone: jobSeekerData.phoneNumber,
                }).unwrap();
            }

            if (response.status.code === "SUCCESS") {
                // Dispatch auth state change
                dispatch(setAuthenticated(true));
                setSuccess(true);

                // Redirect to dashboard after a delay
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } else {
                setError(response.error || response.status.message);
            }
        } catch (error: any) {
            console.error("Error during registration:", error);
            setError(error.data?.error || error.message || "An unknown error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    if (success) {
        return (
            <div className="flex justify-center items-center min-h-[500px]">
                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}}>
                    <Alert
                        className="max-w-md bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 shadow-sm">
                        <Check className="h-5 w-5 text-emerald-500"/>
                        <AlertDescription className="text-emerald-800 font-medium">
                            Registration successful! Thank you for signing up.
                        </AlertDescription>
                    </Alert>
                </motion.div>
            </div>
        )
    }

    const activeForm = getActiveForm()

    return (
        <div className="container mx-auto py-10 px-4 max-w-md">
            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}}>
                <Card className="w-full overflow-hidden border-0 shadow-lg bg-white dark:bg-zinc-900">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    <CardHeader className="px-6 pt-6 pb-4">
                        <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
                        <CardDescription className="text-muted-foreground mt-1">
                            Choose an account type and fill in your details to get started.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 space-y-6">
                        {error && (
                            <Alert className="bg-red-50 border-red-200 text-red-800">
                                <AlertCircle className="h-4 w-4 text-red-600"/>
                                <AlertDescription className="text-red-800">{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-3">
                                <Label className="text-base font-medium">I want to register as:</Label>
                                <RadioGroup
                                    value={userType || undefined}
                                    onValueChange={handleUserTypeChange}
                                    className="grid grid-cols-2 gap-3"
                                >
                                    <div
                                        className={`flex items-center space-x-2 border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                                            userType === "company"
                                                ? "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800"
                                                : "hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:hover:border-zinc-700"
                                        }`}
                                    >
                                        <RadioGroupItem value="company" id="company"/>
                                        <Label htmlFor="company" className="cursor-pointer font-medium">
                                            Company
                                        </Label>
                                    </div>
                                    <div
                                        className={`flex items-center space-x-2 border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                                            userType === "jobSeeker"
                                                ? "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800"
                                                : "hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:hover:border-zinc-700"
                                        }`}
                                    >
                                        <RadioGroupItem value="jobSeeker" id="jobSeeker"/>
                                        <Label htmlFor="jobSeeker" className="cursor-pointer font-medium">
                                            Job Seeker
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {userType && activeForm && (
                                <motion.form
                                    onSubmit={activeForm.handleSubmit(onSubmit)}
                                    className="space-y-5 pt-2"
                                    initial={{opacity: 0, height: 0}}
                                    animate={{opacity: 1, height: "auto"}}
                                    transition={{duration: 0.3}}
                                >
                                    {userType === "company" ? (
                                        // Company Form Fields
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="companyName" className="text-sm font-medium">
                                                    Company Name
                                                </Label>
                                                <Input
                                                    id="companyName"
                                                    {...companyForm.register("companyName")}
                                                    placeholder="ABC Corporation"
                                                    className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                />
                                                {companyForm.formState.errors.companyName && (
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {companyForm.formState.errors.companyName.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phoneNumber" className="text-sm font-medium">
                                                    Phone Number
                                                </Label>
                                                <Input
                                                    id="phoneNumber"
                                                    {...companyForm.register("phoneNumber")}
                                                    placeholder="+1 (555) 123-4567"
                                                    className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                />
                                                {companyForm.formState.errors.phoneNumber && (
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {companyForm.formState.errors.phoneNumber.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-sm font-medium">
                                                    Email
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    {...companyForm.register("email")}
                                                    placeholder="contact@company.com"
                                                    className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                />
                                                {companyForm.formState.errors.email && (
                                                    <p className="text-sm text-red-500 mt-1">{companyForm.formState.errors.email.message}</p>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        // Job Seeker Form Fields
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="text-sm font-medium">
                                                        First Name
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        {...jobSeekerForm.register("name")}
                                                        placeholder="John"
                                                        className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    />
                                                    {jobSeekerForm.formState.errors.name && (
                                                        <p className="text-sm text-red-500 mt-1">{jobSeekerForm.formState.errors.name.message}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="surname" className="text-sm font-medium">
                                                        Last Name
                                                    </Label>
                                                    <Input
                                                        id="surname"
                                                        {...jobSeekerForm.register("surname")}
                                                        placeholder="Doe"
                                                        className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    />
                                                    {jobSeekerForm.formState.errors.surname && (
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {jobSeekerForm.formState.errors.surname.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <DateOfBirthPicker form={jobSeekerForm}/>
                                                {jobSeekerForm.formState.errors.dateOfBirth && (
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {jobSeekerForm.formState.errors.dateOfBirth?.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phoneNumber" className="text-sm font-medium">
                                                    Phone Number
                                                </Label>
                                                <Input
                                                    id="phoneNumber"
                                                    type="tel"
                                                    {...jobSeekerForm.register("phoneNumber")}
                                                    placeholder="+1 (555) 123-4567"
                                                    className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                />
                                                {jobSeekerForm.formState.errors.phoneNumber && (
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {jobSeekerForm.formState.errors.phoneNumber.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-sm font-medium">
                                                    Email
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    {...jobSeekerForm.register("email")}
                                                    placeholder="john.doe@example.com"
                                                    className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                />
                                                {jobSeekerForm.formState.errors.email && (
                                                    <p className="text-sm text-red-500 mt-1">{jobSeekerForm.formState.errors.email.message}</p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* Password fields for both user types */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-medium">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                {...(userType === "company" ? companyForm.register("password") : jobSeekerForm.register("password"))}
                                                placeholder="Enter your password"
                                                className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                                onClick={togglePasswordVisibility}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                            </button>
                                        </div>
                                        {(userType === "company" ? companyForm : jobSeekerForm).formState.errors.password && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {(userType === "company" ? companyForm : jobSeekerForm).formState.errors.password?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                            Confirm Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                {...(userType === "company" ? companyForm.register("confirmPassword") : jobSeekerForm.register("confirmPassword"))}
                                                placeholder="Confirm your password"
                                                className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                                onClick={toggleConfirmPasswordVisibility}
                                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                            >
                                                {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                            </button>
                                        </div>
                                        {(userType === "company" ? companyForm : jobSeekerForm).formState.errors.confirmPassword && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {
                                                    (userType === "company" ? companyForm : jobSeekerForm).formState.errors.confirmPassword
                                                        ?.message
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 mt-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium text-white"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center">
                                                <svg
                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Submitting...
                                            </div>
                                        ) : (
                                            "Register"
                                        )}
                                    </Button>

                                    <div className="text-center space-y-3 pt-2">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            By signing up, you agree to our{" "}
                                            <Link
                                                href="/terms"
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                                            >
                                                Terms of Service
                                            </Link>{" "}
                                            and{" "}
                                            <Link
                                                href="/privacy"
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                                            >
                                                Privacy Policy
                                            </Link>
                                        </p>
                                        <div className="flex items-center justify-center space-x-1">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Already have an account?</span>
                                            <Link
                                                href="/login"
                                                className="text-sm text-blue-600 font-medium hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                                            >
                                                Log in
                                            </Link>
                                        </div>
                                    </div>
                                </motion.form>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}


export function DateOfBirthPicker({ form } : any) {
    // 18 yaşından küçükleri engellemek için maksimum tarihi belirleyelim
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    const maxDate = eighteenYearsAgo.toISOString().split("T")[0]; // "YYYY-MM-DD" formatı

    return (
        <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Doğum Tarihi</Label>
            <input
                type="date"
                id="dateOfBirth"
                {...form.register("dateOfBirth")} // react-hook-form ile kaydet
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                max={maxDate} // Gelecekteki ve 18 yaşından küçük tarihleri engeller
                min="1920-01-01" // Minimum bir tarih belirleyelim
            />
            {form.formState.errors.dateOfBirth && (
                <p className="text-sm font-medium text-red-500">
                    {form.formState.errors.dateOfBirth.message}
                </p>
            )}
        </div>
    );
}
