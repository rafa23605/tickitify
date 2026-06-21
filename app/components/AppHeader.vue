<script setup lang="ts">
const toast = useToast()

/** Prototype-only language switcher — CS is the default */
const lang = ref<'cs' | 'en'>('cs')

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
        <UDropdownMenu :items="langItems" :content="{ align: 'end' }" :ui="{ content: 'w-40' }">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-languages"
            :label="lang === 'cs' ? 'CS' : 'EN'"
            size="sm"
            aria-label="Change language"
          />
        </UDropdownMenu>

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
