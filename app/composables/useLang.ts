/** Shared admin UI language — picked on the auth screens or in the header, kept across navigation. Prototype-only (no real i18n); CS is the default. */
export const useLang = () => useState<'cs' | 'en'>('lang', () => 'cs')
