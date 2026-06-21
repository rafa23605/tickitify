<script setup lang="ts">
import type { FormError } from '@nuxt/ui'

const t = useT()

useHead({ title: `${t('invite.docTitle')} · Tickitify` })

const toast = useToast()

/** prototype-only switch: valid invite vs the 7-day token having expired */
const demoState = ref<'valid' | 'expired'>('valid')

const fields = computed(() => [
  { name: 'password', type: 'password' as const, label: t('invite.fieldPasswordLabel'), placeholder: t('invite.fieldPasswordPlaceholder'), required: true },
  { name: 'confirm', type: 'password' as const, label: t('invite.fieldConfirmLabel'), placeholder: t('invite.fieldConfirmPlaceholder'), required: true }
])

const validate = (state: any): FormError[] => {
  const errors: FormError[] = []
  if (state.password && state.password.length < 8) {
    errors.push({ name: 'password', message: t('invite.errorPasswordLength') })
  }
  if (state.confirm && state.confirm !== state.password) {
    errors.push({ name: 'confirm', message: t('invite.errorPasswordMismatch') })
  }
  return errors
}

const onSubmit = () => {
  toast.add({
    title: t('invite.toastWelcomeTitle'),
    description: t('invite.toastWelcomeDescription'),
    icon: 'i-lucide-party-popper',
    color: 'success'
  })
  navigateTo('/')
}

const requestNew = () => {
  toast.add({ title: t('invite.toastRequestTitle'), description: t('invite.toastRequestDescription'), icon: 'i-lucide-mail', color: 'info' })
}
</script>

<template>
  <AuthShell>
    <!-- valid invitation -->
    <UAuthForm
      v-if="demoState === 'valid'"
      icon="i-lucide-mail-open"
      :title="t('invite.validTitle')"
      :description="t('invite.validDescription')"
      :fields="fields"
      :validate="validate"
      :submit="{ label: t('invite.submitLabel'), color: 'primary', block: true }"
      @submit="onSubmit"
    >
      <template #leading>
        <div class="flex flex-col items-center gap-3">
          <UIcon name="i-lucide-mail-open" class="size-8 text-primary" />
          <div class="flex flex-col items-center gap-1">
            <UBadge label="Czech Volleyball Federation" color="neutral" variant="subtle" />
            <p class="text-xs text-muted">ondrej.novak@cvf.cz</p>
          </div>
        </div>
      </template>
      <template #footer>
        <p class="text-xs text-dimmed text-center">
          {{ t('invite.footerText') }}
          <ULink to="/settings?tab=account" class="text-primary">{{ t('invite.footerLink') }}</ULink>.
        </p>
      </template>
    </UAuthForm>

    <!-- expired token -->
    <UEmpty
      v-else
      icon="i-lucide-clock-alert"
      :title="t('invite.expiredTitle')"
      :description="t('invite.expiredDescription')"
      :actions="[
        { label: t('invite.expiredActionRequest'), icon: 'i-lucide-mail', color: 'primary' as const, onClick: requestNew },
        { label: t('invite.expiredActionBack'), color: 'neutral' as const, variant: 'subtle' as const, to: '/login' }
      ]"
      class="py-6"
    />

    <template #foot>
      {{ t('invite.footNote') }}
    </template>
  </AuthShell>

  <!-- prototype-only: invite state switcher -->
  <div class="fixed bottom-5 right-5 z-50">
    <UFieldGroup size="sm" class="shadow-lg">
      <UButton
        :label="t('invite.switcherValid')"
        color="neutral"
        :variant="demoState === 'valid' ? 'solid' : 'outline'"
        @click="demoState = 'valid'"
      />
      <UButton
        :label="t('invite.switcherExpired')"
        color="neutral"
        :variant="demoState === 'expired' ? 'solid' : 'outline'"
        @click="demoState = 'expired'"
      />
    </UFieldGroup>
  </div>
</template>
