<script setup lang="ts">
useHead({ title: 'Events · Tickitify' })

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
  { label: 'All', value: 'all', badge: counts.value.all },
  { label: 'Published', value: 'published', badge: counts.value.published },
  { label: 'Drafts', value: 'drafts', badge: counts.value.drafts },
  { label: 'Completed', value: 'completed', badge: counts.value.completed },
  { label: 'Cancelled', value: 'cancelled', badge: counts.value.cancelled }
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

const emptyActions = [
  { label: 'Create your first event', icon: 'i-lucide-plus', size: 'lg' as const, to: '/events/new' }
]

const wizardSteps = [
  { title: 'Details', description: 'Title, dates and cover', icon: 'i-lucide-file-text' },
  { title: 'Venue', description: 'Hall, seating and standing sectors', icon: 'i-lucide-building-2' },
  { title: 'Ticket types', description: 'Price tiers — VIP, Standard', icon: 'i-lucide-tags' },
  { title: 'Seats', description: 'Assign types on the seat map', icon: 'i-lucide-armchair' },
  { title: 'Publish', description: 'Preflight check, go live', icon: 'i-lucide-rocket' }
]
</script>

<template>
  <div class="min-h-screen bg-muted">
    <AppHeader />

    <UContainer class="max-w-4xl pb-24">
      <!-- ════ STATE A · active season ════ -->
      <main v-if="demoState === 'season'">
        <UPageHeader
          headline="Czech Volleyball Federation"
          title="Events"
          description="This week: 2 events"
          :links="[{ label: 'New event', icon: 'i-lucide-plus', color: 'primary', variant: 'solid', to: '/events/new' }]"
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
          headline="Czech Volleyball Federation"
          title="Events"
          :ui="{ root: 'border-none py-8' }"
        />

        <UPageCard variant="outline" :ui="{ container: 'py-12' }">
          <UEmpty
            icon="i-lucide-calendar-plus"
            title="No events yet"
            description="Create your first event, assign seats and prices, and publish when you're ready — buyers get a clean mobile checkout from minute one."
            size="lg"
            :actions="emptyActions"
          />
        </UPageCard>

        <UPageCard
          variant="subtle"
          title="From draft to on-sale in five steps"
          description="You can save a draft at any point and come back later."
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
            Publishing requires payout setup —
            <ULink to="/settings" class="text-primary">connect Stripe</ULink>
            anytime before going live.
          </p>
        </UPageCard>
      </main>
    </UContainer>

    <!-- prototype state switcher (not part of the design) -->
    <div class="fixed bottom-5 right-5 z-50">
      <UFieldGroup size="sm" class="shadow-lg">
        <UButton
          label="First login"
          color="neutral"
          :variant="demoState === 'empty' ? 'solid' : 'outline'"
          @click="demoState = 'empty'"
        />
        <UButton
          label="Active season"
          color="neutral"
          :variant="demoState === 'season' ? 'solid' : 'outline'"
          @click="demoState = 'season'"
        />
      </UFieldGroup>
    </div>
  </div>
</template>
