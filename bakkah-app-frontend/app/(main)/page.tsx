// src/app/(main)/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import ContactSection from '@/components/home/ContactSection';
import ServiceCard from '@/components/home/ServiceCard';
import { SERVICES_LIST } from '@/constants/site';

export default function HomePage() {
  const featuredService = SERVICES_LIST.find((s) => s.isFeatured);
  const gridServices = SERVICES_LIST.filter((s) => !s.isFeatured);

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
            Your all-in-one ecosystem for dedicated software teams, smart tools, and bespoke interior design.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#services"
              className="px-8 py-4 bg-[#B03052] hover:bg-[#8C233E] text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1"
            >
              Explore Services
            </a>
            <Link
              href="/signup"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 backdrop-blur-md transition-all transform hover:-translate-y-1"
            >
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
              <span className="text-[#B03052] font-bold text-sm tracking-wider uppercase">
                About Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">
                We combine technical expertise with creative craftsmanship.
              </h2>
              <p className="text-gray-600 leading-relaxed">
                At <strong>Bakkah Systems</strong>, we empower businesses with specialized tech support teams (Full Stack & AI), efficient digital utilities like PmP Task Management and PDF tools, along with handcrafted, custom furniture solutions.
              </p>
            </div>
            <div className="relative h-80 sm:h-[380px] w-full rounded-3xl bg-white shadow-[0_20px_60px_-15px_rgba(30,90,122,0.15)] border border-gray-100 flex items-center justify-center p-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_65px_-15px_rgba(30,90,122,0.2)] animate-fade-in-up">
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
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="text-[#B03052] font-bold text-sm tracking-wider uppercase">
              What We Offer
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1F2937] mt-3">
              Our Ecosystem
            </h2>
          </div>

          <div className="space-y-12">
            {/* Featured Service */}
            {featuredService && <ServiceCard service={featuredService} />}

            {/* Grid Services */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {gridServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />
    </div>
  );
}