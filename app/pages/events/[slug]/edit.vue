<script setup lang="ts">
import type { SeatStyle, SeatLock } from '~/components/SeatMapEditor.vue'
import { fmtN, EVENTS_META } from '~/utils/campaignAnalytics'
import { LIVE_TYPES, EDIT_SECTORS, existingAssignments, isSold, STANDING_ZONE } from '~/utils/eventConfig'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const meta = computed(() =>
  EVENTS_META[slug.value] ?? { title: slug.value, venue: '—', when: '—', status: 'published' as const }
)

useHead({ title: () => `Edit · ${meta.value.title} · Tickitify` })

const toast = useToast()

/* ——— ticket types: existing names locked, prices editable; new types fully editable ——— */
interface EditType {
  id: string
  name: string
  price: number | null
  locked: boolean
  assignedLabel?: string
}

const originalPrices: Record<string, number> = Object.fromEntries(LIVE_TYPES.map(t => [t.id, t.price]))
const types = ref<EditType[]>([
  ...LIVE_TYPES.map(t => ({ ...t, locked: true } as EditType))
])

let typeSeq = 0
const addType = () => {
  while (types.value.some(t => t.id === `new-${typeSeq + 1}`)) typeSeq++
  types.value.push({ id: `new-${++typeSeq}`, name: '', price: null, locked: false })
}
const removeType = (id: string) => {
  types.value = types.value.filter(t => t.id !== id)
  for (const k of Object.keys(added)) {
    if (added[k] === id) delete added[k]
  }
  if (assignTypeId.value === id) assignTypeId.value = validTypes.value[0]?.id
}

const rowIssue = (t: EditType): 'name' | 'price' | 'empty' | null => {
  if (t.locked) return null
  const hasName = !!t.name.trim()
  const hasPrice = !!t.price && t.price > 0
  if (hasName && hasPrice) return null
  if (!hasName && !hasPrice) return 'empty'
  return hasName ? 'price' : 'name'
}
const incompleteCount = computed(() => types.value.filter(t => rowIssue(t)).length)
const validTypes = computed(() => types.value.filter(t => !rowIssue(t)))
const typeOptions = computed(() => validTypes.value.map(t => ({ label: `${t.name} · ${t.price} CZK`, value: t.id })))

const SEAT_PALETTE = [
  { bg: 'bg-indigo-500', text: 'text-white' },
  { bg: 'bg-amber-400', text: 'text-amber-950' },
  { bg: 'bg-teal-500', text: 'text-white' },
  { bg: 'bg-rose-500', text: 'text-white' },
  { bg: 'bg-sky-500', text: 'text-white' }
]
const typeStyles = computed<Record<string, SeatStyle>>(() =>
  Object.fromEntries(types.value.map((t, i) => [t.id, {
    ...SEAT_PALETTE[i % SEAT_PALETTE.length]!,
    letter: (t.name.trim()[0] ?? '?').toUpperCase()
  }]))
)

/* ——— seats: same select-then-apply console as the creation wizard ——— */
const existing = existingAssignments()
const added = reactive<Record<string, string>>({})
const selectedSeats = reactive<Record<string, true>>({})
const assignTypeId = ref<string | undefined>(LIVE_TYPES[0]?.id)
const rangeFrom = ref<number | undefined>(undefined)
const rangeTo = ref<number | undefined>(undefined)

/** merged view for the map: locked existing + this session's additions */
const allAssignments = computed(() => ({ ...existing, ...added }))

const activeSectorId = ref(EDIT_SECTORS[0]!.id)
const activeSeating = computed(() => EDIT_SECTORS.find(s => s.id === activeSectorId.value))
const isStandingActive = computed(() => activeSectorId.value === STANDING_ZONE.id)

const clearSelection = () => {
  for (const k of Object.keys(selectedSeats)) delete selectedSeats[k]
}
watch(activeSectorId, () => {
  clearSelection()
  rangeFrom.value = undefined
  rangeTo.value = undefined
})

const seatLock = (key: string, row: number, seat: number): SeatLock => {
  if (existing[key]) return isSold(row, seat) ? 'sold' : 'existing'
  return null
}

let lockedToastAt = 0
const onLockedClick = (kind: Exclude<SeatLock, null>) => {
  const now = performance.now()
  if (now - lockedToastAt < 1500) return
  lockedToastAt = now
  toast.add({
    title: kind === 'sold' ? 'Seat already sold' : 'Existing assignments are locked',
    description: kind === 'sold'
      ? 'Sold seats can only be freed by refunding the order in Sales.'
      : 'Since publishing, assigned seats can\'t change their ticket type — you can only add new ones.',
    icon: 'i-lucide-lock',
    color: 'warning'
  })
}

const toggleSeat = (key: string) => {
  if (selectedSeats[key]) delete selectedSeats[key]
  else selectedSeats[key] = true
}

/** row letters and bulk-select only touch selectable seats (free or added this session) */
const selectableInRow = (sectorId: string, rows: number, seats: number, rowIndex: number) => {
  const keys: string[] = []
  for (let s = 0; s < seats; s++) {
    const k = `${sectorId}:${rowIndex}:${s}`
    if (!existing[k]) keys.push(k)
  }
  return keys
}

const toggleRow = (rowIndex: number) => {
  const sec = activeSeating.value
  if (!sec) return
  const keys = selectableInRow(sec.id, sec.rows, sec.seats, rowIndex)
  if (!keys.length) {
    onLockedClick('existing')
    return
  }
  const allSelected = keys.every(k => selectedSeats[k])
  for (const k of keys) {
    if (allSelected) delete selectedSeats[k]
    else selectedSeats[k] = true
  }
}

const selectUnassigned = () => {
  const sec = activeSeating.value
  if (!sec) return
  for (let r = 0; r < sec.rows; r++) {
    for (let s = 0; s < sec.seats; s++) {
      const k = `${sec.id}:${r}:${s}`
      if (!existing[k] && !added[k]) selectedSeats[k] = true
    }
  }
}

const rowOptions = computed(() =>
  activeSeating.value
    ? Array.from({ length: activeSeating.value.rows }, (_, i) => ({ label: `Row ${String.fromCharCode(65 + i)}`, value: i }))
    : []
)

const addRange = () => {
  const sec = activeSeating.value
  if (!sec || rangeFrom.value === undefined || rangeTo.value === undefined) return
  const [a, b] = [Math.min(rangeFrom.value, rangeTo.value), Math.max(rangeFrom.value, rangeTo.value)]
  for (let r = a; r <= b; r++) {
    for (const k of selectableInRow(sec.id, sec.rows, sec.seats, r)) selectedSeats[k] = true
  }
}

const selCount = computed(() => Object.keys(selectedSeats).length)

const applyAssignment = () => {
  if (!assignTypeId.value) return
  for (const key of Object.keys(selectedSeats)) {
    added[key] = assignTypeId.value
  }
  clearSelection()
}

const markUnassigned = () => {
  for (const key of Object.keys(selectedSeats)) {
    delete added[key]
  }
  clearSelection()
}

const addedCount = computed(() => Object.keys(added).length)

const sectorCounts = (sectorId: string) => {
  const sec = EDIT_SECTORS.find(s => s.id === sectorId)!
  let assigned = 0
  let sold = 0
  let free = 0
  for (let r = 0; r < sec.rows; r++) {
    for (let s = 0; s < sec.seats; s++) {
      const k = `${sec.id}:${r}:${s}`
      if (existing[k]) {
        assigned++
        if (isSold(r, s)) sold++
      } else if (added[k]) {
        assigned++
      } else {
        free++
      }
    }
  }
  return { assigned, sold, free }
}

const railStatus = (sectorId: string) => {
  if (sectorId === STANDING_ZONE.id) {
    return capacityChanged.value ? `${fmtN(capacity.value)} cap` : `${fmtN(STANDING_ZONE.capacity)} cap`
  }
  const { free } = sectorCounts(sectorId)
  return free === 0 ? 'all assigned ✓' : `${free} free`
}

/* ——— standing: type locked, capacity can only grow ——— */
const capacity = ref<number>(STANDING_ZONE.capacity)
const capacityChanged = computed(() => capacity.value > STANDING_ZONE.capacity)

/* ——— change summary ——— */
const changes = computed(() => {
  const list: string[] = []
  for (const t of types.value) {
    if (t.locked && t.price && t.price !== originalPrices[t.id]) {
      list.push(`${t.name} ${fmtN(originalPrices[t.id]!)} → ${fmtN(t.price)} Kč`)
    }
    if (!t.locked && !rowIssue(t)) list.push(`+ ${t.name.trim()}`)
  }
  if (addedCount.value) list.push(`+ ${addedCount.value} ${addedCount.value === 1 ? 'seat' : 'seats'}`)
  if (capacityChanged.value) list.push(`Standing ${fmtN(STANDING_ZONE.capacity)} → ${fmtN(capacity.value)}`)
  return list
})

const canSave = computed(() => changes.value.length > 0 && incompleteCount.value === 0)

const save = () => {
  toast.add({
    title: 'Changes are live',
    description: `${changes.value.length} ${changes.value.length === 1 ? 'change' : 'changes'} applied — buyers see them on the storefront immediately.`,
    icon: 'i-lucide-check-circle',
    color: 'success'
  })
  navigateTo(`/events/${slug.value}`)
}
</script>

<template>
  <div class="min-h-screen bg-muted">
    <AppHeader />

    <UContainer class="max-w-6xl pb-32">
      <UBreadcrumb
        :items="[
          { label: 'Events', icon: 'i-lucide-ticket', to: '/' },
          { label: meta.title, to: `/events/${slug}` },
          { label: 'Edit' }
        ]"
        class="pt-6"
      />

      <UPageHeader
        description="Changes apply to the storefront immediately — no re-publishing needed."
        :ui="{ root: 'border-none pt-4 pb-6' }"
      >
        <template #title>
          <span class="flex items-center gap-3">
            Edit event
            <UBadge label="On sale" color="success" variant="subtle" />
          </span>
        </template>
      </UPageHeader>

      <div class="flex flex-col gap-6">
        <!-- locked details -->
        <UPageCard
          variant="outline"
          title="Event details"
          description="Locked since publishing — buyers already hold tickets with these details."
        >
          <div class="flex items-start gap-4 mt-3">
            <div class="w-32 shrink-0 aspect-video rounded-md bg-elevated overflow-hidden relative">
              <img src="https://picsum.photos/seed/kralovka/640/360" alt="" class="absolute inset-0 size-full object-cover">
              <span class="absolute bottom-1 right-1 rounded bg-(--ui-bg)/85 p-1">
                <UIcon name="i-lucide-lock" class="size-3 text-muted block" />
              </span>
            </div>
            <dl class="flex-1 flex flex-col gap-2 text-sm min-w-0">
              <div v-for="row in [
                { label: 'Title', value: meta.title },
                { label: 'Schedule', value: `${meta.when}–22:00` },
                { label: 'Venue', value: meta.venue }
              ]" :key="row.label" class="flex items-center justify-between gap-4">
                <dt class="text-muted">{{ row.label }}</dt>
                <dd class="flex items-center gap-1.5 font-medium text-highlighted text-right truncate">
                  {{ row.value }}
                  <UIcon name="i-lucide-lock" class="size-3 shrink-0 text-dimmed" />
                </dd>
              </div>
            </dl>
          </div>
          <p class="text-xs text-dimmed mt-3">
            Need a locked change? Cancel the event from Overview or contact the Tickitify team.
          </p>
        </UPageCard>

        <!-- ticket types -->
        <UPageCard
          variant="outline"
          title="Ticket types"
          description="Names are permanent. Prices stay editable — and you can add new tiers anytime."
        >
          <div class="hidden sm:flex items-center gap-3 mt-3 mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
            <span class="w-2.5" />
            <span class="flex-1">Ticket type</span>
            <span class="w-36">Price</span>
            <span class="w-10">CCY</span>
            <span class="w-36">Assigned</span>
            <span class="w-8" />
          </div>

          <div class="flex flex-col divide-y divide-default">
            <div v-for="t in types" :key="t.id" class="flex flex-wrap sm:flex-nowrap items-center gap-3 py-3">
              <span class="size-2.5 rounded-full shrink-0" :class="typeStyles[t.id]?.bg" />
              <UInput
                v-model="t.name"
                :disabled="t.locked"
                :trailing-icon="t.locked ? 'i-lucide-lock' : undefined"
                placeholder="Student, Family…"
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
              <span class="w-10 text-sm text-muted">CZK</span>
              <span class="w-36 text-sm tabular-nums" :class="t.assignedLabel ? 'text-default' : 'text-dimmed'">
                {{ t.assignedLabel ?? 'new — assign below' }}
              </span>
              <UButton
                v-if="!t.locked"
                icon="i-lucide-trash-2"
                color="neutral"
                variant="ghost"
                size="sm"
                aria-label="Remove ticket type"
                @click="removeType(t.id)"
              />
              <span v-else class="w-8" />
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
              {{ incompleteCount }} {{ incompleteCount === 1 ? 'type needs' : 'types need' }} a name and a price above 0
            </p>
          </div>
        </UPageCard>

        <!-- seats: same three-pane console as the creation wizard -->
        <UAlert
          color="info"
          variant="subtle"
          icon="i-lucide-info"
          :title="isStandingActive ? 'Standing sectors don\'t use a seat map' : 'Existing assignments and sold seats are locked'"
          :description="isStandingActive
            ? 'The ticket type is locked — capacity can only go up while the event sells.'
            : 'Select the seats you left out at creation and put them on sale — sold seats free up only via refunds in Sales.'"
        />

        <div class="grid lg:grid-cols-[220px_minmax(0,1fr)_300px] gap-5 items-start">
          <!-- sector rail -->
          <UPageCard variant="outline" :ui="{ container: 'p-2.5 sm:p-2.5' }">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-muted px-2 pt-1 pb-2">Sectors</p>
            <div class="flex flex-col gap-1">
              <button
                v-for="sid in [...EDIT_SECTORS.map(s => s.id), STANDING_ZONE.id]"
                :key="sid"
                type="button"
                class="rounded-md px-3 py-2.5 text-left transition"
                :class="activeSectorId === sid ? 'bg-elevated ring ring-accented' : 'hover:bg-elevated/60'"
                @click="activeSectorId = sid"
              >
                <span class="block text-sm font-medium text-highlighted">
                  {{ sid === STANDING_ZONE.id ? STANDING_ZONE.name : EDIT_SECTORS.find(s => s.id === sid)?.name }}
                </span>
                <span class="block text-xs mt-0.5" :class="railStatus(sid).includes('✓') ? 'text-success' : 'text-muted'">
                  {{ railStatus(sid) }}
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
                  {{ sectorCounts(activeSeating.id).assigned }} assigned ·
                  {{ sectorCounts(activeSeating.id).sold }} sold ·
                  {{ sectorCounts(activeSeating.id).free }} free
                </p>
              </div>
              <UButton
                label="Select unassigned"
                color="neutral"
                variant="outline"
                size="sm"
                :disabled="sectorCounts(activeSeating.id).free === 0"
                @click="selectUnassigned"
              />
            </div>

            <SeatMapEditor
              :sector="activeSeating"
              :assignments="allAssignments"
              :styles="typeStyles"
              :selected="selectedSeats"
              :is-locked="seatLock"
              @toggle-seat="toggleSeat"
              @toggle-row="toggleRow"
              @locked-click="onLockedClick"
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
                <span class="size-4 rounded bg-accented flex items-center justify-center text-[9px] text-muted">·</span> Sold
              </span>
              <span class="flex items-center gap-1.5">
                <span class="size-4 rounded bg-elevated ring-2 ring-primary ring-offset-1 ring-offset-(--ui-bg)" /> Selected
              </span>
            </div>
          </UPageCard>

          <!-- standing sector: GA panel -->
          <UPageCard v-else variant="outline" class="min-w-0">
            <div class="h-56 rounded-lg border-2 border-dashed border-accented bg-elevated/40 flex items-center justify-center mt-1">
              <p class="text-sm text-muted">{{ STANDING_ZONE.name }} · general admission</p>
            </div>
            <p class="text-xs text-dimmed text-center mt-3">
              No seat numbers are issued. Buyers are admitted first-come up to the capacity you set.
            </p>
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
              description="Only seats added in this session can be unassigned — published assignments stay."
              class="mt-4"
            />
          </UPageCard>

          <UPageCard v-else variant="outline" title="Standing config" class="lg:sticky lg:top-24">
            <UFormField label="Sold as ticket type" class="mt-3">
              <UInput model-value="Standard · 400 CZK" disabled trailing-icon="i-lucide-lock" class="w-full" />
            </UFormField>

            <UFormField label="Sellable capacity" :help="capacityChanged ? `+${fmtN(capacity - STANDING_ZONE.capacity)} tickets` : 'can only increase'" class="mt-3">
              <UInputNumber
                v-model="capacity"
                :min="STANDING_ZONE.capacity"
                :max="STANDING_ZONE.max"
                :step="20"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Venue max capacity" class="mt-3">
              <UInput :model-value="fmtN(STANDING_ZONE.max)" disabled class="w-full" />
            </UFormField>

            <UAlert
              color="warning"
              variant="subtle"
              icon="i-lucide-info"
              description="Capacity can't go below what's already on sale."
              class="mt-4"
            />
          </UPageCard>
        </div>
      </div>

      <!-- ════ sticky save bar ════ -->
      <div class="sticky bottom-4 z-40 mt-8">
        <div class="rounded-lg ring ring-default bg-default/90 backdrop-blur px-4 py-3 shadow-lg flex flex-wrap items-center gap-3">
          <template v-if="changes.length">
            <UBadge
              v-for="c in changes"
              :key="c"
              :label="c"
              color="primary"
              variant="subtle"
              size="sm"
            />
          </template>
          <span v-else class="text-sm text-dimmed">No changes yet — everything below mirrors the live event.</span>
          <span class="flex-1" />
          <UButton label="Discard" color="neutral" variant="ghost" :to="`/events/${slug}`" />
          <UButton
            :label="changes.length ? `Save ${changes.length} ${changes.length === 1 ? 'change' : 'changes'}` : 'Save changes'"
            icon="i-lucide-check"
            color="primary"
            :disabled="!canSave"
            @click="save"
          />
        </div>
      </div>
    </UContainer>
  </div>
</template>
