import { messages } from '../i18n/messages'

/**
 * Lightweight translator for the prototype. `t('events.thisWeek', { n: 2 })`
 * resolves against the dictionary for the current useLang() value, falls back
 * to English, then to the raw key. Supports `{param}` interpolation.
 *
 * Reactive in templates: t() reads useLang().value at call time, so the markup
 * re-renders when the language switches.
 */
const lookup = (lang: 'cs' | 'en', key: string): unknown =>
  key.split('.').reduce<any>((o, k) => (o == null ? undefined : o[k]), messages[lang])

export const useT = () => {
  const lang = useLang()
  return (key: string, params?: Record<string, string | number>): string => {
    const raw = lookup(lang.value, key) ?? lookup('en', key)
    let str = typeof raw === 'string' ? raw : key
    if (params) {
      for (const [k, v] of Object.entries(params)) str = str.split(`{${k}}`).join(String(v))
    }
    return str
  }
}
