<script setup lang="ts">
import { BANK_ACCOUNT, KYC } from '~/utils/payouts'

const toast = useToast()

const orgName = ref('Czech Volleyball Federation')

const saveOrg = () => {
  toast.add({ title: 'Organization saved', icon: 'i-lucide-check', color: 'success' })
}

const manageStripe = () => {
  toast.add({
    title: 'Stripe onboarding opens here',
    description: 'Bank details and verification are managed on a Stripe-hosted page — status updates back automatically.',
    icon: 'i-lucide-external-link',
    color: 'info'
  })
}

const resetPassword = () => {
  toast.add({
    title: 'Reset link sent',
    description: 'Check ondrej.novak@cvf.cz — the link is valid for a limited time.',
    icon: 'i-lucide-mail',
    color: 'success'
  })
}

const changeCover = () => {
  toast.add({ title: 'Cover upload opens here', description: 'Pick a banner for your storefront — prototype placeholder.', icon: 'i-lucide-image', color: 'info' })
}

const changePhoto = () => {
  toast.add({ title: 'Photo upload opens here', description: 'Pick your brand logo — prototype placeholder.', icon: 'i-lucide-camera', color: 'info' })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- brand / profile header -->
    <UPageCard variant="outline" :ui="{ container: 'p-0 sm:p-0', body: 'p-0 sm:p-0' }">
      <div class="relative">
        <!-- cover band -->
        <div class="h-32 sm:h-40 bg-elevated rounded-t-[calc(var(--ui-radius)*2)]" />
        <div class="absolute top-3 right-3">
          <UButton
            label="Change cover"
            icon="i-lucide-image"
            color="neutral"
            variant="subtle"
            size="sm"
            @click="changeCover"
          />
        </div>
        <!-- overlapping avatar -->
        <div class="absolute left-4 sm:left-6 -bottom-6">
          <UAvatar
            text="VF"
            size="2xl"
            class="ring-4 ring-default bg-elevated text-highlighted"
          />
        </div>
      </div>
      <div class="flex flex-wrap items-end justify-between gap-3 px-4 sm:px-6 pt-9 pb-5 pl-24 sm:pl-28">
        <div>
          <p class="text-base font-semibold text-highlighted">Czech Volleyball Federation</p>
          <p class="text-sm text-muted">Organizer brand · shown on your storefront and tickets</p>
        </div>
        <UButton
          label="Change photo"
          icon="i-lucide-camera"
          color="neutral"
          variant="subtle"
          size="sm"
          @click="changePhoto"
        />
      </div>
    </UPageCard>

    <!-- Stripe Connect / KYC -->
    <UPageCard
      variant="outline"
      title="Payouts · Stripe Connect"
      description="Verification and bank details are handled by Stripe — we never store them ourselves."
    >
      <div class="flex flex-wrap items-center justify-between gap-3 mt-2">
        <div class="flex items-center gap-3">
          <UAvatar icon="i-lucide-landmark" size="md" />
          <div>
            <p class="text-sm font-medium text-highlighted flex items-center gap-2">
              KYC verification
              <UBadge label="Verified" color="success" variant="subtle" size="sm" />
            </p>
            <p class="text-xs text-muted">since {{ KYC.verifiedLabel }} · publishing events is enabled</p>
          </div>
        </div>
        <UButton
          label="Manage in Stripe"
          trailing-icon="i-lucide-external-link"
          color="neutral"
          variant="subtle"
          @click="manageStripe"
        />
      </div>

      <UStepper
        :items="KYC.steps"
        :default-value="3"
        disabled
        color="success"
        size="sm"
        class="w-full mt-6"
      />

      <USeparator class="my-5" />

      <dl class="grid sm:grid-cols-3 gap-x-8 gap-y-3 text-sm">
        <div>
          <dt class="text-muted">Bank</dt>
          <dd class="font-medium text-highlighted mt-0.5">{{ BANK_ACCOUNT.bank }}</dd>
        </div>
        <div>
          <dt class="text-muted">Account</dt>
          <dd class="font-medium text-highlighted mt-0.5 tabular-nums">{{ BANK_ACCOUNT.masked }}</dd>
        </div>
        <div>
          <dt class="text-muted">Payout currency</dt>
          <dd class="font-medium text-highlighted mt-0.5">{{ BANK_ACCOUNT.currency }}</dd>
        </div>
      </dl>
    </UPageCard>

    <!-- organization -->
    <UPageCard
      variant="outline"
      title="Organization"
      description="How your brand appears to buyers — on the storefront, tickets and emails."
    >
      <div class="mt-2 sm:max-w-md">
        <UFormField label="Display name" help="Shown on the storefront and on every ticket.">
          <UInput v-model="orgName" class="w-full" />
        </UFormField>
      </div>
      <div class="flex justify-end mt-4">
        <UButton label="Save changes" color="primary" @click="saveOrg" />
      </div>
    </UPageCard>

    <!-- sign-in & security -->
    <UPageCard
      variant="outline"
      title="Sign-in & security"
      description="Your organizer account credentials."
    >
      <div class="flex flex-wrap items-center justify-between gap-3 mt-2">
        <div class="flex items-center gap-3">
          <UAvatar text="ON" size="md" />
          <div>
            <p class="text-sm font-medium text-highlighted">ondrej.novak@cvf.cz</p>
            <p class="text-xs text-muted">password last changed 5 May 2026</p>
          </div>
        </div>
        <UButton
          label="Change password"
          icon="i-lucide-key-round"
          color="neutral"
          variant="subtle"
          @click="resetPassword"
        />
      </div>
    </UPageCard>
  </div>
</template>
