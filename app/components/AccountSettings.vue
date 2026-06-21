<script setup lang="ts">
import { BANK_ACCOUNT, KYC } from '~/utils/payouts'

const t = useT()
const toast = useToast()

const orgName = ref('Czech Volleyball Federation')

const saveOrg = () => {
  toast.add({ title: t('account.orgSavedTitle'), icon: 'i-lucide-check', color: 'success' })
}

const manageStripe = () => {
  toast.add({
    title: t('account.stripeToastTitle'),
    description: t('account.stripeToastDesc'),
    icon: 'i-lucide-external-link',
    color: 'info'
  })
}

const resetPassword = () => {
  toast.add({
    title: t('account.resetToastTitle'),
    description: t('account.resetToastDesc'),
    icon: 'i-lucide-mail',
    color: 'success'
  })
}

const changeCover = () => {
  toast.add({ title: t('account.coverToastTitle'), description: t('account.coverToastDesc'), icon: 'i-lucide-image', color: 'info' })
}

const changePhoto = () => {
  toast.add({ title: t('account.photoToastTitle'), description: t('account.photoToastDesc'), icon: 'i-lucide-camera', color: 'info' })
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
            :label="t('account.changeCover')"
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
          <p class="text-sm text-muted">{{ t('account.brandSubtitle') }}</p>
        </div>
        <UButton
          :label="t('account.changePhoto')"
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
      :title="t('account.payoutsTitle')"
      :description="t('account.payoutsDescription')"
    >
      <div class="flex flex-wrap items-center justify-between gap-3 mt-2">
        <div class="flex items-center gap-3">
          <UAvatar icon="i-lucide-landmark" size="md" />
          <div>
            <p class="text-sm font-medium text-highlighted flex items-center gap-2">
              {{ t('account.kycVerification') }}
              <UBadge :label="t('account.kycVerifiedBadge')" color="success" variant="subtle" size="sm" />
            </p>
            <p class="text-xs text-muted">{{ t('account.kycSince', { date: KYC.verifiedLabel }) }}</p>
          </div>
        </div>
        <UButton
          :label="t('account.manageInStripe')"
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
          <dt class="text-muted">{{ t('account.bankLabel') }}</dt>
          <dd class="font-medium text-highlighted mt-0.5">{{ BANK_ACCOUNT.bank }}</dd>
        </div>
        <div>
          <dt class="text-muted">{{ t('account.accountLabel') }}</dt>
          <dd class="font-medium text-highlighted mt-0.5 tabular-nums">{{ BANK_ACCOUNT.masked }}</dd>
        </div>
        <div>
          <dt class="text-muted">{{ t('account.payoutCurrencyLabel') }}</dt>
          <dd class="font-medium text-highlighted mt-0.5">{{ BANK_ACCOUNT.currency }}</dd>
        </div>
      </dl>
    </UPageCard>

    <!-- organization -->
    <UPageCard
      variant="outline"
      :title="t('account.organizationTitle')"
      :description="t('account.organizationDescription')"
    >
      <div class="mt-2 sm:max-w-md">
        <UFormField :label="t('account.displayNameLabel')" :help="t('account.displayNameHelp')">
          <UInput v-model="orgName" class="w-full" />
        </UFormField>
      </div>
      <div class="flex justify-end mt-4">
        <UButton :label="t('account.saveChanges')" color="primary" @click="saveOrg" />
      </div>
    </UPageCard>

    <!-- sign-in & security -->
    <UPageCard
      variant="outline"
      :title="t('account.securityTitle')"
      :description="t('account.securityDescription')"
    >
      <div class="flex flex-wrap items-center justify-between gap-3 mt-2">
        <div class="flex items-center gap-3">
          <UAvatar text="ON" size="md" />
          <div>
            <p class="text-sm font-medium text-highlighted">ondrej.novak@cvf.cz</p>
            <p class="text-xs text-muted">{{ t('account.passwordLastChanged') }}</p>
          </div>
        </div>
        <UButton
          :label="t('account.changePassword')"
          icon="i-lucide-key-round"
          color="neutral"
          variant="subtle"
          @click="resetPassword"
        />
      </div>
    </UPageCard>
  </div>
</template>
