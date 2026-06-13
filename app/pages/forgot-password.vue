<script setup lang="ts">
useHead({ title: 'Reset password · Tickitify' })

const sent = ref(false)
const sentTo = ref('')

const fields = [
  { name: 'email', type: 'text' as const, label: 'Email', placeholder: 'you@organizer.cz', required: true }
]

const onSubmit = (event: any) => {
  sentTo.value = event.data?.email || 'your inbox'
  sent.value = true
}
</script>

<template>
  <AuthShell>
    <UAuthForm
      v-if="!sent"
      icon="i-lucide-key-round"
      title="Forgot your password?"
      description="Enter your account email — we'll send a reset link."
      :fields="fields"
      :submit="{ label: 'Send reset link', color: 'primary', block: true }"
      @submit="onSubmit"
    >
      <template #footer>
        <p class="text-center text-sm">
          <ULink to="/login" class="text-primary font-medium">Back to sign in</ULink>
        </p>
      </template>
    </UAuthForm>

    <UEmpty
      v-else
      icon="i-lucide-mail-check"
      title="Check your inbox"
      :description="`We sent a reset link to ${sentTo}. It's valid for a limited time — check spam if it doesn't arrive.`"
      :actions="[
        { label: 'Open the reset page', trailingIcon: 'i-lucide-arrow-right', color: 'primary' as const, to: '/reset-password' },
        { label: 'Back to sign in', color: 'neutral' as const, variant: 'subtle' as const, to: '/login' }
      ]"
      class="py-6"
    />

    <template #foot>
      Reset links are single-use email tokens — nobody at Tickitify ever sees your password.
    </template>
  </AuthShell>
</template>
