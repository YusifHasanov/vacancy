"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { authApi } from "@/app/features/auth/authSlice"
import { useDispatch } from 'react-redux'
import { setAuthenticated } from '@/app/features/auth/authSlice'

// Define the login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  // Get the login mutation hook from auth slice
  const [login] = authApi.useLoginMutation()

  // Initialize the login form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap()

      if (response.status.code === "SUCCESS") {
        // Dispatch auth state change
        dispatch(setAuthenticated(true))
        setSuccess(true)

        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.push('/')
        }, 1500)
      } else {
        setError(response.error || response.status.message)
      }
    } catch (error: any) {
      console.error("Error during login:", error)
      setError(error.data?.error || error.message || "An unknown error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  if (success) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Alert className="max-w-md bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 shadow-sm">
            <AlertDescription className="text-emerald-800 font-medium">
              Login successful! Redirecting to your dashboard...
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-md">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-full overflow-hidden border-0 shadow-lg bg-white dark:bg-zinc-900">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground mt-1">Log in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="px-6 space-y-6">
            {error && (
              <Alert className="bg-red-50 border-red-200 text-red-800">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <motion.form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="your.email@example.com"
                  className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    placeholder="Enter your password"
                    className="rounded-lg h-11 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.password.message}</p>
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
                    Logging in...
                  </div>
                ) : (
                  "Log in"
                )}
              </Button>

              <div className="text-center pt-2">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Don&lsquo;t have an account?</span>
                  <Link
                    href="/signup"
                    className="text-sm text-blue-600 font-medium hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

