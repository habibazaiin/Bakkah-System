import { FurnitureService } from '@/services/furniture.service';
import { AdminContactService } from '@/services/admin.service';
import { Phone } from 'lucide-react';


export const revalidate = 0;

export default async function FurnitureServicePage() {
    const portfolioItems = await FurnitureService.getPublicItems();
    const contactInfo = await AdminContactService.getPublicContact('furniture');

    return (
        <div className="bg-[#F8FAFC] text-gray-800 font-sans selection:bg-[#1E5A7A] selection:text-white pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#1E5A7A] via-[#2A6B8F] to-[#154560] text-white py-24 lg:py-32">
                <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#B03052]/20 rounded-full blur-[80px] animate-pulse"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center animate-fade-in-up">
                    <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold uppercase tracking-wider text-white/90 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
                        Custom Design & Craftsmanship
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                        Bakkah Furniture
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-white/80 font-medium leading-relaxed mb-8">
                        Bespoke, custom-made furniture designs and interior solutions crafted to elevate your home and workspace environments. If you can imagine it, we can build it.
                    </p>

                    <div className="flex justify-center gap-4 flex-wrap mt-8">
                        <a
                            href={`tel:${contactInfo.phone}`}
                            className="px-6 py-3 bg-[#B03052] hover:bg-[#8C233E] text-white font-bold rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 flex items-center gap-2"
                        >
                            <Phone size={18} /> Call Us
                        </a>

                        <a
                            href="https://instagram.com/bakkahsystems"
                            target="_blank"
                            rel="noreferrer"
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 backdrop-blur-md transition-transform transform hover:-translate-y-1 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                            </svg>
                            Instagram
                        </a>
                    </div>
                </div>
            </section>

            {/* Portfolio Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <span className="text-[#B03052] font-bold text-sm tracking-wider uppercase">Our Portfolio</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mt-2">Latest Masterpieces</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {portfolioItems.map((item, idx) => (
                            <div key={item.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="relative h-64 overflow-hidden bg-gray-100">
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                <details className="p-6 cursor-pointer group/details [&_summary::-webkit-details-marker]:hidden">
                                    <summary className="flex justify-between items-center outline-none">
                                        <h3 className="text-xl font-bold text-[#1E5A7A] group-hover:text-[#B03052] transition-colors">{item.title}</h3>
                                        <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#1E5A7A] transform transition-transform duration-300 group-open/details:rotate-180">
                                            ↓
                                        </span>
                                    </summary>
                                    <div className="mt-4 pt-4 border-t border-gray-100 overflow-hidden">
                                        <p className="text-gray-600 leading-relaxed text-sm animate-fade-in-up">
                                            {item.description}
                                        </p>
                                    </div>
                                </details>
                            </div>
                        ))}

                        {portfolioItems.length === 0 && (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                Portfolio is currently being updated with new designs. Check back soon!
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}