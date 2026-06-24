<script setup lang="ts">
import logoUrl from '~/assets/logo.svg'

const t = useT()

const accountItems = computed(() => [
  [
    { label: t('nav.accountSettings'), icon: 'i-lucide-settings-2', to: '/settings?tab=account' },
    { label: t('nav.payouts'), icon: 'i-lucide-landmark', to: '/settings?tab=payouts' }
  ],
  [
    { label: t('nav.signOut'), icon: 'i-lucide-log-out', color: 'error' as const, onSelect: () => navigateTo('/login') }
  ]
])
</script>

<template>
  <UHeader :toggle="false">
    <template #left>
      <NuxtLink to="/" class="flex items-center" aria-label="Tickitify — events">
        <img :src="logoUrl" alt="Tickitify" class="h-[18px] w-auto">
      </NuxtLink>
    </template>

    <template #right>
      <div class="flex items-center gap-1.5">
        <UButton
          to="/s/cvf/vnl-cze-pol"
          color="neutral"
          variant="subtle"
          icon="i-lucide-store"
          label="Obchod"
          size="sm"
        />
        <LangSwitcher />

        <UDropdownMenu :items="accountItems" :content="{ align: 'end' }" :ui="{ content: 'w-52' }">
        <UButton
          color="neutral"
          variant="ghost"
          :avatar="{ text: 'VF' }"
          :label="t('common.orgShort')"
          trailing-icon="i-lucide-chevron-down"
          class="hidden sm:inline-flex"
        />
        <UButton
          color="neutral"
          variant="ghost"
          :avatar="{ text: 'VF' }"
          trailing-icon="i-lucide-chevron-down"
          class="sm:hidden"
          :aria-label="t('nav.accountMenu')"
        />
        </UDropdownMenu>
      </div>
    </template>
  </UHeader>
</template>
