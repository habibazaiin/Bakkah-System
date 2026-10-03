// src/app/(main)/page.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-[#F8FAFC] text-gray-800 font-sans selection:bg-[#1E5A7A] selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E5A7A] via-[#2A6B8F] to-[#B03052] text-white py-32 lg:py-48">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] animate-pulse duration-1000"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#3A7C15]/20 rounded-full blur-[100px] animate-pulse duration-700"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold uppercase tracking-wider text-white/90 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
            Welcome to Bakkah Systems
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Innovating Solutions across <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-[#F8FAFC]/80">
              Technology & Craftsmanship
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/80 font-medium mb-10 leading-relaxed">
            Your all-in-one platform for modern technology support and elegant, bespoke furniture designs.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#services" className="px-8 py-4 bg-[#B03052] hover:bg-[#8C233E] text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1">
              Explore Services
            </a>
            <Link href="/signup" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 backdrop-blur-md transition-all transform hover:-translate-y-1">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up text-left">
              <span className="text-[#B03052] font-bold text-sm tracking-wider uppercase">About Us</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">
                We combine technical expertise with creative craftsmanship.
              </h2>
              <p className="text-gray-600 leading-relaxed">
                At <strong>Bakkah Systems</strong>, we provide high-level tech services spanning full-stack development, AI integrations, and advanced data analytics, alongside custom interior and furniture designs.
              </p>
            </div>
            <div className="relative h-80 sm:h-[380px] w-full rounded-3xl bg-white shadow-[0_20px_60px_-15px_rgba(30,90,122,0.15)] border border-gray-100 flex items-center justify-center p-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_65px_-15px_rgba(30,90,122,0.2)] animate-fade-in-up">
              <Image src="/bakkah-logo.png" alt="Bakkah Systems" width={800} height={400} className="w-full h-full object-contain scale-105 transition-transform duration-700 hover:scale-110" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in-up">
            <span className="text-[#B03052] font-bold text-sm tracking-wider uppercase">What We Offer</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1F2937] mt-3">Our Services</h2>
          </div>

          <div className="space-y-12">
            <div className="group grid grid-cols-1 lg:grid-cols-3 bg-[#F8FAFC] rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 animate-fade-in-up text-left">
              <div className="lg:col-span-1 bg-[#1E5A7A] p-10 flex flex-col justify-center items-center text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="text-6xl mb-4 transform transition-transform duration-500 group-hover:scale-110">🪑</div>
                <h3 className="text-2xl font-bold z-10">Bakkah Furniture</h3>
              </div>
              <div className="lg:col-span-2 p-10 sm:p-12 flex flex-col justify-center items-start">
                <h4 className="text-2xl font-extrabold text-[#1F2937] mb-4">Custom Designs & Craftsmanship</h4>
                <p className="text-gray-600 leading-relaxed mb-8 max-w-2xl text-left">
                  We create exquisite, custom-made furniture pieces and modern interior solutions tailored to elevate your living and working spaces. Check out our previous designs and get in touch with our team.
                </p>
                <div>
                  <Link href="/services/furniture" className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#B03052] to-[#8C233E] rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1">
                    Discover Furniture Designs ➔
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="group bg-[#F8FAFC] p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up">
                <div className="w-16 h-16 bg-[#E8EFF3] text-[#1E5A7A] rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform group-hover:rotate-6">💻</div>
                <h3 className="text-xl font-bold text-[#1F2937] mb-3">Full Stack Support</h3>
                <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                  End-to-end software development. We build scalable, secure, and modern web applications tailored to your business needs.
                </p>
                <Link href="/services/fullstack" className="text-[#1E5A7A] font-bold text-sm hover:text-[#B03052] transition-colors flex items-center gap-2">
                  Explore Full Stack <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

              <div className="group bg-[#F8FAFC] p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up">
                <div className="w-16 h-16 bg-[#E8EFF3] text-[#1E5A7A] rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform group-hover:rotate-6">🤖</div>
                <h3 className="text-xl font-bold text-[#1F2937] mb-3">AI Support</h3>
                <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                  Leverage advanced machine learning models and AI integrations to automate processes and get intelligent insights.
                </p>
                <Link href="/services/ai" className="text-[#1E5A7A] font-bold text-sm hover:text-[#B03052] transition-colors flex items-center gap-2">
                  Access AI Tools <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

              <div className="group bg-[#F8FAFC] p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up">
                <div className="w-16 h-16 bg-[#E8EFF3] text-[#1E5A7A] rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform group-hover:rotate-6">📊</div>
                <h3 className="text-xl font-bold text-[#1F2937] mb-3">Data Analysis</h3>
                <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                  Transform raw data into actionable insights. Comprehensive analytics and reporting for better decision making.
                </p>
                <Link href="/services/data" className="text-[#1E5A7A] font-bold text-sm hover:text-[#B03052] transition-colors flex items-center gap-2">
                  View Data Services <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#F8FAFC] border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 text-center animate-fade-in-up">
          <span className="text-[#B03052] font-bold text-sm tracking-wider uppercase">We're Here to Help</span>
          <h2 className="text-3xl font-extrabold text-[#1F2937] mt-2 mb-10">Contact Us</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-3">📧</div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Email</p>
              <p className="text-base font-bold text-[#1E5A7A]">info@bakkah.com</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-3">📞</div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Phone</p>
              <p className="text-base font-bold text-[#1E5A7A]">+20 100 000 0000</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-3">📍</div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Location</p>
              <p className="text-base font-bold text-[#1E5A7A]">Cairo, Egypt</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}