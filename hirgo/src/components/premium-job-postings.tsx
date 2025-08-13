'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Briefcase, User } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation';

export function PremiumJobPostings() {
  const router = useRouter();
  const features = [
    "Axtarış nəticələrində prioritet sıralama",
    "İrəli səviyyəli analitika və təhlillər",
    "Xüsusi dəstək komandası",
    "Fərdi markalaşdırma seçimləri",
  ]


  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 px-6 py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)]" />
      
      <div className="container mx-auto max-w-4xl text-center">
        <motion.h2 
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          İş axtarışınızı və işçi axtarışınızı sürətləndirin
        </motion.h2>
        <motion.p 
          className="mt-4 text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Rəqabətli iş bazarında fərqlənmək üçün premium xüsusiyyətləri açın
        </motion.p>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Briefcase className="h-6 w-6 text-primary" />
                İşəgötürənlər üçün
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-left">
                {features.map((feature, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <CheckCircle className="h-5 w-5 text-primary" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={() => router.push("/candidates")}>
                Premium elan paylaş
              </Button>
            </CardFooter>
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10" />
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <User className="h-6 w-6 text-primary" />
                İş Axtaranlar üçün
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-left">
                {features.map((feature, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <CheckCircle className="h-5 w-5 text-primary" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg">
                Hesabını yüksəlt
              </Button>
            </CardFooter>
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary/10" />
          </Card>
        </div>

        <motion.p 
          className="mt-12 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Premium xüsusiyyətlərimizlə işə qəbulunu və karyera artımını artıran minlərlə uğurlu biznes və peşəkarlara qoşulun.
        </motion.p>
      </div>
    </section>
  )
}