'use client'

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {Lightbulb, Shield, Users} from "lucide-react"

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,transparent,black)] opacity-20"></div>
                <motion.section
                    className="container mx-auto px-4 pt-32 pb-20 relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="max-w-4xl relative">
                        <div className="absolute -top-8 -left-8 w-24 h-24 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                        <div className="absolute top-16 right-8 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                        <motion.h1
                            className="text-5xl md:text-6xl font-bold mb-8 text-slate-900"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Fit2Job - Bir iş platformasından
                            <br />daha çoxu
                        </motion.h1>
                        <motion.p
                            className="text-xl text-slate-600 max-w-2xl"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            2025-ci ildən bəri biz minlərlə insanın karyera arzularını həyata keçiririk.
                            Növbəti fürsətinizi burada tapa bilərsiniz.
                        </motion.p>
                    </div>
                    <style jsx>{`
                        .bg-grid-slate-200 {
                            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(226 232 240 / 0.3)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
                        }
                        @keyframes blob {
                            0% { transform: translate(0px, 0px) scale(1); }
                            33% { transform: translate(30px, -50px) scale(1.1); }
                            66% { transform: translate(-20px, 20px) scale(0.9); }
                            100% { transform: translate(0px, 0px) scale(1); }
                        }
                        .animate-blob {
                            animation: blob 7s infinite;
                        }
                        .animation-delay-2000 {
                            animation-delay: 2s;
                        }
                        .animation-delay-4000 {
                            animation-delay: 4s;
                        }
                    `}</style>
                </motion.section>
            </div>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,transparent,black)] opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-4xl font-bold text-center text-slate-900 mb-16 relative">
                        Təsir gücümüz
                        <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-500"></span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { number: "50k+", label: "Aktiv iş elanları", icon: "📋" },
                            { number: "2M+", label: "İstifadəçi sayı", icon: "👥" },
                            { number: "500+", label: "Partnyor şirkətlər", icon: "🤝" },
                            { number: "95%", label: "İşə qəbul sayı", icon: "🏆" },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                            >
                                <div className="text-5xl mb-4">{stat.icon}</div>
                                <div className="text-4xl font-bold text-slate-900 mb-2">{stat.number}</div>
                                <div className="text-slate-600 font-medium text-lg">{stat.label}</div>
                                <div className="mt-4 w-12 h-1 bg-blue-500 rounded-full"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Missiyamız</h2>
                    <p className="text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
                        &quot;Biz inanırıq ki, hər kəs öz arzuladığı işə layiqdir. Buna görə də doğru imkanları tapmaq prosesi sürətli, rahat və xoş olmalıdır. Biz sadəcə insanları işlə deyil, karyera və gələcəklə birləşdiririk.&quot;
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <img src="/placeholder.svg?height=4&width=4" alt="CEO" className="rounded-full w-10 h-10" />
                        <div className="text-left">
                            <div className="font-semibold text-slate-900">Sarah Johnson</div>
                            <div className="text-slate-600">Fit2Job CEO</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Principles Section */}
            <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,transparent,black)] opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-4xl font-bold text-center text-slate-900 mb-16 relative">
                        İstiqamətverici Prinsiplərimiz
                        <span
                            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-500"></span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "İstifadəçi Mərkəzli Yanaşma",
                                description:
                                    "Hər bir xüsusiyyət və qərar, istifadəçilərimizin uğurunu nəzərə alaraq hazırlanır. Biz daim rəy toplayır və platformamızı təkmilləşdiririk.",
                                icon: Users,
                                color: "from-blue-400 to-blue-600",
                            },
                            {
                                title: "Yenilik Əsaslı Yanaşma",
                                description:
                                    "Biz iş axtarışı və işə qəbul prosesini daha səmərəli və effektiv etmək üçün ən müasir texnologiyalardan istifadə edirik.",
                                icon: Lightbulb,
                                color: "from-purple-400 to-purple-600",
                            },
                            {
                                title: "Güvən və Şəffaflıq",
                                description:
                                    "Biz dürüst ünsiyyət və etibarlı xidmət göstərməklə uzunmüddətli əlaqələr qururuq.",
                                icon: Shield,
                                color: "from-green-400 to-green-600",
                            },
                        ].map((principle, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: 0.2 + index * 0.1}}
                            >
                                <div className={`h-2 bg-gradient-to-r ${principle.color}`}></div>
                                <div className="p-8">
                                    <div
                                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${principle.color} flex items-center justify-center mb-6`}
                                    >
                                        <principle.icon className="w-8 h-8 text-white"/>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-slate-900 mb-4">{principle.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{principle.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* Image Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4sA7Oh7Bsp5yGhUoBFlsPYqUSIVDdk.png"
                            alt="Team collaboration"
                            className="rounded-lg shadow-lg h-96 w-96"
                        />
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Sadə dəyərlər məqsədlərə çatmağa kömək edir</h2>
                            <p className="text-slate-600 mb-8">
                                Fit2Job, hər bir iş axtaranın ehtiyaclarını qarşılamaq üçün hərtərəfli bir həll təqdim edir. O, həm axtarışın başlanğıc nöqtəsi, həm də son dayanacağı kimi xidmət edir. Fit2Job, iş axtarışında xoşagəlməz güzəştlərə ehtiyacı aradan qaldırmağa həsr olunmuş etibarlı bir köməkçidir və insanların karyera arzularını reallığa çevirməyə kömək edir.
                            </p>
                            <Button variant="outline">Dəyərlərimiz haqqında daha çox öyrənin</Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AboutUs