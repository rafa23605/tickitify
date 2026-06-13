<script setup lang="ts">
import { BANK_ACCOUNT, KYC } from '~/utils/payouts'

const toast = useToast()

const orgName = ref('Czech Volleyball Federation')
const supportEmail = ref('vstupenky@cvf.cz')

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

const downloadDpa = () => {
  toast.add({ title: 'Downloading DPA v1.2', description: 'PDF download — prototype placeholder.', icon: 'i-lucide-file-down', color: 'neutral' })
}

const resetPassword = () => {
  toast.add({
    title: 'Reset link sent',
    description: 'Check ondrej.novak@cvf.cz — the link is valid for a limited time.',
    icon: 'i-lucide-mail',
    color: 'success'
  })
}
</script>

<template>
  <div class="flex flex-col gap-6">
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
      <div class="grid sm:grid-cols-2 gap-6 mt-2">
        <UFormField label="Display name" help="Shown on the storefront and on every ticket.">
          <UInput v-model="orgName" class="w-full" />
        </UFormField>
        <UFormField label="Support email" help="Buyers reply here from transactional emails.">
          <UInput v-model="supportEmail" type="email" class="w-full" />
        </UFormField>
      </div>
      <div class="flex justify-end mt-4">
        <UButton label="Save changes" color="primary" @click="saveOrg" />
      </div>
    </UPageCard>

    <!-- GDPR & DPA -->
    <UPageCard
      variant="outline"
      title="GDPR & data processing"
      description="Buyer data lives in the EU; you see personal details only where buyers gave consent."
    >
      <div class="flex flex-wrap items-center justify-between gap-3 mt-2">
        <div class="flex items-center gap-3">
          <UAvatar icon="i-lucide-shield-check" size="md" />
          <div>
            <p class="text-sm font-medium text-highlighted flex items-center gap-2">
              Data Processing Agreement
              <UBadge label="Accepted" color="success" variant="subtle" size="sm" />
            </p>
            <p class="text-xs text-muted">v1.2 · accepted 5 May 2026 during onboarding</p>
          </div>
        </div>
        <UButton
          label="Download DPA"
          icon="i-lucide-file-down"
          color="neutral"
          variant="subtle"
          @click="downloadDpa"
        />
      </div>

      <UAlert
        color="neutral"
        variant="subtle"
        icon="i-lucide-eye-off"
        description="Buyer emails and phones stay masked unless that buyer granted data-sharing consent to you — see the Customers tab of any event."
        class="mt-4"
      />
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
