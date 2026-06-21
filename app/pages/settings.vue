<script setup lang="ts">
const t = useT()

useHead({ title: () => `${t('settings.docTitle')} · Tickitify` })

const route = useRoute()

const tab = ref(route.query.tab === 'account' ? 'account' : 'payouts')
watch(() => route.query.tab, (q) => {
  if (q === 'account' || q === 'payouts') tab.value = q
})

const tabs = computed(() => [
  { label: t('settings.tabPayouts'), value: 'payouts' },
  { label: t('settings.tabAccount'), value: 'account' }
])
</script>

<template>
  <div class="min-h-screen bg-muted">
    <AppHeader />

    <UContainer class="max-w-4xl pb-24">
      <UBreadcrumb
        :items="[
          { label: t('settings.breadcrumbEvents'), icon: 'i-lucide-ticket', to: '/' },
          { label: t('settings.breadcrumbAccount') }
        ]"
        class="pt-6"
      />

      <UPageHeader
        :title="t('settings.headerTitle')"
        :description="t('settings.headerDescription')"
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
