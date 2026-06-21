<script setup lang="ts">
import { CalendarDate, Time } from '@internationalized/date'
import type { SeatingSector, SeatStyle } from '~/components/SeatMapEditor.vue'

const t = useT()
useHead({ title: t('wizard.docTitle') })

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
  if (seats) parts.push(t('wizard.seatsLabel', { n: seats.toLocaleString('cs-CZ') }))
  if (standing) parts.push(t('wizard.standingLabel', { n: standing.toLocaleString('cs-CZ') }))
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
    return left === 0 ? t('wizard.railDone') : t('wizard.railLeft', { n: left.toLocaleString('cs-CZ') })
  }
  const cfg = form.standingConfig[s.id]
  return (cfg?.typeId && cfg.capacity) ? t('wizard.railCap', { n: cfg.capacity.toLocaleString('cs-CZ') }) : t('wizard.railSetCapacity')
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
    ? Array.from({ length: activeSeating.value.rows }, (_, i) => ({ label: t('wizard.rowLabel', { letter: String.fromCharCode(65 + i) }), value: i }))
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
  { ok: !!(form.title.trim() && form.venueId && form.startDate && form.endDate), label: t('wizard.checkEventDetails') },
  { ok: validTypes.value.length > 0, label: t('wizard.checkTicketTypes', { n: validTypes.value.length }) },
  { ok: seatedTotal.value + standingTotal.value > 0, label: t('wizard.checkInventory', { seats: seatedTotal.value.toLocaleString('cs-CZ'), standing: standingTotal.value.toLocaleString('cs-CZ') }) },
  { ok: kycVerified, label: t('wizard.checkPayout') }
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
  toast.add({ title: t('wizard.linkCopied'), icon: 'i-lucide-clipboard-check', color: 'success' })
}

/* ——— navigation ——— */
const steps = computed(() => [
  { title: t('wizard.stepDetails'), icon: 'i-lucide-file-text', disabled: maxVisited.value < 0 },
  { title: t('wizard.stepTicketTypes'), icon: 'i-lucide-tags', disabled: maxVisited.value < 1 },
  { title: t('wizard.stepSeatAssignment'), icon: 'i-lucide-armchair', disabled: maxVisited.value < 2 },
  { title: t('wizard.stepPublish'), icon: 'i-lucide-rocket', disabled: maxVisited.value < 3 }
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
    toast.add({ title: t('wizard.savedToDrafts'), icon: 'i-lucide-save', color: 'neutral' })
    navigateTo('/')
  } else if (step.value === 0) {
    discardOpen.value = true
  } else {
    toast.add({ title: t('wizard.savedToDrafts'), icon: 'i-lucide-save', color: 'neutral' })
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
  toast.add({ title: t('wizard.draftDeleted'), description: title ? t('wizard.draftDeletedDesc', { title }) : undefined, icon: 'i-lucide-trash-2', color: 'neutral' })
  navigateTo('/')
}

/* prefill the title so the organizer sees which draft they're resuming */
onMounted(() => {
  if (draftEvent.value) form.title = draftEvent.value.title
})
const goTo = (s: number) => { step.value = s }

const publish = () => {
  toast.add({ title: t('wizard.eventPublished'), description: t('wizard.eventPublishedDesc', { title: form.title }), icon: 'i-lucide-check-circle', color: 'success' })
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
        :headline="t('wizard.headline')"
        :title="draftSlug ? t('wizard.titleContinue') : t('wizard.titleCreate')"
        :description="draftSlug ? t('wizard.descContinue') : t('wizard.descCreate')"
        :ui="{ root: 'border-none py-8' }"
      >
        <template #links>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            square
            :aria-label="t('wizard.close')"
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
              <UFormField :label="t('wizard.eventTitle')" required :help="t('wizard.eventTitleHelp')">
                <UInput v-model="form.title" size="lg" :placeholder="t('wizard.eventTitlePlaceholder')" class="w-full" />
              </UFormField>

              <UFormField :label="t('wizard.description')">
                <UTextarea v-model="form.description" :rows="4" :placeholder="t('wizard.descriptionPlaceholder')" class="w-full" />
              </UFormField>

              <div class="grid sm:grid-cols-2 gap-6">
                <UFormField :label="t('wizard.starts')" required :help="t('wizard.startsHelp')">
                  <div class="flex gap-2">
                    <UInputDate v-model="form.startDate" locale="cs-CZ" class="flex-1" />
                    <UInputTime v-model="form.startTime" locale="cs-CZ" class="w-24" />
                  </div>
                </UFormField>
                <UFormField :label="t('wizard.ends')" required>
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
            :title="t('wizard.venue')"
            :description="t('wizard.venueDesc')"
          >
            <UFormField :label="t('wizard.venueQuestion')" required class="mt-2">
              <USelectMenu
                v-model="form.venueId"
                :items="venueItems"
                value-key="value"
                :placeholder="t('wizard.venuePlaceholder')"
                icon="i-lucide-search"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <div v-if="venue" class="flex items-start gap-3 mt-5 rounded-lg bg-elevated/50 p-3.5">
              <UIcon name="i-lucide-building-2" class="size-5 shrink-0 text-dimmed mt-0.5" />
              <div class="min-w-0">
                <p class="font-medium text-highlighted">{{ venue.name }}</p>
                <p class="text-sm text-muted mt-0.5">{{ venue.address }} · {{ t('wizard.capacity') }} {{ venueCapacity(venue).toLocaleString('cs-CZ') }}</p>
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
          :title="t('wizard.ticketTypesTitle')"
          :description="t('wizard.ticketTypesDesc')"
        >
          <!-- column headers -->
          <div class="hidden sm:flex items-center gap-3 mt-3 mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
            <span class="w-2.5" />
            <span class="flex-1">{{ t('wizard.colTicketType') }}</span>
            <span class="w-36">{{ t('wizard.colPrice') }}</span>
            <span class="w-36">{{ t('wizard.colAssigned') }}</span>
            <span class="w-8" />
          </div>

          <div class="flex flex-col divide-y divide-default">
            <div v-for="tt in form.types" :key="tt.id" class="flex flex-wrap sm:flex-nowrap items-center gap-3 py-3">
              <span class="size-2.5 rounded-full shrink-0" :class="typeStyles[tt.id]?.bg" />
              <UInput
                v-model="tt.name"
                :placeholder="t('wizard.namePlaceholder')"
                :color="rowIssue(tt) === 'name' ? 'error' : undefined"
                :highlight="rowIssue(tt) === 'name'"
                class="flex-1 min-w-36"
              />
              <UInputNumber
                v-model="tt.price"
                :min="0"
                :step="50"
                :format-options="{ maximumFractionDigits: 0 }"
                :placeholder="t('wizard.pricePlaceholder')"
                :color="rowIssue(tt) === 'price' ? 'error' : undefined"
                :highlight="rowIssue(tt) === 'price'"
                class="w-36"
              />
              <span class="w-36 text-sm tabular-nums" :class="assignedLabel(tt.id) ? 'text-default' : 'text-dimmed'">
                {{ assignedLabel(tt.id) ?? '—' }}
              </span>
              <UButton
                icon="i-lucide-trash-2"
                color="neutral"
                variant="ghost"
                size="sm"
                :disabled="form.types.length === 1"
                :aria-label="t('wizard.removeTicketType')"
                @click="removeType(tt.id)"
              />
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 mt-4">
            <UButton
              :label="t('wizard.addTicketType')"
              icon="i-lucide-plus"
              color="neutral"
              variant="subtle"
              @click="addType"
            />
            <p v-if="incompleteCount" class="flex items-center gap-1.5 text-sm text-warning">
              <UIcon name="i-lucide-alert-triangle" class="size-4 shrink-0" />
              {{ incompleteCount === 1 ? t('wizard.incompleteOne', { n: incompleteCount }) : t('wizard.incompleteMany', { n: incompleteCount }) }}
            </p>
          </div>
        </UPageCard>

        <UPageCard variant="outline" :title="t('wizard.pricingRules')" class="lg:sticky lg:top-24">
          <ul class="flex flex-col gap-4 mt-2">
            <li class="flex gap-2.5">
              <UIcon name="i-lucide-circle-plus" class="size-4.5 shrink-0 text-dimmed mt-0.5" />
              <div>
                <p class="text-sm font-medium text-highlighted">{{ t('wizard.currency') }}</p>
                <p class="text-sm text-muted">{{ t('wizard.currencyDesc') }}</p>
              </div>
            </li>
            <li class="flex gap-2.5">
              <UIcon name="i-lucide-circle-plus" class="size-4.5 shrink-0 text-dimmed mt-0.5" />
              <div>
                <p class="text-sm font-medium text-highlighted">{{ t('wizard.buyerFee') }}</p>
                <p class="text-sm text-muted">{{ t('wizard.buyerFeeDesc') }}</p>
              </div>
            </li>
            <li class="flex gap-2.5">
              <UIcon name="i-lucide-circle-plus" class="size-4.5 shrink-0 text-dimmed mt-0.5" />
              <div>
                <p class="text-sm font-medium text-highlighted">{{ t('wizard.commission') }}</p>
                <p class="text-sm text-muted">{{ t('wizard.commissionDesc') }}</p>
              </div>
            </li>
          </ul>

          <USeparator class="my-4" />

          <div v-if="validTypes.length" class="flex flex-col gap-2">
            <div
              v-for="tt in validTypes"
              :key="tt.id"
              class="flex items-center justify-between gap-3 rounded-md bg-elevated px-3 py-2 text-sm"
            >
              <span class="text-muted">{{ t('wizard.youKeepOn', { price: tt.price! }) }}</span>
              <span class="font-semibold text-highlighted tabular-nums">{{ netFor(tt.price!) }} CZK</span>
            </div>
          </div>
          <div v-else class="flex items-center justify-between gap-3 rounded-md bg-elevated px-3 py-2 text-sm">
            <span class="text-muted">{{ t('wizard.youKeepOn', { price: 400 }) }}</span>
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
          :title="activeStanding ? t('wizard.standingNoMapTitle') : t('wizard.unassignedHoldTitle')"
          :description="activeStanding
            ? t('wizard.standingNoMapDesc')
            : t('wizard.unassignedHoldDesc')"
        />

        <div class="grid lg:grid-cols-[220px_minmax(0,1fr)_300px] gap-5 items-start">
          <!-- sector rail -->
          <UPageCard variant="outline" :ui="{ container: 'p-2.5 sm:p-2.5' }">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-muted px-2 pt-1 pb-2">{{ t('wizard.sectors') }}</p>
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
                <span class="block text-xs mt-0.5" :class="railStatus({ id: sid }) === t('wizard.railDone') ? 'text-success' : 'text-muted'">
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
                  {{ sectorAssigned(activeSeating.id).toLocaleString('cs-CZ') }} {{ t('wizard.assignedSuffix') }} ·
                  {{ (activeSeating.rows * activeSeating.seats - sectorAssigned(activeSeating.id)).toLocaleString('cs-CZ') }} {{ t('wizard.unassignedSuffix') }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <UButton :label="t('wizard.selectUnassigned')" color="neutral" variant="outline" size="sm" @click="selectUnassigned(activeSeating)" />
                <UButton :label="t('wizard.selectAll')" color="neutral" variant="ghost" size="sm" @click="selectAll(activeSeating)" />
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
                <span class="size-4 rounded bg-elevated" /> {{ t('wizard.legendUnassigned') }}
              </span>
              <span v-for="tt in validTypes" :key="tt.id" class="flex items-center gap-1.5">
                <span
                  class="size-4 rounded flex items-center justify-center text-[9px] font-semibold"
                  :class="[typeStyles[tt.id]?.bg, typeStyles[tt.id]?.text]"
                >{{ typeStyles[tt.id]?.letter }}</span>
                {{ tt.name }}
              </span>
              <span class="flex items-center gap-1.5">
                <span class="size-4 rounded bg-elevated ring-2 ring-primary ring-offset-1 ring-offset-(--ui-bg)" /> {{ t('wizard.legendSelected') }}
              </span>
            </div>
          </UPageCard>

          <!-- standing sector: GA panel -->
          <UPageCard v-else-if="activeStanding" variant="outline" class="min-w-0">
            <div class="h-56 rounded-lg border-2 border-dashed border-accented bg-elevated/40 flex items-center justify-center mt-1">
              <p class="text-sm text-muted">{{ activeStanding.name }} · {{ t('wizard.generalAdmission') }}</p>
            </div>
            <p class="text-xs text-dimmed text-center mt-3">
              {{ t('wizard.standingNoSeatNumbers') }}
            </p>
          </UPageCard>

          <UPageCard v-else variant="subtle">
            <UEmpty icon="i-lucide-armchair" :title="t('wizard.noSectorSelected')" :description="t('wizard.noSectorSelectedDesc')" variant="naked" />
          </UPageCard>

          <!-- right panel: assignment / standing config -->
          <UPageCard v-if="activeSeating" variant="outline" :title="t('wizard.assignment')" class="lg:sticky lg:top-24">
            <div class="rounded-lg bg-elevated px-4 py-3.5 mt-2 flex items-baseline justify-between gap-2">
              <p>
                <span class="text-2xl font-semibold text-highlighted tabular-nums">{{ selCount }}</span>
                <span class="text-sm text-muted ml-1.5">{{ t('wizard.seatsSelected') }}</span>
              </p>
              <UButton
                v-if="selCount"
                :label="t('wizard.clear')"
                color="neutral"
                variant="link"
                size="xs"
                @click="clearSelection"
              />
            </div>

            <UFormField :label="t('wizard.assignTicketType')" class="mt-4">
              <USelect v-model="assignTypeId" :items="typeOptions" :placeholder="t('wizard.selectType')" class="w-full" />
            </UFormField>

            <UFormField :label="t('wizard.bulkSelect')" class="mt-3">
              <div class="flex gap-2">
                <USelect v-model="rangeFrom" :items="rowOptions" :placeholder="t('wizard.bulkFrom')" class="flex-1" />
                <USelect v-model="rangeTo" :items="rowOptions" :placeholder="t('wizard.bulkTo')" class="flex-1" />
                <UButton :label="t('wizard.add')" color="neutral" variant="outline" :disabled="rangeFrom === undefined || rangeTo === undefined" @click="addRange" />
              </div>
            </UFormField>

            <div class="flex flex-col gap-2 mt-5">
              <UButton
                :label="t('wizard.applyAssignment')"
                color="primary"
                block
                :disabled="!selCount || !assignTypeId"
                @click="applyAssignment"
              />
              <UButton
                :label="t('wizard.markUnassigned')"
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
              :description="t('wizard.unassignedUnavailable')"
              class="mt-4"
            />
          </UPageCard>

          <UPageCard v-else-if="activeStanding" variant="outline" :title="t('wizard.standingConfig')" class="lg:sticky lg:top-24">
            <UFormField :label="t('wizard.soldAsTicketType')" class="mt-3">
              <USelect
                :model-value="form.standingConfig[activeStanding.id]?.typeId || undefined"
                :items="typeOptions"
                :placeholder="t('wizard.selectType')"
                class="w-full"
                @update:model-value="(v: any) => form.standingConfig[activeStanding!.id] = { typeId: v, capacity: form.standingConfig[activeStanding!.id]?.capacity ?? null }"
              />
            </UFormField>

            <UFormField :label="t('wizard.sellableCapacity')" :help="t('wizard.sellableCapacityHelp')" class="mt-3">
              <UInputNumber
                :model-value="form.standingConfig[activeStanding.id]?.capacity ?? undefined"
                :min="1"
                :max="activeStanding.max"
                :step="50"
                :placeholder="t('wizard.sellableCapacityPlaceholder')"
                class="w-full"
                @update:model-value="(v: any) => form.standingConfig[activeStanding!.id] = { typeId: form.standingConfig[activeStanding!.id]?.typeId ?? '', capacity: v }"
              />
            </UFormField>

            <UFormField :label="t('wizard.venueMaxCapacity')" class="mt-3">
              <UInput :model-value="activeStanding.max.toLocaleString('cs-CZ')" disabled class="w-full" />
            </UFormField>

            <UAlert
              color="warning"
              variant="subtle"
              icon="i-lucide-info"
              :description="t('wizard.capacityExceedWarning')"
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
              <p class="font-semibold text-highlighted">{{ t('wizard.eventSection') }}</p>
              <UButton :label="t('wizard.edit')" color="primary" variant="link" size="sm" @click="goTo(0)" />
            </div>
            <div class="flex items-start gap-5 mt-4">
              <dl class="flex-1 flex flex-col gap-2.5 text-sm min-w-0">
                <div class="flex justify-between gap-4">
                  <dt class="text-muted">{{ t('wizard.sumTitle') }}</dt>
                  <dd class="font-medium text-highlighted text-right truncate">{{ form.title || '—' }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-muted">{{ t('wizard.sumOrganizer') }}</dt>
                  <dd class="font-medium text-highlighted text-right">Czech Volleyball Federation</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-muted">{{ t('wizard.sumSchedule') }}</dt>
                  <dd class="font-medium text-highlighted text-right tabular-nums">{{ scheduleLabel }}</dd>
                </div>
              </dl>
            </div>
          </UPageCard>

          <div class="grid sm:grid-cols-2 gap-6">
            <!-- venue summary -->
            <UPageCard variant="outline">
              <div class="flex items-center justify-between gap-3">
                <p class="font-semibold text-highlighted">{{ t('wizard.sumVenue') }}</p>
                <UButton :label="t('wizard.edit')" color="primary" variant="link" size="sm" @click="goTo(0)" />
              </div>
              <dl class="flex flex-col gap-2.5 text-sm mt-4">
                <div class="flex justify-between gap-4">
                  <dt class="text-muted">{{ t('wizard.sumVenue') }}</dt>
                  <dd class="font-medium text-highlighted text-right">{{ venue?.name ?? '—' }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-muted">{{ t('wizard.sumSectors') }}</dt>
                  <dd class="font-medium text-highlighted text-right">{{ selectedSeating.length }} {{ t('wizard.sumSeating') }} · {{ selectedStanding.length }} {{ t('wizard.sumStanding') }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-muted">{{ t('wizard.sumVenueCapacity') }}</dt>
                  <dd class="font-medium text-highlighted text-right tabular-nums">
                    {{ (seatedTotal + standingTotal).toLocaleString('cs-CZ') }}
                    <span class="text-muted font-normal">{{ t('wizard.seatsPlusStanding') }}</span>
                  </dd>
                </div>
              </dl>
            </UPageCard>

            <!-- ticket types summary -->
            <UPageCard variant="outline">
              <div class="flex items-center justify-between gap-3">
                <p class="font-semibold text-highlighted">{{ t('wizard.sumTicketTypes') }}</p>
                <UButton :label="t('wizard.edit')" color="primary" variant="link" size="sm" @click="goTo(1)" />
              </div>
              <ul class="flex flex-col gap-2.5 text-sm mt-4">
                <li v-for="tt in validTypes" :key="tt.id" class="flex items-center justify-between gap-4">
                  <span class="flex items-center gap-2 font-medium text-highlighted">
                    <span class="size-2 rounded-full" :class="typeStyles[tt.id]?.bg" />
                    {{ tt.name }}
                  </span>
                  <span class="text-muted tabular-nums">{{ tt.price }} CZK</span>
                </li>
              </ul>
            </UPageCard>
          </div>

          <!-- inventory -->
          <UPageCard variant="outline">
            <div class="flex items-center justify-between gap-3">
              <p class="font-semibold text-highlighted">{{ t('wizard.inventory') }}</p>
              <UButton :label="t('wizard.edit')" color="primary" variant="link" size="sm" @click="goTo(2)" />
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div class="rounded-lg ring ring-default p-4">
                <p class="text-2xl font-semibold text-highlighted tabular-nums">{{ seatedTotal.toLocaleString('cs-CZ') }}</p>
                <p class="text-xs text-muted mt-1">{{ t('wizard.assignedSeats') }}</p>
              </div>
              <div class="rounded-lg ring ring-default p-4">
                <p class="text-2xl font-semibold text-highlighted tabular-nums">{{ standingTotal.toLocaleString('cs-CZ') }}</p>
                <p class="text-xs text-muted mt-1">{{ t('wizard.standingCapacity') }}</p>
              </div>
              <div class="rounded-lg ring ring-default p-4">
                <p class="text-2xl font-semibold text-highlighted tabular-nums">{{ validTypes.length }}</p>
                <p class="text-xs text-muted mt-1">{{ t('wizard.ticketTypesStat') }}</p>
              </div>
              <div class="rounded-lg ring ring-default p-4">
                <p class="text-2xl font-semibold text-highlighted tabular-nums">{{ form.sectorsSelected.length }}</p>
                <p class="text-xs text-muted mt-1">{{ t('wizard.sectorsStat') }}</p>
              </div>
            </div>
          </UPageCard>
        </div>

        <!-- right rail -->
        <div class="flex flex-col gap-6 lg:sticky lg:top-24">
          <UPageCard variant="outline" :title="t('wizard.preflightChecklist')">
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

          <UPageCard variant="outline" :title="t('wizard.storefrontUrl')">
            <UFieldGroup class="w-full mt-2">
              <UInput :model-value="storefrontUrl" readonly class="flex-1" />
              <UButton icon="i-lucide-copy" color="neutral" variant="subtle" :aria-label="t('wizard.copyLink')" @click="copyUrl" />
            </UFieldGroup>
          </UPageCard>
        </div>
      </div>

      <!-- ════ footer nav ════ -->
      <div class="flex items-center justify-between mt-8">
        <div class="flex items-center gap-1">
          <UButton
            :label="step === 0 ? t('wizard.backToEvents') : t('wizard.back')"
            color="neutral"
            variant="ghost"
            @click="back"
          />
          <UTooltip v-if="draftSlug" :text="t('wizard.deleteDraft')">
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              square
              :aria-label="t('wizard.deleteDraft')"
              @click="deleteDraftOpen = true"
            />
          </UTooltip>
        </div>

        <div class="flex items-center gap-3">
          <template v-if="step < 3">
            <UButton
              :label="t('wizard.continue')"
              color="primary"
              :disabled="!stepValid"
              @click="next"
            />
          </template>
          <template v-else>
            <UButton
              :label="t('wizard.publishEvent')"
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
      :title="t('wizard.leaveTitle')"
      :description="t('wizard.leaveDesc')"
    >
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t('wizard.stay')" color="neutral" variant="ghost" @click="discardOpen = false" />
          <UButton :label="t('wizard.leave')" color="error" @click="leaveWizard" />
        </div>
      </template>
    </UModal>

    <!-- delete draft confirmation -->
    <UModal
      v-model:open="deleteDraftOpen"
      :title="t('wizard.deleteDraftTitle')"
      :description="draftEvent ? t('wizard.deleteDraftDescNamed', { title: draftEvent.title }) : t('wizard.deleteDraftDesc')"
    >
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t('wizard.cancel')" color="neutral" variant="ghost" @click="deleteDraftOpen = false" />
          <UButton :label="t('wizard.deleteDraftConfirm')" icon="i-lucide-trash-2" color="error" @click="confirmDeleteDraft" />
        </div>
      </template>
    </UModal>

    <!-- prototype-only: quick demo fill -->
    <div class="fixed bottom-5 right-5 z-50">
      <UButton
        :label="t('wizard.prefillDemo')"
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
