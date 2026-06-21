<script setup lang="ts">
/** Shared language switcher — used in the app header and on the auth screens. Prototype-only: CS is the default. */
withDefaults(defineProps<{ align?: 'start' | 'center' | 'end', variant?: 'header' | 'inline' }>(), {
  align: 'end',
  variant: 'header'
})

const lang = useLang()
const toast = useToast()
const t = useT()

function setLang(value: 'cs' | 'en') {
  lang.value = value
  toast.add({
    title: value === 'cs' ? 'Jazyk: Čeština' : 'Language: English',
    icon: 'i-lucide-languages',
    color: 'neutral'
  })
}

const langItems = computed(() => [
  [
    { label: 'Čeština', icon: 'i-lucide-check', type: 'checkbox' as const, checked: lang.value === 'cs', onUpdateChecked: () => setLang('cs') },
    { label: 'English', icon: 'i-lucide-check', type: 'checkbox' as const, checked: lang.value === 'en', onUpdateChecked: () => setLang('en') }
  ]
])

/** native language name shown on the inline (auth) trigger */
const nativeName = computed(() => (lang.value === 'cs' ? 'Česky' : 'English'))
</script>

<template>
  <UDropdownMenu :items="langItems" :content="{ align }" :ui="{ content: 'w-40' }">
    <!-- app header: icon + language code -->
    <UButton
      v-if="variant === 'header'"
      color="neutral"
      variant="ghost"
      icon="i-lucide-languages"
      :label="lang === 'cs' ? 'CS' : 'EN'"
      size="sm"
      :aria-label="t('nav.changeLanguage')"
    />
    <!-- auth screens: plain text language name + chevron, sized like the fine print -->
    <UButton
      v-else
      color="neutral"
      variant="link"
      :label="nativeName"
      trailing-icon="i-lucide-chevron-down"
      size="xs"
      :aria-label="t('nav.changeLanguage')"
      :ui="{ base: 'text-dimmed hover:text-default font-normal gap-1', trailingIcon: 'size-3.5' }"
    />
  </UDropdownMenu>
</template>
