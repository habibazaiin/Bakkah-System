import { SITE_DATA } from '@/constants/site';

interface ContactSectionProps {
  title?: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  showLocation?: boolean;
}

export default function ContactSection({
  title = "Contact Us",
  subtitle = "We're Here to Help",
  email = SITE_DATA.contact.email,
  phone = SITE_DATA.contact.phone,
  showLocation = true
}: ContactSectionProps) {
  return (
    <section id="contact" className="py-20 bg-[#F8FAFC] border-t border-gray-100 mt-auto">
      <div className="max-w-5xl mx-auto px-4 text-center animate-fade-in-up">
        <span className="text-[#B03052] font-bold text-sm tracking-wider uppercase">{subtitle}</span>
        <h2 className="text-3xl font-extrabold text-[#1F2937] mt-2 mb-10">{title}</h2>
        
        <div className={`grid gap-6 ${showLocation ? 'md:grid-cols-3' : 'md:grid-cols-2 max-w-3xl mx-auto'}`}>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">✉️</div>
            <p className="text-xs text-gray-400 font-bold uppercase mb-2">Email</p>
            <a href={`mailto:${email}`} className="text-base font-bold text-[#1E5A7A] hover:text-[#B03052] transition-colors">{email}</a>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">📞</div>
            <p className="text-xs text-gray-400 font-bold uppercase mb-2">Phone</p>
            <a href={`tel:${phone}`} className="text-base font-bold text-[#1E5A7A] hover:text-[#B03052] transition-colors">{phone}</a>
          </div>

          {showLocation && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">📍</div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Location</p>
              <p className="text-base font-bold text-[#1E5A7A]">{SITE_DATA.contact.location}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}