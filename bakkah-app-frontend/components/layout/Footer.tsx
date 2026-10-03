import { SITE_DATA } from '@/constants/site';

export default function Footer() {
  return (
    <footer className="bg-[#1E5A7A] text-white py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm font-medium text-white/60">
          © {new Date().getFullYear()} {SITE_DATA.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}