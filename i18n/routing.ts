import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ru', 'me', 'de', 'es', 'fr'],
  defaultLocale: 'en',
});
