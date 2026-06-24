<script setup lang="ts">
import { cs, en } from '@nuxt/ui/locale'

/** drive Nuxt UI's built-in component strings (stepper, tables, etc.) from the same switch */
const lang = useLang()
const locale = computed(() => (lang.value === 'cs' ? cs : en))
</script>

<template>
  <UApp :locale="locale">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
