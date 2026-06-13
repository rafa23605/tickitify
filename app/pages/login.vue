<script setup lang="ts">
useHead({ title: 'Sign in · Tickitify' })

const toast = useToast()

const fields = [
  { name: 'email', type: 'text' as const, label: 'Email', placeholder: 'you@organizer.cz', required: true },
  { name: 'password', type: 'password' as const, label: 'Password', placeholder: '••••••••', required: true }
]

const onSubmit = () => {
  toast.add({ title: 'Welcome back', description: 'Signed in as Czech Volleyball Federation.', icon: 'i-lucide-check-circle', color: 'success' })
  navigateTo('/')
}
</script>

<template>
  <AuthShell>
    <UAuthForm
      icon="i-lucide-user-round"
      title="Welcome back"
      description="Sign in to your organizer account."
      :fields="fields"
      :submit="{ label: 'Sign in', color: 'primary', block: true }"
      @submit="onSubmit"
    >
      <template #footer>
        <div class="flex flex-col gap-3 text-center text-sm">
          <ULink to="/forgot-password" class="text-primary font-medium">Forgot password?</ULink>
          <USeparator />
          <p class="text-muted">
            No account? Organizer accounts are created by invitation —
            <ULink to="/invite" class="text-primary font-medium">see how an invite looks</ULink>.
          </p>
        </div>
      </template>
    </UAuthForm>

    <template #foot>
      Prototype — any credentials sign you in. Sessions use secure httpOnly cookies in production.
    </template>
  </AuthShell>
</template>
