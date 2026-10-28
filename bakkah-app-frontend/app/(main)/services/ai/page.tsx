import Link from 'next/link';
import { AdminContactService } from '@/services/admin.service';

export const revalidate = 0; 

export default async function AIServicePage() {
    // 🌟 جلب البيانات الديناميكية لخدمة الـ AI
    const contactInfo = await AdminContactService.getPublicContact('ai');

    return (
        <div className="bg-[#F8FAFC] text-gray-800 font-sans selection:bg-[#1E5A7A] selection:text-white">
            <section className="relative overflow-hidden bg-gradient-to-br from-[#1E5A7A] via-[#2A6B8F] to-[#B03052] text-white py-24 lg:py-32">
                <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] animate-pulse duration-1000"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#B03052]/20 rounded-full blur-[80px] animate-pulse duration-700"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center animate-fade-in-up">
                    <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold uppercase tracking-wider text-white/90 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
                        Artificial Intelligence
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                        AI & Machine Learning Solutions
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg text-white/80 font-medium leading-relaxed">
                        Integrate advanced artificial intelligence, predictive machine learning models, and smart automation directly into your business operations.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6 animate-fade-in-up">
                            <span className="text-[#B03052] font-bold text-sm tracking-wider uppercase">Our Expertise</span>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">
                                Empowering your business with smart technology.
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                At <strong>Bakkah Systems</strong>, our AI engineers specialize in turning complex data into actionable insights. We build intelligent systems that learn, adapt, and drive growth for your enterprise.
                            </p>
                            <ul className="space-y-4 text-gray-600 font-medium">
                                <li className="flex items-center gap-3"><span className="w-6 h-6 bg-[#1E5A7A]/10 text-[#1E5A7A] rounded-full flex items-center justify-center text-sm">✓</span> Predictive Analytics & Big Data</li>
                                <li className="flex items-center gap-3"><span className="w-6 h-6 bg-[#1E5A7A]/10 text-[#1E5A7A] rounded-full flex items-center justify-center text-sm">✓</span> Natural Language Processing (NLP)</li>
                                <li className="flex items-center gap-3"><span className="w-6 h-6 bg-[#1E5A7A]/10 text-[#1E5A7A] rounded-full flex items-center justify-center text-sm">✓</span> Computer Vision Systems</li>
                                <li className="flex items-center gap-3"><span className="w-6 h-6 bg-[#1E5A7A]/10 text-[#1E5A7A] rounded-full flex items-center justify-center text-sm">✓</span> Intelligent Process Automation</li>
                            </ul>
                        </div>
                        <div className="relative h-[400px] w-full rounded-3xl bg-[#F8FAFC] shadow-lg border border-gray-100 flex flex-col items-center justify-center p-8 transition-transform duration-500 hover:-translate-y-2 animate-fade-in-up">
                            <div className="text-8xl mb-6 transform transition-transform hover:scale-110 duration-300">🤖</div>
                            <h3 className="text-2xl font-bold text-[#1E5A7A] text-center mb-2">Smart AI Models</h3>
                            <p className="text-center text-gray-500 font-medium">Tailored for Your Industry</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <span className="text-[#B03052] font-bold text-sm tracking-wider uppercase">Workflow</span>
                        <h2 className="text-3xl font-extrabold text-[#1F2937] mt-2">How We Implement AI</h2>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            <div className="w-12 h-12 bg-[#1E5A7A]/10 text-[#1E5A7A] rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                            <h3 className="text-lg font-bold text-[#1F2937] mb-2">Data Strategy</h3>
                            <p className="text-gray-500 text-sm">Analyzing your data infrastructure and defining AI objectives.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <div className="w-12 h-12 bg-[#B03052]/10 text-[#B03052] rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                            <h3 className="text-lg font-bold text-[#1F2937] mb-2">Model Training</h3>
                            <p className="text-gray-500 text-sm">Building and training custom machine learning algorithms.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <div className="w-12 h-12 bg-[#3A7C15]/10 text-[#3A7C15] rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                            <h3 className="text-lg font-bold text-[#1F2937] mb-2">Deployment</h3>
                            <p className="text-gray-500 text-sm">Seamlessly integrating AI models into your production environment.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white border-t border-gray-100 mt-auto">
                <div className="max-w-4xl mx-auto px-4 text-center animate-fade-in-up">
                    <span className="text-[#B03052] font-bold text-sm tracking-wider uppercase">Start Your Project</span>
                    <h2 className="text-3xl font-extrabold text-[#1F2937] mt-2 mb-10">Contact The AI Team</h2>
                    
                    <div className="bg-[#F8FAFC] p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-around gap-8 transition-all duration-500 hover:shadow-lg">
                        <div className="text-center">
                            <div className="text-3xl mb-3">✉️</div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-2">Email Us</p>
                            <a href={`mailto:${contactInfo.email}`} className="text-lg font-bold text-[#1E5A7A] hover:text-[#B03052] transition-colors">
                                {contactInfo.email}
                            </a>
                        </div>
                        <div className="hidden md:block w-px h-16 bg-gray-200" />
                        <div className="text-center">
                            <div className="text-3xl mb-3">📱</div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-2">Call Us</p>
                            <a href={`tel:${contactInfo.phone}`} className="text-lg font-bold text-[#1E5A7A] hover:text-[#B03052] transition-colors">
                                {contactInfo.phone}
                            </a>
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