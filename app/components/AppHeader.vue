<script setup lang="ts">
const accountItems = [
  [
    { label: 'Account settings', icon: 'i-lucide-settings-2', to: '/settings?tab=account' },
    { label: 'Payouts', icon: 'i-lucide-landmark', to: '/settings?tab=payouts' }
  ],
  [
    { label: 'Sign out', icon: 'i-lucide-log-out', color: 'error' as const, onSelect: () => navigateTo('/login') }
  ]
]
</script>

<template>
  <UHeader :toggle="false">
    <template #left>
      <NuxtLink to="/" class="flex items-center gap-2" aria-label="Tickitify — events">
        <UIcon name="i-lucide-ticket" class="size-6 text-primary" />
        <span class="text-base font-bold text-highlighted">Tickitify</span>
      </NuxtLink>
    </template>

    <template #right>
      <div class="flex items-center gap-1.5">
        <LangSwitcher />

        <UDropdownMenu :items="accountItems" :content="{ align: 'end' }" :ui="{ content: 'w-52' }">
        <UButton
          color="neutral"
          variant="ghost"
          :avatar="{ text: 'VF' }"
          label="Volleyball Federation"
          trailing-icon="i-lucide-chevron-down"
          class="hidden sm:inline-flex"
        />
        <UButton
          color="neutral"
          variant="ghost"
          :avatar="{ text: 'VF' }"
          trailing-icon="i-lucide-chevron-down"
          class="sm:hidden"
          aria-label="Account menu"
        />
        </UDropdownMenu>
      </div>
    </template>
  </UHeader>
</template>
