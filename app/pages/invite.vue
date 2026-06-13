<script setup lang="ts">
import type { FormError } from '@nuxt/ui'

useHead({ title: 'Accept invitation · Tickitify' })

const toast = useToast()

/** prototype-only switch: valid invite vs the 7-day token having expired */
const demoState = ref<'valid' | 'expired'>('valid')

const fields = [
  { name: 'password', type: 'password' as const, label: 'Password', placeholder: 'At least 8 characters', required: true },
  { name: 'confirm', type: 'password' as const, label: 'Confirm password', placeholder: 'Repeat it', required: true }
]

const validate = (state: any): FormError[] => {
  const errors: FormError[] = []
  if (state.password && state.password.length < 8) {
    errors.push({ name: 'password', message: 'Use at least 8 characters.' })
  }
  if (state.confirm && state.confirm !== state.password) {
    errors.push({ name: 'confirm', message: 'Passwords don\'t match.' })
  }
  return errors
}

const onSubmit = () => {
  toast.add({
    title: 'Welcome aboard',
    description: 'Account created — set up payouts before publishing your first event.',
    icon: 'i-lucide-party-popper',
    color: 'success'
  })
  navigateTo('/')
}

const requestNew = () => {
  toast.add({ title: 'Request sent', description: 'The Tickitify team will send a fresh invitation to ondrej.novak@cvf.cz.', icon: 'i-lucide-mail', color: 'info' })
}
</script>

<template>
  <AuthShell>
    <!-- valid invitation -->
    <UAuthForm
      v-if="demoState === 'valid'"
      icon="i-lucide-mail-open"
      title="You're invited"
      description="Set a password to start managing events for your organization."
      :fields="fields"
      :validate="validate"
      :submit="{ label: 'Set password & continue', color: 'primary', block: true }"
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
          Invitation links are valid for 7 days. By continuing you accept the
          <ULink to="/settings?tab=account" class="text-primary">Data Processing Agreement</ULink>.
        </p>
      </template>
    </UAuthForm>

    <!-- expired token -->
    <UEmpty
      v-else
      icon="i-lucide-clock-alert"
      title="This invitation has expired"
      description="Invite links are valid for 7 days. Ask the Tickitify team to send a new one to ondrej.novak@cvf.cz."
      :actions="[
        { label: 'Request a new invite', icon: 'i-lucide-mail', color: 'primary' as const, onClick: requestNew },
        { label: 'Back to sign in', color: 'neutral' as const, variant: 'subtle' as const, to: '/login' }
      ]"
      class="py-6"
    />

    <template #foot>
      Accounts are created by the Tickitify team — there is no public sign-up.
    </template>
  </AuthShell>

  <!-- prototype-only: invite state switcher -->
  <div class="fixed bottom-5 right-5 z-50">
    <UFieldGroup size="sm" class="shadow-lg">
      <UButton
        label="Valid invite"
        color="neutral"
        :variant="demoState === 'valid' ? 'solid' : 'outline'"
        @click="demoState = 'valid'"
      />
      <UButton
        label="Expired link"
        color="neutral"
        :variant="demoState === 'expired' ? 'solid' : 'outline'"
        @click="demoState = 'expired'"
      />
    </UFieldGroup>
  </div>
</template>
