<script setup lang="ts">
useHead({ title: 'Account · Tickitify' })

const route = useRoute()

const tab = ref(route.query.tab === 'account' ? 'account' : 'payouts')
watch(() => route.query.tab, (q) => {
  if (q === 'account' || q === 'payouts') tab.value = q
})

const tabs = [
  { label: 'Payouts', value: 'payouts' },
  { label: 'Account settings', value: 'account' }
]
</script>

<template>
  <div class="min-h-screen bg-muted">
    <AppHeader />

    <UContainer class="max-w-4xl pb-24">
      <UBreadcrumb
        :items="[
          { label: 'Events', icon: 'i-lucide-ticket', to: '/' },
          { label: 'Account' }
        ]"
        class="pt-6"
      />

      <UPageHeader
        title="Account"
        description="Payouts, verification and organization settings — shared across all your events."
        :ui="{ root: 'border-none pt-4 pb-6' }"
      />

      <UTabs
        v-model="tab"
        :items="tabs"
        :content="false"
        color="primary"
        variant="link"
        class="mb-8"
      />

      <AccountPayouts v-if="tab === 'payouts'" />
      <AccountSettings v-else />
    </UContainer>
  </div>
</template>
