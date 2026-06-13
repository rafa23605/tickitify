<script setup lang="ts">
import type { AdminEvent } from '~/components/EventRow.vue'

useHead({ title: 'Events · Tickitify' })

/** Prototype-only switch between the two screen states */
const demoState = ref<'season' | 'empty'>('season')

const events: AdminEvent[] = [
  {
    slug: 'vnl-cze-pol',
    title: 'CZE × POL — VNL Qualifier',
    venue: 'Královka Arena',
    city: 'Praha',
    day: '20',
    month: 'Jun',
    weekday: 'Sat',
    time: '19:00',
    status: 'published',
    sold: 1284,
    capacity: 3200,
    revenue: '391 080 Kč'
  },
  {
    slug: 'cup-final-four',
    title: 'Czech Cup — Final Four',
    venue: 'Ostravar Aréna',
    city: 'Ostrava',
    day: '27',
    month: 'Jun',
    weekday: 'Sat',
    time: '17:30',
    status: 'published',
    sold: 4800,
    capacity: 4800,
    revenue: '1 824 000 Kč'
  },
  {
    slug: 'u20-championship',
    title: 'U20 Youth Championship',
    venue: 'Hala Vodova',
    city: 'Brno',
    day: '12',
    month: 'Jul',
    weekday: 'Sun',
    time: '14:00',
    status: 'draft',
    note: 'Updated 2 days ago'
  },
  {
    slug: 'beach-open-smichov',
    title: 'Beach Volleyball Open',
    venue: 'Smíchovská pláž',
    city: 'Praha',
    day: '01',
    month: 'Aug',
    weekday: 'Sat',
    time: '10:00',
    status: 'draft',
    note: 'Updated 5 days ago'
  },
  {
    slug: 'cze-svk-friendly',
    title: 'CZE × SVK — Friendly',
    venue: 'Královka Arena',
    city: 'Praha',
    day: '15',
    month: 'May',
    weekday: 'Fri',
    time: '18:00',
    status: 'completed',
    sold: 2911,
    capacity: 3000,
    revenue: '873 300 Kč',
    note: 'Paid out 19 May'
  },
  {
    slug: 'legends-night',
    title: 'Legends Night — Exhibition',
    venue: 'Tipsport Arena',
    city: 'Praha',
    day: '05',
    month: 'Jun',
    weekday: 'Fri',
    time: '20:00',
    status: 'cancelled',
    note: '118 tickets refunded'
  }
]

const tab = ref('all')

const counts = computed(() => ({
  all: events.length,
  onsale: events.filter(e => e.status === 'published').length,
  drafts: events.filter(e => e.status === 'draft').length,
  finished: events.filter(e => e.status === 'completed' || e.status === 'cancelled').length
}))

const tabItems = computed(() => [
  { label: 'All', value: 'all', badge: counts.value.all },
  { label: 'On sale', value: 'onsale', badge: counts.value.onsale },
  { label: 'Drafts', value: 'drafts', badge: counts.value.drafts },
  { label: 'Finished', value: 'finished', badge: counts.value.finished }
])

const visible = computed(() => {
  switch (tab.value) {
    case 'onsale': return events.filter(e => e.status === 'published')
    case 'drafts': return events.filter(e => e.status === 'draft')
    case 'finished': return events.filter(e => e.status === 'completed' || e.status === 'cancelled')
    default: return events
  }
})

const emptyActions = [
  { label: 'Create your first event', icon: 'i-lucide-plus', size: 'lg' as const, to: '/events/new' },
  { label: 'Set up payouts', icon: 'i-lucide-landmark', size: 'lg' as const, color: 'neutral' as const, variant: 'subtle' as const, to: '/settings' }
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
          description="This week: 1 284 tickets · 391 080 Kč · pending payout 2 024 583 Kč, first unlock 22 Jun · next event in 9 days"
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
