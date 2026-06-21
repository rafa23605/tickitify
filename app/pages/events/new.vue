<script setup lang="ts">
import { CalendarDate, Time } from '@internationalized/date'
import type { SeatingSector, SeatStyle } from '~/components/SeatMapEditor.vue'

useHead({ title: 'Create event · Tickitify' })

const toast = useToast()
const route = useRoute()

/* ——— draft context: a draft row opens the wizard to resume / delete it ——— */
const adminEvents = useAdminEvents()
const draftSlug = computed(() => (route.query.draft ? String(route.query.draft) : null))
const draftEvent = computed(() => (draftSlug.value ? adminEvents.value.find(e => e.slug === draftSlug.value) : null))

/* ——— ops-seeded venue master data: halls across Czechia (organizers never create venues) ——— */
interface StandingSector { id: string, name: string, max: number }
interface Venue {
  id: string
  name: string
  city: string
  address: string
  photo: string | null
  seating: SeatingSector[]
  standing: StandingSector[]
}

const photo = (seed: string) => `https://picsum.photos/seed/${seed}/640/360`

const venues: Venue[] = [
  { id: 'o2-arena', name: 'O2 Arena', city: 'Praha', address: 'Českomoravská 2345/17, Praha 9', photo: photo('o2arena'), seating: [{ id: 'o2-low-a', name: 'Lower Bowl A', rows: 10, seats: 18, pos: 'west' }, { id: 'o2-low-b', name: 'Lower Bowl B', rows: 10, seats: 18, pos: 'east' }, { id: 'o2-north', name: 'North Stand', rows: 8, seats: 18, pos: 'north' }, { id: 'o2-south', name: 'South Stand', rows: 8, seats: 18, pos: 'south' }, { id: 'o2-upper', name: 'Upper Ring', rows: 10, seats: 20, pos: 'balcony' }], standing: [{ id: 'o2-floor', name: 'Floor', max: 2000 }] },
  { id: 'o2-universum', name: 'O2 universum', city: 'Praha', address: 'Českomoravská 2345/17a, Praha 9', photo: photo('universum'), seating: [{ id: 'un-main', name: 'Main Hall', rows: 12, seats: 16 }], standing: [{ id: 'un-floor', name: 'Floor', max: 1000 }] },
  { id: 'fortuna', name: 'Fortuna Arena', city: 'Praha', address: 'U Slavie 1540/2a, Praha 10', photo: photo('fortuna'), seating: [{ id: 'fo-north', name: 'North Stand', rows: 12, seats: 20, pos: 'north' }, { id: 'fo-south', name: 'South Stand', rows: 12, seats: 20, pos: 'south' }, { id: 'fo-east', name: 'East Tribune', rows: 10, seats: 18, pos: 'east' }, { id: 'fo-west', name: 'West Tribune', rows: 10, seats: 18, pos: 'west' }], standing: [] },
  { id: 'kralovka', name: 'Královka Arena', city: 'Praha', address: 'Nad Královskou oborou 51, Praha 7', photo: photo('kralovka'), seating: [{ id: 'kr-a', name: 'Court Side A', rows: 8, seats: 14, pos: 'west' }, { id: 'kr-b', name: 'Court Side B', rows: 8, seats: 14, pos: 'east' }, { id: 'kr-south', name: 'South Stand', rows: 6, seats: 14, pos: 'south' }, { id: 'kr-balc', name: 'Balcony', rows: 6, seats: 12, pos: 'balcony' }], standing: [{ id: 'kr-floor', name: 'Standing Floor', max: 640 }, { id: 'kr-north', name: 'Fan Zone North', max: 400 }] },
  { id: 'tipsport-praha', name: 'Tipsport Arena', city: 'Praha', address: 'Za Elektrárnou 419/1, Praha 7', photo: photo('tipsport'), seating: [{ id: 'ti-a', name: 'Sector A', rows: 10, seats: 16 }, { id: 'ti-b', name: 'Sector B', rows: 10, seats: 16 }], standing: [{ id: 'ti-floor', name: 'Floor', max: 900 }] },
  { id: 'smichov', name: 'Sportovní hala Smíchov', city: 'Praha', address: 'Strakonická 510, Praha 5', photo: null, seating: [{ id: 'sm-main', name: 'Main Stand', rows: 6, seats: 12 }], standing: [{ id: 'sm-floor', name: 'Floor', max: 350 }] },
  { id: 'ostravar', name: 'Ostravar Aréna', city: 'Ostrava', address: 'Ruská 3077/135, Ostrava-Zábřeh', photo: photo('ostravar'), seating: [{ id: 'os-a', name: 'Sector A', rows: 10, seats: 16 }, { id: 'os-b', name: 'Sector B', rows: 10, seats: 16 }], standing: [{ id: 'os-pit', name: 'Standing Pit', max: 1200 }] },
  { id: 'rt-torax', name: 'RT TORAX Arena', city: 'Ostrava', address: 'Hrušovská 2953/15, Ostrava', photo: photo('torax'), seating: [{ id: 'rt-main', name: 'Main Stand', rows: 8, seats: 14 }], standing: [{ id: 'rt-floor', name: 'Floor', max: 600 }] },
  { id: 'winning', name: 'Winning Group Arena', city: 'Brno', address: 'Křídlovická 911/34, Brno', photo: photo('winning'), seating: [{ id: 'wg-a', name: 'Sector A', rows: 10, seats: 16 }, { id: 'wg-b', name: 'Sector B', rows: 10, seats: 16 }], standing: [{ id: 'wg-floor', name: 'Floor', max: 1000 }] },
  { id: 'vodova', name: 'Hala Vodova', city: 'Brno', address: 'Vodova 336/108, Brno', photo: photo('vodova'), seating: [{ id: 'vo-main', name: 'Main Stand', rows: 7, seats: 12 }], standing: [{ id: 'vo-floor', name: 'Floor', max: 500 }] },
  { id: 'home-credit', name: 'Home Credit Arena', city: 'Liberec', address: 'Jeronýmova 570/22, Liberec', photo: photo('liberec'), seating: [{ id: 'hc-a', name: 'Sector A', rows: 10, seats: 15 }], standing: [{ id: 'hc-floor', name: 'Floor', max: 800 }] },
  { id: 'enteria', name: 'Enteria Arena', city: 'Pardubice', address: 'Sukova třída 1735, Pardubice', photo: photo('enteria'), seating: [{ id: 'en-main', name: 'Main Stand', rows: 9, seats: 14 }], standing: [{ id: 'en-floor', name: 'Floor', max: 700 }] },
  { id: 'budvar', name: 'Budvar Aréna', city: 'České Budějovice', address: 'F. A. Gerstnera 7/8, Č. Budějovice', photo: photo('budvar'), seating: [{ id: 'bu-main', name: 'Main Stand', rows: 8, seats: 13 }], standing: [{ id: 'bu-floor', name: 'Floor', max: 550 }] },
  { id: 'kv-arena', name: 'KV Arena', city: 'Karlovy Vary', address: 'Západní 1812/73, Karlovy Vary', photo: photo('kvarena'), seating: [{ id: 'kv-a', name: 'Sector A', rows: 9, seats: 14 }], standing: [{ id: 'kv-floor', name: 'Floor', max: 650 }] },
  { id: 'werk', name: 'Werk Arena', city: 'Třinec', address: 'Frýdecká 850, Třinec', photo: photo('werk'), seating: [{ id: 'we-main', name: 'Main Stand', rows: 9, seats: 14 }], standing: [{ id: 'we-floor', name: 'Floor', max: 600 }] },
  { id: 'lokomotiva', name: 'Hala Lokomotiva', city: 'Plzeň', address: 'Úslavská 75, Plzeň', photo: null, seating: [{ id: 'lo-main', name: 'Main Stand', rows: 6, seats: 11 }], standing: [{ id: 'lo-floor', name: 'Floor', max: 300 }] }
]

const venueItems = venues.map(v => ({ label: `${v.name} · ${v.city}`, value: v.id }))
const venueCapacity = (v: Venue) =>
  v.seating.reduce((s, x) => s + x.rows * x.seats, 0) + v.standing.reduce((s, x) => s + x.max, 0)

/* ——— wizard state ——— */
interface TicketType { id: string, name: string, price: number | null }

const step = ref(0)
const maxVisited = ref(0)

const form = reactive({
  title: '',
  description: '',
  startDate: null as any,
  startTime: null as any,
  endDate: null as any,
  endTime: null as any,
  venueId: '',
  sectorsSelected: [] as string[],
  types: [{ id: 't1', name: '', price: null }] as TicketType[],
  /** seatKey -> typeId */
  seatAssignments: {} as Record<string, string>,
  /** standingSectorId -> config */
  standingConfig: {} as Record<string, { typeId: string, capacity: number | null }>
})

const venue = computed(() => venues.find(v => v.id === form.venueId))
const selectedSeating = computed(() => venue.value?.seating.filter(s => form.sectorsSelected.includes(s.id)) ?? [])
const selectedStanding = computed(() => venue.value?.standing.filter(s => form.sectorsSelected.includes(s.id)) ?? [])

/* every sector of the chosen venue is available by default — availability is
   controlled later by assigning ticket types on Seat Assignment */
watch(() => form.venueId, () => {
  const v = venues.find(x => x.id === form.venueId)
  form.sectorsSelected = v ? [...v.seating, ...v.standing].map(s => s.id) : []
  form.seatAssignments = {}
  form.standingConfig = {}
})

/* ——— ticket types ——— */
let typeSeq = 1
const addType = () => {
  while (form.types.some(t => t.id === `t${typeSeq + 1}`)) typeSeq++
  form.types.push({ id: `t${++typeSeq}`, name: '', price: null })
}
const removeType = (id: string) => {
  form.types = form.types.filter(t => t.id !== id)
  for (const key of Object.keys(form.seatAssignments)) {
    if (form.seatAssignments[key] === id) delete form.seatAssignments[key]
  }
  for (const cfg of Object.values(form.standingConfig)) {
    if (cfg.typeId === id) cfg.typeId = ''
  }
}

const validTypes = computed(() => form.types.filter(t => t.name.trim() && t.price && t.price > 0))
const typeOptions = computed(() => validTypes.value.map(t => ({ label: `${t.name} · ${t.price} CZK`, value: t.id })))

/** which field keeps a row from being complete */
const rowIssue = (t: TicketType): 'name' | 'price' | 'empty' | null => {
  const hasName = !!t.name.trim()
  const hasPrice = !!t.price && t.price > 0
  if (hasName && hasPrice) return null
  if (!hasName && !hasPrice) return 'empty'
  return hasName ? 'price' : 'name'
}
const incompleteCount = computed(() => form.types.filter(t => rowIssue(t)).length)

const SEAT_PALETTE = [
  { bg: 'bg-indigo-500', text: 'text-white' },
  { bg: 'bg-amber-400', text: 'text-amber-950' },
  { bg: 'bg-teal-500', text: 'text-white' },
  { bg: 'bg-rose-500', text: 'text-white' },
  { bg: 'bg-sky-500', text: 'text-white' }
]
const typeStyles = computed<Record<string, SeatStyle>>(() =>
  Object.fromEntries(form.types.map((t, i) => [t.id, {
    ...SEAT_PALETTE[i % SEAT_PALETTE.length]!,
    letter: (t.name.trim()[0] ?? '?').toUpperCase()
  }]))
)

const seatedCount = (typeId: string) =>
  Object.values(form.seatAssignments).filter(id => id === typeId).length

const standingCapByType = (typeId: string) =>
  selectedStanding.value.reduce((s, z) => {
    const cfg = form.standingConfig[z.id]
    return s + ((cfg?.typeId === typeId && cfg.capacity) ? cfg.capacity : 0)
  }, 0)

const assignedLabel = (typeId: string) => {
  const seats = seatedCount(typeId)
  const standing = standingCapByType(typeId)
  if (!seats && !standing) return null
  const parts = []
  if (seats) parts.push(`${seats.toLocaleString('cs-CZ')} seats`)
  if (standing) parts.push(`${standing.toLocaleString('cs-CZ')} standing`)
  return parts.join(' · ')
}

const netFor = (price: number) => Math.round(price * 0.93)

/* ——— step 4: select-then-apply ——— */
const activeSectorId = ref('')
const selectedSeats = reactive<Record<string, true>>({})
const assignTypeId = ref<string | undefined>(undefined)
const rangeFrom = ref<number | undefined>(undefined)
const rangeTo = ref<number | undefined>(undefined)

const clearSelection = () => {
  for (const k of Object.keys(selectedSeats)) delete selectedSeats[k]
}

watch(step, (s) => {
  if (s === 2) {
    if (!form.sectorsSelected.includes(activeSectorId.value)) {
      activeSectorId.value = form.sectorsSelected[0] ?? ''
    }
    assignTypeId.value = validTypes.value[0]?.id
  }
})
watch(activeSectorId, () => {
  clearSelection()
  rangeFrom.value = undefined
  rangeTo.value = undefined
})

const activeSeating = computed(() => selectedSeating.value.find(s => s.id === activeSectorId.value))
const activeStanding = computed(() => selectedStanding.value.find(s => s.id === activeSectorId.value))

const selCount = computed(() => Object.keys(selectedSeats).length)

const sectorAssigned = (sectorId: string) =>
  Object.keys(form.seatAssignments).filter(k => k.startsWith(sectorId + ':')).length

const railStatus = (s: { id: string }) => {
  const seating = venue.value?.seating.find(x => x.id === s.id)
  if (seating) {
    const left = seating.rows * seating.seats - sectorAssigned(s.id)
    return left === 0 ? 'done ✓' : `${left.toLocaleString('cs-CZ')} left`
  }
  const cfg = form.standingConfig[s.id]
  return (cfg?.typeId && cfg.capacity) ? `${cfg.capacity.toLocaleString('cs-CZ')} cap` : 'set capacity'
}

const toggleSeat = (key: string) => {
  if (selectedSeats[key]) delete selectedSeats[key]
  else selectedSeats[key] = true
}

const toggleRow = (sector: SeatingSector, rowIndex: number) => {
  const keys = Array.from({ length: sector.seats }, (_, s) => `${sector.id}:${rowIndex}:${s}`)
  const allSelected = keys.every(k => selectedSeats[k])
  for (const k of keys) {
    if (allSelected) delete selectedSeats[k]
    else selectedSeats[k] = true
  }
}

const selectUnassigned = (sector: SeatingSector) => {
  for (let r = 0; r < sector.rows; r++) {
    for (let s = 0; s < sector.seats; s++) {
      const key = `${sector.id}:${r}:${s}`
      if (!form.seatAssignments[key]) selectedSeats[key] = true
    }
  }
}

const selectAll = (sector: SeatingSector) => {
  for (let r = 0; r < sector.rows; r++) {
    for (let s = 0; s < sector.seats; s++) {
      selectedSeats[`${sector.id}:${r}:${s}`] = true
    }
  }
}

const rowOptions = computed(() =>
  activeSeating.value
    ? Array.from({ length: activeSeating.value.rows }, (_, i) => ({ label: `Row ${String.fromCharCode(65 + i)}`, value: i }))
    : []
)

const addRange = () => {
  const sector = activeSeating.value
  if (!sector || rangeFrom.value === undefined || rangeTo.value === undefined) return
  const [a, b] = [Math.min(rangeFrom.value, rangeTo.value), Math.max(rangeFrom.value, rangeTo.value)]
  for (let r = a; r <= b; r++) {
    for (let s = 0; s < sector.seats; s++) selectedSeats[`${sector.id}:${r}:${s}`] = true
  }
}

const applyAssignment = () => {
  if (!assignTypeId.value) return
  for (const key of Object.keys(selectedSeats)) {
    form.seatAssignments[key] = assignTypeId.value
  }
  clearSelection()
}

const markUnassigned = () => {
  for (const key of Object.keys(selectedSeats)) {
    delete form.seatAssignments[key]
  }
  clearSelection()
}

/* ——— totals & validation ——— */
const seatedTotal = computed(() => Object.keys(form.seatAssignments).length)
const standingTotal = computed(() =>
  selectedStanding.value.reduce((s, z) => {
    const cfg = form.standingConfig[z.id]
    return s + ((cfg?.typeId && cfg.capacity) ? cfg.capacity : 0)
  }, 0)
)

const stepValid = computed(() => {
  switch (step.value) {
    case 0: return !!(form.title.trim() && form.venueId && form.startDate && form.startTime && form.endDate && form.endTime)
    case 1: return validTypes.value.length > 0 && incompleteCount.value === 0
    case 2: {
      // an untouched standing zone is a private hold (skipped); once an organizer
      // starts configuring one (sets a type or a capacity) it must be fully valid
      const standingOk = selectedStanding.value.every((z) => {
        const cfg = form.standingConfig[z.id]
        if (!cfg || (!cfg.typeId && !cfg.capacity)) return true
        return !!cfg.typeId && !!cfg.capacity && cfg.capacity > 0 && cfg.capacity <= z.max
      })
      return standingOk && (seatedTotal.value + standingTotal.value > 0)
    }
    default: return true
  }
})

const kycVerified = true // mock: Stripe Connect onboarding completed

const preflight = computed(() => [
  { ok: !!(form.title.trim() && form.venueId && form.startDate && form.endDate), label: 'Event details complete' },
  { ok: validTypes.value.length > 0, label: `At least one ticket type (${validTypes.value.length} defined)` },
  { ok: seatedTotal.value + standingTotal.value > 0, label: `Seats or standing capacity assigned (${seatedTotal.value.toLocaleString('cs-CZ')} · ${standingTotal.value.toLocaleString('cs-CZ')})` },
  { ok: kycVerified, label: 'Organizer payout verification complete' }
])

const canPublish = computed(() => preflight.value.every(c => c.ok))

/* ——— labels ——— */
const WEEKDAYS_CS = ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so']
const fmtTime = (t: any) => t ? `${String(t.hour).padStart(2, '0')}:${String(t.minute).padStart(2, '0')}` : ''
const dateLabel = computed(() => {
  const d = form.startDate
  if (!d) return ''
  const wd = WEEKDAYS_CS[new Date(d.year, d.month - 1, d.day).getDay()]
  return `${wd} ${d.day}. ${d.month}. ${d.year}${form.startTime ? ` · ${fmtTime(form.startTime)}` : ''}`
})
const scheduleLabel = computed(() => {
  const d = form.startDate
  if (!d) return '—'
  let s = `${d.day}. ${d.month}. ${d.year} · ${fmtTime(form.startTime) || '—'}`
  if (form.endTime) s += `–${fmtTime(form.endTime)}`
  return s
})
const minPrice = computed(() => {
  const prices = validTypes.value.map(t => t.price ?? 0).filter(p => p > 0)
  return prices.length ? Math.min(...prices) : null
})

const slug = computed(() =>
  form.title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'your-event'
)
const storefrontUrl = computed(() => `ticketify.cz/cvf/${slug.value}`)
const copyUrl = async () => {
  await navigator.clipboard.writeText(`https://${storefrontUrl.value}`)
  toast.add({ title: 'Link copied', icon: 'i-lucide-clipboard-check', color: 'success' })
}

/* ——— navigation ——— */
const steps = computed(() => [
  { title: 'Details', icon: 'i-lucide-file-text', disabled: maxVisited.value < 0 },
  { title: 'Ticket Types', icon: 'i-lucide-tags', disabled: maxVisited.value < 1 },
  { title: 'Seat Assignment', icon: 'i-lucide-armchair', disabled: maxVisited.value < 2 },
  { title: 'Publish', icon: 'i-lucide-rocket', disabled: maxVisited.value < 3 }
])

const next = () => {
  if (step.value < 3) {
    step.value++
    maxVisited.value = Math.max(maxVisited.value, step.value)
  }
}

/* ——— leaving the wizard ——— */
const discardOpen = ref(false)
const leaveWizard = () => {
  discardOpen.value = false
  navigateTo('/')
}
/* on step 1 nothing is saved yet → confirm discard;
   step 2+ (or an existing draft) is already saved → leave with a toast */
const requestClose = () => {
  if (draftSlug.value) {
    toast.add({ title: 'Saved to drafts', icon: 'i-lucide-save', color: 'neutral' })
    navigateTo('/')
  } else if (step.value === 0) {
    discardOpen.value = true
  } else {
    toast.add({ title: 'Saved to drafts', icon: 'i-lucide-save', color: 'neutral' })
    navigateTo('/')
  }
}
const back = () => {
  if (step.value > 0) step.value--
  else if (draftSlug.value) navigateTo('/')
  else discardOpen.value = true
}

const deleteDraftOpen = ref(false)
const confirmDeleteDraft = () => {
  if (!draftSlug.value) return
  const title = draftEvent.value?.title
  adminEvents.value = adminEvents.value.filter(e => e.slug !== draftSlug.value)
  deleteDraftOpen.value = false
  toast.add({ title: 'Draft deleted', description: title ? `"${title}" was removed.` : undefined, icon: 'i-lucide-trash-2', color: 'neutral' })
  navigateTo('/')
}

/* prefill the title so the organizer sees which draft they're resuming */
onMounted(() => {
  if (draftEvent.value) form.title = draftEvent.value.title
})
const goTo = (s: number) => { step.value = s }

const publish = () => {
  toast.add({ title: 'Event published', description: `${form.title} is now live on your storefront.`, icon: 'i-lucide-check-circle', color: 'success' })
  navigateTo('/')
}

/* ——— prototype-only: prefill demo data ——— */
const prefill = () => {
  form.title = 'Czech Volleyball Cup 2026'
  form.description = 'National cup finals weekend. Doors open one hour before the first serve.'
  form.startDate = new CalendarDate(2026, 9, 12)
  form.startTime = new Time(18, 0)
  form.endDate = new CalendarDate(2026, 9, 12)
  form.endTime = new Time(21, 30)
  form.venueId = 'kralovka'
  nextTick(() => {
    form.types = [
      { id: 't1', name: 'VIP', price: 800 },
      { id: 't2', name: 'Standard', price: 400 },
      { id: 't3', name: 'Student', price: 250 },
      { id: 't4', name: 'Child', price: 150 }
    ]
    const v = venues.find(x => x.id === 'kralovka')!
    const assignments: Record<string, string> = {}
    const paint = (sectorId: string, rows: number, seats: number, pick: (r: number) => string | null) => {
      for (let r = 0; r < rows; r++) {
        const t = pick(r)
        if (!t) continue
        for (let s = 0; s < seats; s++) assignments[`${sectorId}:${r}:${s}`] = t
      }
    }
    const [a, b, south, balc] = v.seating
    paint(a!.id, a!.rows, a!.seats, r => (r < 2 ? 't1' : r < 6 ? 't2' : 't3'))
    paint(b!.id, b!.rows, b!.seats, r => (r < 5 ? 't2' : 't3'))
    paint(south!.id, south!.rows, south!.seats, r => (r < 3 ? 't3' : 't4'))
    paint(balc!.id, balc!.rows, balc!.seats, r => (r < 4 ? 't3' : 't4'))
    form.seatAssignments = assignments
    form.standingConfig = { 'kr-floor': { typeId: 't2', capacity: 600 } }
    activeSectorId.value = 'kr-a'
    assignTypeId.value = 't1'
    maxVisited.value = 4
  })
}
</script>

<template>
  <div class="min-h-screen bg-muted">
    <AppHeader />

    <UContainer class="max-w-6xl pb-24">
      <UPageHeader
        headline="Events"
        :title="draftSlug ? 'Continue setup' : 'Create event'"
        :description="draftSlug ? 'Finish setting up your draft — it stays saved until you publish.' : 'Set up a new ticketed event for your storefront.'"
        :ui="{ root: 'border-none py-8' }"
      >
        <template #links>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            square
            aria-label="Close"
            @click="requestClose"
          />
        </template>
      </UPageHeader>

      <UStepper v-model="step" :items="steps" size="sm" class="w-full mb-8" />

      <!-- ════ Step 1 · Details ════ -->
      <div v-if="step === 0" class="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
        <div class="flex flex-col gap-6 min-w-0">
          <UPageCard variant="outline">
            <div class="flex flex-col gap-6">
              <UFormField label="Event title" required help="Shown on the storefront and on tickets.">
                <UInput v-model="form.title" size="lg" placeholder="Czech Volleyball Cup 2026" class="w-full" />
              </UFormField>

              <UFormField label="Description">
                <UTextarea v-model="form.description" :rows="4" placeholder="What should buyers know about this event?" class="w-full" />
              </UFormField>

              <div class="grid sm:grid-cols-2 gap-6">
                <UFormField label="Starts" required help="Dates are locked after publishing.">
                  <div class="flex gap-2">
                    <UInputDate v-model="form.startDate" locale="cs-CZ" class="flex-1" />
                    <UInputTime v-model="form.startTime" locale="cs-CZ" class="w-24" />
                  </div>
                </UFormField>
                <UFormField label="Ends" required>
                  <div class="flex gap-2">
                    <UInputDate v-model="form.endDate" locale="cs-CZ" class="flex-1" />
                    <UInputTime v-model="form.endTime" locale="cs-CZ" class="w-24" />
                  </div>
                </UFormField>
              </div>
            </div>
          </UPageCard>

          <UPageCard
            variant="outline"
            title="Venue"
            description="Halls across Czechia, seat layouts managed by the Tickitify team."
          >
            <UFormField label="Where does the event take place?" required class="mt-2">
              <USelectMenu
                v-model="form.venueId"
                :items="venueItems"
                value-key="value"
                placeholder="Search venues — O2 Arena, Vodova, Werk…"
                icon="i-lucide-search"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <div v-if="venue" class="flex items-start gap-3 mt-5 rounded-lg bg-elevated/50 p-3.5">
              <UIcon name="i-lucide-building-2" class="size-5 shrink-0 text-dimmed mt-0.5" />
              <div class="min-w-0">
                <p class="font-medium text-highlighted">{{ venue.name }}</p>
                <p class="text-sm text-muted mt-0.5">{{ venue.address }} · capacity {{ venueCapacity(venue).toLocaleString('cs-CZ') }}</p>
              </div>
            </div>
          </UPageCard>
        </div>

        <EventPreviewCard
          class="lg:sticky lg:top-24"
          :title="form.title"
          :description="form.description"
          :date-label="dateLabel"
          :venue-label="venue ? `${venue.name} · ${venue.city}` : ''"
          :min-price="minPrice"
        />
      </div>

      <!-- ════ Step 2 · Ticket Types ════ -->
      <div v-else-if="step === 1" class="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
        <UPageCard
          variant="outline"
          title="Ticket types"
          description="Define the price tiers buyers can choose from. Names can't be changed after the event is created."
        >
          <!-- column headers -->
          <div class="hidden sm:flex items-center gap-3 mt-3 mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
            <span class="w-2.5" />
            <span class="flex-1">Ticket type</span>
            <span class="w-36">Price</span>
            <span class="w-36">Assigned</span>
            <span class="w-8" />
          </div>

          <div class="flex flex-col divide-y divide-default">
            <div v-for="t in form.types" :key="t.id" class="flex flex-wrap sm:flex-nowrap items-center gap-3 py-3">
              <span class="size-2.5 rounded-full shrink-0" :class="typeStyles[t.id]?.bg" />
              <UInput
                v-model="t.name"
                placeholder="VIP, Standard, Student…"
                :color="rowIssue(t) === 'name' ? 'error' : undefined"
                :highlight="rowIssue(t) === 'name'"
                class="flex-1 min-w-36"
              />
              <UInputNumber
                v-model="t.price"
                :min="0"
                :step="50"
                :format-options="{ maximumFractionDigits: 0 }"
                placeholder="400"
                :color="rowIssue(t) === 'price' ? 'error' : undefined"
                :highlight="rowIssue(t) === 'price'"
                class="w-36"
              />
              <span class="w-36 text-sm tabular-nums" :class="assignedLabel(t.id) ? 'text-default' : 'text-dimmed'">
                {{ assignedLabel(t.id) ?? '—' }}
              </span>
              <UButton
                icon="i-lucide-trash-2"
                color="neutral"
                variant="ghost"
                size="sm"
                :disabled="form.types.length === 1"
                aria-label="Remove ticket type"
                @click="removeType(t.id)"
              />
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 mt-4">
            <UButton
              label="Add ticket type"
              icon="i-lucide-plus"
              color="neutral"
              variant="subtle"
              @click="addType"
            />
            <p v-if="incompleteCount" class="flex items-center gap-1.5 text-sm text-warning">
              <UIcon name="i-lucide-alert-triangle" class="size-4 shrink-0" />
              {{ incompleteCount }} {{ incompleteCount === 1 ? 'type needs' : 'types need' }} a name and a price above 0 — complete or remove to continue
            </p>
          </div>
        </UPageCard>

        <UPageCard variant="outline" title="Pricing rules" class="lg:sticky lg:top-24">
          <ul class="flex flex-col gap-4 mt-2">
            <li class="flex gap-2.5">
              <UIcon name="i-lucide-circle-plus" class="size-4.5 shrink-0 text-dimmed mt-0.5" />
              <div>
                <p class="text-sm font-medium text-highlighted">Currency</p>
                <p class="text-sm text-muted">All tiers are priced in CZK.</p>
              </div>
            </li>
            <li class="flex gap-2.5">
              <UIcon name="i-lucide-circle-plus" class="size-4.5 shrink-0 text-dimmed mt-0.5" />
              <div>
                <p class="text-sm font-medium text-highlighted">Buyer service fee</p>
                <p class="text-sm text-muted">A service fee is added at checkout — buyers see the final price before paying.</p>
              </div>
            </li>
            <li class="flex gap-2.5">
              <UIcon name="i-lucide-circle-plus" class="size-4.5 shrink-0 text-dimmed mt-0.5" />
              <div>
                <p class="text-sm font-medium text-highlighted">Platform commission</p>
                <p class="text-sm text-muted">7% is deducted from your payout on every sold ticket.</p>
              </div>
            </li>
          </ul>

          <USeparator class="my-4" />

          <div v-if="validTypes.length" class="flex flex-col gap-2">
            <div
              v-for="t in validTypes"
              :key="t.id"
              class="flex items-center justify-between gap-3 rounded-md bg-elevated px-3 py-2 text-sm"
            >
              <span class="text-muted">You keep on a {{ t.price }} CZK ticket</span>
              <span class="font-semibold text-highlighted tabular-nums">{{ netFor(t.price!) }} CZK</span>
            </div>
          </div>
          <div v-else class="flex items-center justify-between gap-3 rounded-md bg-elevated px-3 py-2 text-sm">
            <span class="text-muted">You keep on a 400 CZK ticket</span>
            <span class="font-semibold text-highlighted tabular-nums">372 CZK</span>
          </div>
        </UPageCard>
      </div>

      <!-- ════ Step 3 · Seat Assignment ════ -->
      <div v-else-if="step === 2" class="flex flex-col gap-5">
        <UAlert
          color="info"
          variant="subtle"
          icon="i-lucide-info"
          :title="activeStanding ? 'Standing sectors don\'t use a seat map' : 'Unassigned seats are your private hold'"
          :description="activeStanding
            ? 'Set a sellable capacity and the ticket type sold for entry.'
            : 'Seats without a ticket type don\'t appear on your storefront — a simple way to hold seats for press, sponsors or guests. Assign a type when you\'re ready to sell them.'"
        />

        <div class="grid lg:grid-cols-[220px_minmax(0,1fr)_300px] gap-5 items-start">
          <!-- sector rail -->
          <UPageCard variant="outline" :ui="{ container: 'p-2.5 sm:p-2.5' }">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-muted px-2 pt-1 pb-2">Sectors</p>
            <div class="flex flex-col gap-1">
              <button
                v-for="sid in form.sectorsSelected"
                :key="sid"
                type="button"
                class="rounded-md px-3 py-2.5 text-left transition"
                :class="activeSectorId === sid ? 'bg-elevated ring ring-accented' : 'hover:bg-elevated/60'"
                @click="activeSectorId = sid"
              >
                <span class="block text-sm font-medium text-highlighted">
                  {{ [...(venue?.seating ?? []), ...(venue?.standing ?? [])].find(x => x.id === sid)?.name }}
                </span>
                <span class="block text-xs mt-0.5" :class="railStatus({ id: sid }).includes('done') ? 'text-success' : 'text-muted'">
                  {{ railStatus({ id: sid }) }}
                </span>
              </button>
            </div>
          </UPageCard>

          <!-- seating sector: map -->
          <UPageCard v-if="activeSeating" variant="outline" class="min-w-0">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p class="font-semibold text-highlighted">{{ activeSeating.name }}</p>
                <p class="text-xs text-muted mt-0.5 tabular-nums">
                  {{ sectorAssigned(activeSeating.id).toLocaleString('cs-CZ') }} assigned ·
                  {{ (activeSeating.rows * activeSeating.seats - sectorAssigned(activeSeating.id)).toLocaleString('cs-CZ') }} unassigned
                </p>
              </div>
              <div class="flex items-center gap-2">
                <UButton label="Select unassigned" color="neutral" variant="outline" size="sm" @click="selectUnassigned(activeSeating)" />
                <UButton label="Select all" color="neutral" variant="ghost" size="sm" @click="selectAll(activeSeating)" />
              </div>
            </div>

            <SeatMapEditor
              :sector="activeSeating"
              :assignments="form.seatAssignments"
              :styles="typeStyles"
              :selected="selectedSeats"
              @toggle-seat="toggleSeat"
              @toggle-row="r => toggleRow(activeSeating!, r)"
            />

            <USeparator class="my-4" />

            <!-- legend -->
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
              <span class="flex items-center gap-1.5">
                <span class="size-4 rounded bg-elevated" /> Unassigned
              </span>
              <span v-for="t in validTypes" :key="t.id" class="flex items-center gap-1.5">
                <span
                  class="size-4 rounded flex items-center justify-center text-[9px] font-semibold"
                  :class="[typeStyles[t.id]?.bg, typeStyles[t.id]?.text]"
                >{{ typeStyles[t.id]?.letter }}</span>
                {{ t.name }}
              </span>
              <span class="flex items-center gap-1.5">
                <span class="size-4 rounded bg-elevated ring-2 ring-primary ring-offset-1 ring-offset-(--ui-bg)" /> Selected
              </span>
            </div>
          </UPageCard>

          <!-- standing sector: GA panel -->
          <UPageCard v-else-if="activeStanding" variant="outline" class="min-w-0">
            <div class="h-56 rounded-lg border-2 border-dashed border-accented bg-elevated/40 flex items-center justify-center mt-1">
              <p class="text-sm text-muted">{{ activeStanding.name }} · general admission</p>
            </div>
            <p class="text-xs text-dimmed text-center mt-3">
              No seat numbers are issued. Buyers are admitted first-come up to the capacity you set.
            </p>
          </UPageCard>

          <UPageCard v-else variant="subtle">
            <UEmpty icon="i-lucide-armchair" title="No sector selected" description="Pick a sector on the left." variant="naked" />
          </UPageCard>

          <!-- right panel: assignment / standing config -->
          <UPageCard v-if="activeSeating" variant="outline" title="Assignment" class="lg:sticky lg:top-24">
            <div class="rounded-lg bg-elevated px-4 py-3.5 mt-2 flex items-baseline justify-between gap-2">
              <p>
                <span class="text-2xl font-semibold text-highlighted tabular-nums">{{ selCount }}</span>
                <span class="text-sm text-muted ml-1.5">seats selected</span>
              </p>
              <UButton
                v-if="selCount"
                label="Clear"
                color="neutral"
                variant="link"
                size="xs"
                @click="clearSelection"
              />
            </div>

            <UFormField label="Assign ticket type" class="mt-4">
              <USelect v-model="assignTypeId" :items="typeOptions" placeholder="Select type" class="w-full" />
            </UFormField>

            <UFormField label="Bulk select" class="mt-3">
              <div class="flex gap-2">
                <USelect v-model="rangeFrom" :items="rowOptions" placeholder="From" class="flex-1" />
                <USelect v-model="rangeTo" :items="rowOptions" placeholder="To" class="flex-1" />
                <UButton label="Add" color="neutral" variant="outline" :disabled="rangeFrom === undefined || rangeTo === undefined" @click="addRange" />
              </div>
            </UFormField>

            <div class="flex flex-col gap-2 mt-5">
              <UButton
                label="Apply assignment"
                color="primary"
                block
                :disabled="!selCount || !assignTypeId"
                @click="applyAssignment"
              />
              <UButton
                label="Mark unassigned"
                color="neutral"
                variant="outline"
                block
                :disabled="!selCount"
                @click="markUnassigned"
              />
            </div>

            <UAlert
              color="warning"
              variant="subtle"
              icon="i-lucide-eye-off"
              description="Unassigned seats are unavailable on the storefront."
              class="mt-4"
            />
          </UPageCard>

          <UPageCard v-else-if="activeStanding" variant="outline" title="Standing config" class="lg:sticky lg:top-24">
            <UFormField label="Sold as ticket type" class="mt-3">
              <USelect
                :model-value="form.standingConfig[activeStanding.id]?.typeId || undefined"
                :items="typeOptions"
                placeholder="Select type"
                class="w-full"
                @update:model-value="(v: any) => form.standingConfig[activeStanding!.id] = { typeId: v, capacity: form.standingConfig[activeStanding!.id]?.capacity ?? null }"
              />
            </UFormField>

            <UFormField label="Sellable capacity" help="Total tickets sold for this zone." class="mt-3">
              <UInputNumber
                :model-value="form.standingConfig[activeStanding.id]?.capacity ?? undefined"
                :min="1"
                :max="activeStanding.max"
                :step="50"
                placeholder="600"
                class="w-full"
                @update:model-value="(v: any) => form.standingConfig[activeStanding!.id] = { typeId: form.standingConfig[activeStanding!.id]?.typeId ?? '', capacity: v }"
              />
            </UFormField>

            <UFormField label="Venue max capacity" class="mt-3">
              <UInput :model-value="activeStanding.max.toLocaleString('cs-CZ')" disabled class="w-full" />
            </UFormField>

            <UAlert
              color="warning"
              variant="subtle"
              icon="i-lucide-info"
              description="Sellable capacity cannot exceed the venue's certified max for this sector."
              class="mt-4"
            />
          </UPageCard>
          <span v-else />
        </div>
      </div>

      <!-- ════ Step 4 · Publish ════ -->
      <div v-else class="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
        <div class="flex flex-col gap-6 min-w-0">
          <!-- event summary -->
          <UPageCard variant="outline">
            <div class="flex items-center justify-between gap-3">
              <p class="font-semibold text-highlighted">Event</p>
              <UButton label="Edit" color="primary" variant="link" size="sm" @click="goTo(0)" />
            </div>
            <div class="flex items-start gap-5 mt-4">
              <dl class="flex-1 flex flex-col gap-2.5 text-sm min-w-0">
                <div class="flex justify-between gap-4">
                  <dt class="text-muted">Title</dt>
                  <dd class="font-medium text-highlighted text-right truncate">{{ form.title || '—' }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-muted">Organizer</dt>
                  <dd class="font-medium text-highlighted text-right">Czech Volleyball Federation</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-muted">Schedule</dt>
                  <dd class="font-medium text-highlighted text-right tabular-nums">{{ scheduleLabel }}</dd>
                </div>
              </dl>
            </div>
          </UPageCard>

          <div class="grid sm:grid-cols-2 gap-6">
            <!-- venue summary -->
            <UPageCard variant="outline">
              <div class="flex items-center justify-between gap-3">
                <p class="font-semibold text-highlighted">Venue</p>
                <UButton label="Edit" color="primary" variant="link" size="sm" @click="goTo(0)" />
              </div>
              <dl class="flex flex-col gap-2.5 text-sm mt-4">
                <div class="flex justify-between gap-4">
                  <dt class="text-muted">Venue</dt>
                  <dd class="font-medium text-highlighted text-right">{{ venue?.name ?? '—' }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-muted">Sectors</dt>
                  <dd class="font-medium text-highlighted text-right">{{ selectedSeating.length }} seating · {{ selectedStanding.length }} standing</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-muted">Venue capacity</dt>
                  <dd class="font-medium text-highlighted text-right tabular-nums">
                    {{ (seatedTotal + standingTotal).toLocaleString('cs-CZ') }}
                    <span class="text-muted font-normal">· seats + standing</span>
                  </dd>
                </div>
              </dl>
            </UPageCard>

            <!-- ticket types summary -->
            <UPageCard variant="outline">
              <div class="flex items-center justify-between gap-3">
                <p class="font-semibold text-highlighted">Ticket types</p>
                <UButton label="Edit" color="primary" variant="link" size="sm" @click="goTo(1)" />
              </div>
              <ul class="flex flex-col gap-2.5 text-sm mt-4">
                <li v-for="t in validTypes" :key="t.id" class="flex items-center justify-between gap-4">
                  <span class="flex items-center gap-2 font-medium text-highlighted">
                    <span class="size-2 rounded-full" :class="typeStyles[t.id]?.bg" />
                    {{ t.name }}
                  </span>
                  <span class="text-muted tabular-nums">{{ t.price }} CZK</span>
                </li>
              </ul>
            </UPageCard>
          </div>

          <!-- inventory -->
          <UPageCard variant="outline">
            <div class="flex items-center justify-between gap-3">
              <p class="font-semibold text-highlighted">Inventory</p>
              <UButton label="Edit" color="primary" variant="link" size="sm" @click="goTo(2)" />
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div class="rounded-lg ring ring-default p-4">
                <p class="text-2xl font-semibold text-highlighted tabular-nums">{{ seatedTotal.toLocaleString('cs-CZ') }}</p>
                <p class="text-xs text-muted mt-1">Assigned seats</p>
              </div>
              <div class="rounded-lg ring ring-default p-4">
                <p class="text-2xl font-semibold text-highlighted tabular-nums">{{ standingTotal.toLocaleString('cs-CZ') }}</p>
                <p class="text-xs text-muted mt-1">Standing capacity</p>
              </div>
              <div class="rounded-lg ring ring-default p-4">
                <p class="text-2xl font-semibold text-highlighted tabular-nums">{{ validTypes.length }}</p>
                <p class="text-xs text-muted mt-1">Ticket types</p>
              </div>
              <div class="rounded-lg ring ring-default p-4">
                <p class="text-2xl font-semibold text-highlighted tabular-nums">{{ form.sectorsSelected.length }}</p>
                <p class="text-xs text-muted mt-1">Sectors</p>
              </div>
            </div>
          </UPageCard>
        </div>

        <!-- right rail -->
        <div class="flex flex-col gap-6 lg:sticky lg:top-24">
          <UPageCard variant="outline" title="Preflight checklist">
            <ul class="flex flex-col gap-3 mt-2">
              <li v-for="c in preflight" :key="c.label" class="flex items-center gap-2.5 text-sm">
                <UIcon
                  :name="c.ok ? 'i-lucide-check-circle-2' : 'i-lucide-x-circle'"
                  :class="c.ok ? 'text-success' : 'text-error'"
                  class="size-4.5 shrink-0"
                />
                <span :class="c.ok ? 'text-default' : 'text-error'">{{ c.label }}</span>
              </li>
            </ul>
          </UPageCard>

          <UPageCard variant="outline" title="Storefront URL">
            <UFieldGroup class="w-full mt-2">
              <UInput :model-value="storefrontUrl" readonly class="flex-1" />
              <UButton icon="i-lucide-copy" color="neutral" variant="subtle" aria-label="Copy link" @click="copyUrl" />
            </UFieldGroup>
          </UPageCard>
        </div>
      </div>

      <!-- ════ footer nav ════ -->
      <div class="flex items-center justify-between mt-8">
        <div class="flex items-center gap-1">
          <UButton
            :label="step === 0 ? 'Back to events' : 'Back'"
            color="neutral"
            variant="ghost"
            @click="back"
          />
          <UTooltip v-if="draftSlug" text="Delete draft">
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              square
              aria-label="Delete draft"
              @click="deleteDraftOpen = true"
            />
          </UTooltip>
        </div>

        <div class="flex items-center gap-3">
          <template v-if="step < 3">
            <UButton
              label="Continue"
              color="primary"
              :disabled="!stepValid"
              @click="next"
            />
          </template>
          <template v-else>
            <UButton
              label="Publish event"
              icon="i-lucide-rocket"
              color="primary"
              :disabled="!canPublish"
              @click="publish"
            />
          </template>
        </div>
      </div>
    </UContainer>

    <!-- discard confirmation (step 1 — nothing saved as a draft yet) -->
    <UModal
      v-model:open="discardOpen"
      title="Leave without saving?"
      description="You're on the first step — this event hasn't been saved as a draft yet. Your changes will be lost."
    >
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton label="Stay" color="neutral" variant="ghost" @click="discardOpen = false" />
          <UButton label="Leave" color="error" @click="leaveWizard" />
        </div>
      </template>
    </UModal>

    <!-- delete draft confirmation -->
    <UModal
      v-model:open="deleteDraftOpen"
      title="Delete this draft?"
      :description="draftEvent ? `“${draftEvent.title}” will be removed for good. This can't be undone.` : `This draft will be removed for good. This can't be undone.`"
    >
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton label="Cancel" color="neutral" variant="ghost" @click="deleteDraftOpen = false" />
          <UButton label="Delete draft" icon="i-lucide-trash-2" color="error" @click="confirmDeleteDraft" />
        </div>
      </template>
    </UModal>

    <!-- prototype-only: quick demo fill -->
    <div class="fixed bottom-5 right-5 z-50">
      <UButton
        label="Prefill demo data"
        icon="i-lucide-wand-2"
        color="neutral"
        variant="solid"
        size="sm"
        class="shadow-lg"
        @click="prefill"
      />
    </div>
  </div>
</template>
