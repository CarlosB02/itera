import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    locales: ['en', 'pt'],
    defaultLocale: 'en',
    pathnames: {
        '/': '/',
        '/privacy': {
            en: '/privacy',
            pt: '/privacidade',
        },
        '/terms': {
            en: '/terms',
            pt: '/termos',
        },
        '/about': {
            en: '/about',
            pt: '/sobre',
        },
        '/contacts': {
            en: '/contacts',
            pt: '/contactos',
        }
    }
});

export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);
