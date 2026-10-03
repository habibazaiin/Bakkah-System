// src/app/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-800 flex flex-col font-sans selection:bg-[#1E5A7A] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E5A7A] via-[#2A6B8F] to-[#B03052] text-white py-32 lg:py-48">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] animate-pulse duration-1000"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#3A7C15]/20 rounded-full blur-[100px] animate-pulse duration-700"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold uppercase tracking-wider text-white/90 bg-white/10 rounded-full border border-white/20 backdrop-blur-md transition-transform hover:scale-105">
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
            <a
              href="#services"
              className="px-8 py-4 bg-[#B03052] hover:bg-[#8C233E] text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(176,48,82,0.3)]"
            >
              Explore Services
            </a>
            <Link
              href="/signup"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,255,255,0.1)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <span className="text-[#B03052] font-bold text-sm tracking-wider uppercase">About Us</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">
                We combine technical expertise with creative craftsmanship.
              </h2>
              <p className="text-gray-600 leading-relaxed">
                At <strong>Bakkah Systems</strong>, we provide high-level tech services spanning full-stack development, AI integrations, and advanced data analytics, alongside custom interior and furniture designs.
              </p>
            </div>

            {/* الكونتينر الأبيض مع الشادو وتأثير حركة للوجو */}
            <div className="relative h-80 sm:h-[380px] w-full rounded-3xl bg-white shadow-[0_20px_60px_-15px_rgba(30,90,122,0.15)] border border-gray-100 flex items-center justify-center p-4 sm:p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_65px_-15px_rgba(30,90,122,0.2)] animate-fade-in-up">
              <Image
                src="/bakkah-logo.png"
                alt="Bakkah Systems"
                width={800}
                height={400}
                className="w-full h-full object-contain scale-105 transition-transform duration-700 hover:scale-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="text-[#B03052] font-bold text-sm tracking-wider uppercase">Our Services</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mt-2">What We Offer</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Furniture Service */}
            <div id="furniture" className="group bg-[#F8FAFC] p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up">
              <div className="w-14 h-14 bg-[#B03052]/10 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                🪑
              </div>
              <h3 className="text-2xl font-bold text-[#1E5A7A] mb-3 transition-colors group-hover:text-[#B03052]">Furniture Design</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Custom furniture manufacturing, modern designs, and tailored interior concepts for home and office spaces.
              </p>
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-shadow group-hover:shadow-md">
                <p className="text-xs text-gray-500 font-semibold mb-1">CONNECT WITH FURNITURE TEAM</p>
                <p className="text-sm font-bold text-[#1E5A7A]">Email: furniture@bakkah.com</p>
              </div>
            </div>

            {/* Tech Services */}
            <div id="tech" className="group bg-[#F8FAFC] p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up">
              <div className="w-14 h-14 bg-[#1E5A7A]/10 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                ⚡
              </div>
              <h3 className="text-2xl font-bold text-[#1E5A7A] mb-3 transition-colors group-hover:text-[#B03052]">Technology Solutions</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Cutting-edge tech services including Full Stack Development, AI Model Integration, and Data Analysis.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl text-sm font-medium text-gray-700 flex justify-between shadow-sm transition-transform duration-300 hover:scale-[1.02]">
                  <span>• Full Stack Support</span>
                  <span className="text-xs text-[#1E5A7A] font-bold">Tech Team</span>
                </div>
                <div className="p-3 bg-white rounded-xl text-sm font-medium text-gray-700 flex justify-between shadow-sm transition-transform duration-300 hover:scale-[1.02]">
                  <span>• AI Support</span>
                  <span className="text-xs text-[#1E5A7A] font-bold">AI Team</span>
                </div>
                <div className="p-3 bg-white rounded-xl text-sm font-medium text-gray-700 flex justify-between shadow-sm transition-transform duration-300 hover:scale-[1.02]">
                  <span>• Data Analysis</span>
                  <span className="text-xs text-[#1E5A7A] font-bold">Data Team</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#F8FAFC] border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center animate-fade-in-up">
          <span className="text-[#B03052] font-bold text-sm tracking-wider uppercase">Get In Touch</span>
          <h2 className="text-3xl font-extrabold text-[#1F2937] mt-2 mb-8">Contact Us</h2>
          <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-around gap-6 transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">General Inquiries</p>
              <p className="text-base font-bold text-[#1E5A7A] transition-colors hover:text-[#B03052] cursor-pointer">info@bakkah.com</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-200" />
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Phone</p>
              <p className="text-base font-bold text-[#1E5A7A] transition-colors hover:text-[#B03052] cursor-pointer">+20 100 000 0000</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E5A7A] text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm font-medium text-white/70">
          © 2026 Bakkah Systems. All rights reserved.
        </div>
      </footer>
    </div>
  );
}