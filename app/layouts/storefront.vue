<script setup lang="ts">
/** B2C storefront layout — platform-branded (Tickitify), mobile-first. No admin chrome. */
import logoUrl from '~/assets/logo.svg'

const org = computed(() => String(useRoute().params.org || 'cvf'))
const t = useT()
</script>

<template>
  <div class="min-h-screen bg-muted">
    <header class="sticky top-0 z-40 bg-default/90 backdrop-blur border-b border-default">
      <div class="mx-auto max-w-md px-4 h-14 flex items-center gap-1.5">
        <NuxtLink :to="`/s/${org}`" aria-label="Tickitify" class="shrink-0">
          <img :src="logoUrl" alt="Tickitify" class="h-[18px] w-auto">
        </NuxtLink>
        <span class="flex-1" />
        <LangSwitcher />
        <UButton :to="`/s/${org}/login`" color="neutral" variant="ghost" icon="i-lucide-circle-user-round" size="sm" square :aria-label="t('store.account')" />
        <UButton to="/" color="neutral" variant="ghost" icon="i-lucide-layout-dashboard" size="xs" label="Admin" aria-label="Admin" />
      </div>
    </header>

    <main class="mx-auto max-w-md bg-default min-h-screen">
      <slot />
    </main>
  </div>
</template>
