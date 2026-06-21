<script setup lang="ts">
const t = useT()
useHead({ title: () => `${t('events.title')} · Tickitify` })

/** Prototype-only switch between the two screen states */
const demoState = ref<'season' | 'empty'>('season')

const events = useAdminEvents()

const tab = ref('all')

const counts = computed(() => ({
  all: events.value.length,
  published: events.value.filter(e => e.status === 'published').length,
  drafts: events.value.filter(e => e.status === 'draft').length,
  completed: events.value.filter(e => e.status === 'completed').length,
  cancelled: events.value.filter(e => e.status === 'cancelled').length
}))

const tabItems = computed(() => [
  { label: t('events.tabs.all'), value: 'all', badge: counts.value.all },
  { label: t('events.tabs.published'), value: 'published', badge: counts.value.published },
  { label: t('events.tabs.drafts'), value: 'drafts', badge: counts.value.drafts },
  { label: t('events.tabs.completed'), value: 'completed', badge: counts.value.completed },
  { label: t('events.tabs.cancelled'), value: 'cancelled', badge: counts.value.cancelled }
])

const visible = computed(() => {
  switch (tab.value) {
    case 'published': return events.value.filter(e => e.status === 'published')
    case 'drafts': return events.value.filter(e => e.status === 'draft')
    case 'completed': return events.value.filter(e => e.status === 'completed')
    case 'cancelled': return events.value.filter(e => e.status === 'cancelled')
    default: return events.value
  }
})

const emptyActions = computed(() => [
  { label: t('events.createFirst'), icon: 'i-lucide-plus', size: 'lg' as const, to: '/events/new' }
])

const wizardSteps = computed(() => [
  { title: t('events.steps.detailsT'), description: t('events.steps.detailsD'), icon: 'i-lucide-file-text' },
  { title: t('events.steps.typesT'), description: t('events.steps.typesD'), icon: 'i-lucide-tags' },
  { title: t('events.steps.seatsT'), description: t('events.steps.seatsD'), icon: 'i-lucide-armchair' },
  { title: t('events.steps.publishT'), description: t('events.steps.publishD'), icon: 'i-lucide-rocket' }
])
</script>

<template>
  <div class="min-h-screen bg-muted">
    <AppHeader />

    <UContainer class="max-w-4xl pb-24">
      <!-- ════ STATE A · active season ════ -->
      <main v-if="demoState === 'season'">
        <UPageHeader
          :headline="t('common.federation')"
          :title="t('events.title')"
          :description="t('events.thisWeek', { n: 2 })"
          :links="[{ label: t('events.newEvent'), icon: 'i-lucide-plus', color: 'primary', variant: 'solid', to: '/events/new' }]"
          :ui="{ root: 'border-none py-8' }"
        />

        <UTabs
          v-model="tab"
          :items="tabItems"
          :content="false"
          color="primary"
          variant="link"
          class="mb-6"
        />

        <section class="flex flex-col gap-3" aria-label="Your events">
          <EventRow v-for="ev in visible" :key="ev.slug" :event="ev" />
        </section>
      </main>

      <!-- ════ STATE B · first login, no events ════ -->
      <main v-else>
        <UPageHeader
          :headline="t('common.federation')"
          :title="t('events.title')"
          :ui="{ root: 'border-none py-8' }"
        />

        <UPageCard variant="outline" :ui="{ container: 'py-12' }">
          <UEmpty
            icon="i-lucide-calendar-plus"
            :title="t('events.emptyTitle')"
            :description="t('events.emptyDesc')"
            size="lg"
            :actions="emptyActions"
          />
        </UPageCard>

        <UPageCard
          variant="subtle"
          :title="t('events.stepsTitle')"
          :description="t('events.stepsDesc')"
          class="mt-6"
        >
          <UStepper
            :items="wizardSteps"
            disabled
            color="neutral"
            size="sm"
            class="w-full mt-2"
          />

          <USeparator class="mt-6 mb-4" />
          <p class="text-xs text-muted">
            {{ t('events.payoutNotePre') }}
            <ULink to="/settings" class="text-primary">{{ t('events.connectStripe') }}</ULink>
            {{ t('events.payoutNotePost') }}
          </p>
        </UPageCard>
      </main>
    </UContainer>

    <!-- prototype state switcher (not part of the design) -->
    <div class="fixed bottom-5 right-5 z-50">
      <UFieldGroup size="sm" class="shadow-lg">
        <UButton
          :label="t('events.demoFirst')"
          color="neutral"
          :variant="demoState === 'empty' ? 'solid' : 'outline'"
          @click="demoState = 'empty'"
        />
        <UButton
          :label="t('events.demoActive')"
          color="neutral"
          :variant="demoState === 'season' ? 'solid' : 'outline'"
          @click="demoState = 'season'"
        />
      </UFieldGroup>
    </div>
  </div>
</template>
