<script setup lang="ts">
/** B2C storefront layout — federation-branded, mobile-first. No admin chrome. */
const org = computed(() => String(useRoute().params.org || 'cvf'))
</script>

<template>
  <div class="min-h-screen bg-muted">
    <header class="sticky top-0 z-40 bg-default/90 backdrop-blur border-b border-default">
      <div class="mx-auto max-w-md px-4 h-14 flex items-center gap-2.5">
        <UAvatar text="VF" size="sm" />
        <span class="text-sm font-semibold text-highlighted truncate">Český volejbalový svaz</span>
        <span class="flex-1" />
        <UButton :to="`/s/${org}/login`" color="neutral" variant="ghost" icon="i-lucide-circle-user-round" size="sm" square aria-label="Můj účet" />
        <UButton to="/" color="neutral" variant="ghost" icon="i-lucide-layout-dashboard" size="xs" label="Admin" aria-label="Přepnout do administrace" />
      </div>
    </header>

    <main class="mx-auto max-w-md bg-default min-h-screen">
      <slot />
    </main>
  </div>
</template>
