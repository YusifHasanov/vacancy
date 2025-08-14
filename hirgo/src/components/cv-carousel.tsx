'use client'

import {motion, AnimatePresence} from 'framer-motion'
import {ChevronLeft, ChevronRight, Plus} from 'lucide-react'
import {useState} from 'react'

import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"

export function CvCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)

    const templates = [
        {
            id: 1,
            name: "Rosewood",
            type: "Two-Column Modern",
            image: "/img.png?height=600&width=400",
            color: "bg-[#4A2545]"
        },
        {
            id: 2,
            name: "Aqua Splash",
            type: "Multi-Column Clean",
            image: "/img.png?height=600&width=400",
            color: "bg-[#2A9D8F]"
        },
        {
            id: 3,
            name: "Atlantic Blue",
            type: "Multi-Column Professional",
            image: "/img.png?height=600&width=400",
            color: "bg-[#264653]"
        },
        {
            id: 4,
            name: "Minimal",
            type: "Single Column Classic",
            image: "/img.png?height=600&width=400",
            color: "bg-[#E76F51]"
        },
        {
            id: 5,
            name: "Executive",
            type: "Two-Column Elite",
            image: "/img.png?height=600&width=400",
            color: "bg-[#2B2D42]"
        }
    ]

    const next = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + 1 === templates.length ? 0 : prevIndex + 1
        )
    }

    const prev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex - 1 < 0 ? templates.length - 1 : prevIndex - 1
        )
    }

    const getVisibleTemplates = () => {
        const visible = []
        for (let i = 0; i < 3; i++) {
            const index = (currentIndex + i) % templates.length
            visible.push(templates[index])
        }
        return visible
    }

    return (
        <section className="relative overflow-hidden bg-gray-50 px-6 py-24">
            <div
                className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.gray.100),white)]"/>

            <div className="container mx-auto max-w-6xl">
                <div className="mb-16 flex items-center justify-between">
                    <div>
                        <motion.h2
                            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5}}
                        >
                            CV-nizi yaratmağa başlayın
                        </motion.h2>
                        <motion.p
                            className="mt-4 text-lg text-muted-foreground"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5, delay: 0.1}}
                        >
                            İlk CV - 100% pulsuz. Bütün funksiyalar, limitsiz yükləmələr, addım-addım təlimat.
                        </motion.p>
                    </div>

                    <Button variant="outline" className="hidden sm:flex">
                        Daha çox
                        <ChevronRight className="ml-2 h-4 w-4"/>
                    </Button>
                </div>

                <div className="relative">
                    <div className="flex items-center justify-center gap-6">
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-4 z-10 h-12 w-12 rounded-full shadow-lg"
                            onClick={prev}
                        >
                            <ChevronLeft className="h-6 w-6"/>
                            <span className="sr-only">Əvvəlki template</span>
                        </Button>

                        <div className="flex gap-6 overflow-hidden px-4">
                            <AnimatePresence mode="popLayout">
                                {getVisibleTemplates().map((template, index) => (
                                    <motion.div
                                        key={template.id}
                                        layout
                                        initial={{opacity: 0, x: 100}}
                                        animate={{opacity: 1, x: 0}}
                                        exit={{opacity: 0, x: -100}}
                                        transition={{duration: 0.5}}
                                        className="relative"
                                    >
                                        <Card className="group relative aspect-[3/4] w-[300px] overflow-hidden">
                                            <CardContent className="p-0">
                                                {index === 0 && (
                                                    <div
                                                        className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                                        <Button variant="secondary" className="gap-2">
                                                            <Plus className="h-5 w-5"/>
                                                            İstifadə et
                                                        </Button>
                                                    </div>
                                                )}
                                                <div className={`h-full ${template.color}`}>
                                                    <img
                                                        src={template.image}
                                                        alt={`${template.name} CV template`}
                                                        className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                        {index === 0 && (
                                            <motion.div
                                                initial={{opacity: 0, y: 20}}
                                                animate={{opacity: 1, y: 0}}
                                                className="mt-4 text-center"
                                            >
                                                <h3 className="font-semibold">{template.name}</h3>
                                                <p className="text-sm text-muted-foreground">{template.type}</p>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-4 z-10 h-12 w-12 rounded-full shadow-lg"
                            onClick={next}
                        >
                            <ChevronRight className="h-6 w-6"/>
                            <span className="sr-only">Növbəti template</span>
                        </Button>
                    </div>

                    <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                        {templates.map((_, index) => (
                            <button
                                key={index}
                                className={`h-2 w-2 rounded-full transition-colors ${
                                    index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                                }`}
                                onClick={() => setCurrentIndex(index)}
                            >
                                <span className="sr-only">Slayd {index + 1} keç</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
