// src/constants/site.ts
export const SITE_DATA = {
    name: 'Bakkah Systems',
    contact: {
        email: 'info@bakkah.com',
        techEmail: 'tech@bakkah.com',
        phone: '+20 100 000 0000',
        location: 'Cairo, Egypt',
    },
    links: {
        home: '/',
        about: '/#about',
        services: '/#services',
        contact: '/#contact',
        furniture: '/services/furniture',
        fullstack: '/services/fullstack',
        ai: '/services/ai',
        pnp: '/services/pnp',
        pdfMerger: '/services/pdf-merger',
        signIn: '/signin',
        signUp: '/signup',
    }
};

export interface ServiceItem {
    id: string;
    title: string;
    category: 'Tech' | 'Tools' | 'Craftsmanship';
    description: string;
    icon: string;
    href: string;
    badge?: string;
    isFeatured?: boolean;
}

export const SERVICES_LIST: ServiceItem[] = [
    {
        id: 'furniture',
        title: 'Bakkah Furniture',
        category: 'Craftsmanship',
        description: 'Bespoke, custom-made furniture designs and interior solutions crafted to elevate home and workspace environments.',
        icon: '🪑',
        href: SITE_DATA.links.furniture,
        isFeatured: true,
    },
    {
        id: 'pmp',
        title: 'PmP Task Management',
        category: 'Tools',
        description: 'Streamline team workflows, track milestones, and manage project tasks effortlessly with our intuitive management tool.',
        icon: '📋',
        href: SITE_DATA.links.pnp,
        badge: 'Productivity Tool',
    },
    {
        id: 'pdf-merger',
        title: 'PDF Merger Tool',
        category: 'Tools',
        description: 'Fast, secure, and seamless utility to merge, organize, and manage your PDF documents in seconds.',
        icon: '🧩',
        href: SITE_DATA.links.pdfMerger,
        badge: 'Utility',
    },
    {
        id: 'fullstack',
        title: 'Full Stack Support Team',
        category: 'Tech',
        description: 'Dedicated software engineers building modern, scalable web applications and enterprise systems.',
        icon: '💻',
        href: SITE_DATA.links.fullstack,
    },
    {
        id: 'ai',
        title: 'AI Support Team',
        category: 'Tech',
        description: 'Integrate artificial intelligence, machine learning models, and smart automation directly into your operations.',
        icon: '🤖',
        href: SITE_DATA.links.ai,
    },
];