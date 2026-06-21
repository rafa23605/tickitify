<template>
  <div class="min-h-screen bg-muted flex flex-col items-center justify-center px-6 py-12">
    <NuxtLink to="/login" class="flex items-center gap-2 mb-7" aria-label="Tickitify">
      <UIcon name="i-lucide-ticket" class="size-7 text-primary" />
      <span class="text-lg font-bold text-highlighted">Tickitify</span>
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
