// src/components/home/ServiceCard.tsx
import Link from 'next/link';
import { ServiceItem } from '@/constants/site';

interface ServiceCardProps {
  service: ServiceItem;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  if (service.isFeatured) {
    return (
      <div className="group grid grid-cols-1 lg:grid-cols-3 bg-[#F8FAFC] rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 animate-fade-in-up text-left">
        <div className="lg:col-span-1 bg-gradient-to-br from-[#1E5A7A] to-[#2A6B8F] p-10 flex flex-col justify-center items-center text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="text-6xl mb-4 transform transition-transform duration-500 group-hover:scale-110">
            {service.icon}
          </div>
          <h3 className="text-2xl font-bold z-10">{service.title}</h3>
        </div>
        <div className="lg:col-span-2 p-8 sm:p-12 flex flex-col justify-center items-start">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B03052] bg-[#B03052]/10 px-3 py-1 rounded-full mb-3">
            {service.category}
          </span>
          <h4 className="text-2xl font-extrabold text-[#1F2937] mb-4">
            Custom Designs & Craftsmanship
          </h4>
          <p className="text-gray-600 leading-relaxed mb-8 max-w-2xl text-left">
            {service.description} Check out our custom catalogue and consult directly with our artisan design team.
          </p>
          <Link
            href={service.href}
            className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#B03052] to-[#8C233E] rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1"
          >
            Discover Designs ➔
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-[#F8FAFC] p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="w-16 h-16 bg-[#E8EFF3] text-[#1E5A7A] rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:rotate-6">
            {service.icon}
          </div>
          {service.badge && (
            <span className="text-xs font-semibold text-[#1E5A7A] bg-[#1E5A7A]/10 px-3 py-1 rounded-full">
              {service.badge}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-[#1F2937] mb-3">{service.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {service.description}
        </p>
      </div>

      <Link
        href={service.href}
        className="text-[#1E5A7A] font-bold text-sm hover:text-[#B03052] transition-colors flex items-center gap-2 mt-auto"
      >
        Explore Service <span className="group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  );
}