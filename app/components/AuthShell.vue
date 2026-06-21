<script setup lang="ts">
import logoUrl from '~/assets/logo.svg'
</script>

<template>
  <div class="min-h-screen bg-muted flex flex-col items-center justify-center px-6 py-12">
    <NuxtLink to="/login" class="flex items-center mb-7" aria-label="Tickitify">
      <img :src="logoUrl" alt="Tickitify" class="h-6 w-auto">
    </NuxtLink>

    <UPageCard variant="outline" class="w-full max-w-md bg-default">
      <slot />
    </UPageCard>

    <div class="text-xs text-dimmed mt-7 text-center max-w-sm leading-relaxed">
      <slot name="foot" />
    </div>

    <LangSwitcher variant="inline" align="center" class="mt-3" />
  </div>
</template>
