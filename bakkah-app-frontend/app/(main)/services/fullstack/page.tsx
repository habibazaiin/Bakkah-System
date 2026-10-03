// src/app/(main)/services/fullstack/page.tsx
import Link from 'next/link';
// أزلنا استدعاء Navbar و Footer من هنا تماماً

export default function FullStackServicePage() {
    return (
        // أزلنا تغليف الصفحة بـ min-h-screen و flex-col لأن الـ Layout بيعمل كده
        <div className="bg-[#F8FAFC] text-gray-800 font-sans selection:bg-[#1E5A7A] selection:text-white">

            {/* Hero Section للخدمة */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#1E5A7A] via-[#2A6B8F] to-[#B03052] text-white py-24 lg:py-32">
                <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] animate-pulse duration-1000"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#3A7C15]/20 rounded-full blur-[80px] animate-pulse duration-700"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center animate-fade-in-up">
                    <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold uppercase tracking-wider text-white/90 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
                        Technology Services
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                        Full Stack Web Development
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg text-white/80 font-medium leading-relaxed">
                        We build scalable, highly responsive, and secure web applications. From front-end interfaces to complex back-end architectures, our expert team has you covered.
                    </p>
                </div>
            </section>

            {/* تفاصيل الخدمة (About our Team & Expertise) */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6 animate-fade-in-up">
                            <span className="text-[#B03052] font-bold text-sm tracking-wider uppercase">Our Expertise</span>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">
                                A brilliant team ready to build your dream website.
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                At <strong>Bakkah Systems</strong>, we take pride in our elite team of software engineers. Whether you need a corporate website, a complex e-commerce platform, or a custom SaaS product, we have the technical prowess to deliver.
                            </p>
                            <ul className="space-y-4 text-gray-600 font-medium">
                                <li className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-[#1E5A7A]/10 text-[#1E5A7A] rounded-full flex items-center justify-center text-sm">✓</span>
                                    Custom Web Applications
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-[#1E5A7A]/10 text-[#1E5A7A] rounded-full flex items-center justify-center text-sm">✓</span>
                                    API Development & Integration
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-[#1E5A7A]/10 text-[#1E5A7A] rounded-full flex items-center justify-center text-sm">✓</span>
                                    High Performance & Security
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-[#1E5A7A]/10 text-[#1E5A7A] rounded-full flex items-center justify-center text-sm">✓</span>
                                    Scalable Cloud Architecture
                                </li>
                            </ul>
                        </div>

                        {/* صورة تعبيرية أو بوكس بيعبر عن الكود */}
                        <div className="relative h-[400px] w-full rounded-3xl bg-[#F8FAFC] shadow-lg border border-gray-100 flex flex-col items-center justify-center p-8 transition-transform duration-500 hover:-translate-y-2 animate-fade-in-up">
                            <div className="text-8xl mb-6 transform transition-transform hover:scale-110 duration-300">💻</div>
                            <h3 className="text-2xl font-bold text-[#1E5A7A] text-center mb-2">Modern Tech Stack</h3>
                            <p className="text-center text-gray-500 font-medium">Any Technology You Want</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* كيف نعمل (Our Process) */}
            <section className="py-20 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <span className="text-[#B03052] font-bold text-sm tracking-wider uppercase">Workflow</span>
                        <h2 className="text-3xl font-extrabold text-[#1F2937] mt-2">How We Work</h2>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            <div className="w-12 h-12 bg-[#1E5A7A]/10 text-[#1E5A7A] rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                            <h3 className="text-lg font-bold text-[#1F2937] mb-2">Planning & UI/UX</h3>
                            <p className="text-gray-500 text-sm">Understanding your vision and designing a seamless user experience.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <div className="w-12 h-12 bg-[#B03052]/10 text-[#B03052] rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                            <h3 className="text-lg font-bold text-[#1F2937] mb-2">Development</h3>
                            <p className="text-gray-500 text-sm">Writing clean, maintainable code using cutting-edge technologies.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <div className="w-12 h-12 bg-[#3A7C15]/10 text-[#3A7C15] rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                            <h3 className="text-lg font-bold text-[#1F2937] mb-2">Testing & Launch</h3>
                            <p className="text-gray-500 text-sm">Rigorous testing for security and performance before going live.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* معلومات التواصل الخاصة بالتيم */}
            <section className="py-20 bg-white border-t border-gray-100 mt-auto">
                <div className="max-w-4xl mx-auto px-4 text-center animate-fade-in-up">
                    <span className="text-[#B03052] font-bold text-sm tracking-wider uppercase">Start Your Project</span>
                    <h2 className="text-3xl font-extrabold text-[#1F2937] mt-2 mb-10">Contact The Tech Team</h2>

                    <div className="bg-[#F8FAFC] p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-around gap-8 transition-all duration-500 hover:shadow-lg">
                        <div className="text-center">
                            <div className="text-3xl mb-3">✉️</div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-2">Email Us</p>
                            <a href="mailto:tech@bakkah.com" className="text-lg font-bold text-[#1E5A7A] hover:text-[#B03052] transition-colors">tech@bakkah.com</a>
                        </div>

                        <div className="hidden md:block w-px h-16 bg-gray-200" />

                        <div className="text-center">
                            <div className="text-3xl mb-3">📱</div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-2">Call Us</p>
                            <a href="tel:+201000000000" className="text-lg font-bold text-[#1E5A7A] hover:text-[#B03052] transition-colors">+20 100 000 0000</a>
                        </div>
                    </div>

                    <div className="mt-12">
                        <Link href="/" className="text-sm font-bold text-gray-500 hover:text-[#1E5A7A] transition-colors underline underline-offset-4">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}