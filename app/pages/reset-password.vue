<script setup lang="ts">
import type { FormError } from '@nuxt/ui'

useHead({ title: 'New password · Tickitify' })

const toast = useToast()

const fields = [
  { name: 'password', type: 'password' as const, label: 'New password', placeholder: 'At least 8 characters', required: true },
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
    title: 'Password updated',
    description: 'All other sessions were signed out. Sign in with your new password.',
    icon: 'i-lucide-shield-check',
    color: 'success'
  })
  navigateTo('/login')
}
</script>

<template>
  <AuthShell>
    <UAuthForm
      icon="i-lucide-lock-keyhole"
      title="Set a new password"
      description="For ondrej.novak@cvf.cz — the reset link checks out."
      :fields="fields"
      :validate="validate"
      :submit="{ label: 'Save new password', color: 'primary', block: true }"
      @submit="onSubmit"
    >
      <template #footer>
        <p class="text-center text-sm">
          <ULink to="/login" class="text-primary font-medium">Back to sign in</ULink>
        </p>
      </template>
    </UAuthForm>

    <template #foot>
      Changing the password signs out every other session — token-theft protection per our security model.
    </template>
  </AuthShell>
</template>
