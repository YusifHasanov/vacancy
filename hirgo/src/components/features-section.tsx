'use client'

import { motion } from 'framer-motion'
import { Briefcase, FileText, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";

export function FeaturesSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const router = useRouter()
  const userRole = Cookies.get('userRole')


  const features = [
    {
      title: "Vakansiyalar",
      description: "Müxtəlif sənaye sahələrində iş imkanlarının geniş siyahısına nəzər salın",
      icon: Briefcase,
      color: "from-purple-500/20 to-blue-500/20",
      path: "/vacancies",
      mustRole: null
    },
    {
      title: "İş elanı paylaş",
      description: "Mükəmməl namizədləri tapmaq üçün iş siyahılarınızı asanlıqla yerləşdirin və idarə edin",
      icon: PlusCircle,
      color: "from-emerald-500/20 to-teal-500/20",
      path: "/dashboard/vacancies/new",
      mustRole: "ROLE_COMPANY"
    },
    {
      title: "CV yarat",
      description: "İntuitiv CV qurucu alətimizlə peşəkar CV yaradın",
      icon: FileText,
      color: "from-orange-500/20 to-red-500/20",
      path: "/profile/cvmaker",
      mustRole: null
    }
  ]

  const handleFeatureClick = (path: string, mustRole: string | null) => {
    // If mustRole is not null and userRole doesn't match, don't navigate
    console.log(mustRole, userRole)
    if (mustRole !== null && userRole !== mustRole) {
      return
    }
    router.push(path)
  }

  return (
      <section className="relative overflow-hidden px-6 py-24 pt-8">
        {/* Background gradient blur */}
        <div
            className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)]"/>

        <div className="container mx-auto max-w-6xl">
          <motion.h2
              className="text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5}}
          >
            Xidmətlərimiz
          </motion.h2>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
                <motion.div
                    key={feature.title}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: index * 0.1}}
                    onHoverStart={() => {
                      if (feature.mustRole === null || userRole === feature.mustRole) {
                        setHoveredCard(index)
                      }
                    }}
                    onHoverEnd={() => setHoveredCard(null)}
                    onClick={() => handleFeatureClick(feature.path, feature.mustRole)}
                    className="relative"
                >
                  <div
                      className={`group relative overflow-hidden rounded-3xl bg-gradient-to-b ${feature.color} p-8 h-full
                  transition-all duration-500 ${
                    feature.mustRole !== null && userRole !== feature.mustRole 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:shadow-2xl hover:translate-y-[-4px] cursor-pointer'
                  }`}
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent opacity-0
                  transition-opacity duration-500 group-hover:opacity-100"/>

                    {/* Icon with bounce animation on hover */}
                    <motion.div
                        animate={hoveredCard === index ? {y: [0, -8, 0]} : {}}
                        transition={{duration: 0.5}}
                        className="mb-4 inline-block rounded-2xl bg-white p-4 shadow-lg"
                    >
                      <feature.icon className="h-6 w-6"/>
                    </motion.div>

                    {/* Content */}
                    <div className="relative">
                      <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>

                    {/* Interactive arrow that appears on hover */}
                    <motion.div
                        initial={{opacity: 0, x: -10}}
                        animate={{
                          opacity: hoveredCard === index ? 1 : 0,
                          x: hoveredCard === index ? 0 : -10
                        }}
                        className="absolute bottom-8 right-8"
                    >
                      <svg
                          className="h-6 w-6 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>
            ))}
          </div>
        </div>
      </section>
  )
}
