<script setup lang="ts">
const t = useT()
useHead({ title: () => `${t('auth.signIn')} · Tickitify` })

const toast = useToast()

const fields = computed(() => [
  { name: 'email', type: 'text' as const, label: t('auth.email'), placeholder: 'you@organizer.cz', required: true },
  { name: 'password', type: 'password' as const, label: t('auth.password'), placeholder: '••••••••', required: true }
])

const onSubmit = () => {
  toast.add({ title: t('auth.signedInTitle'), description: t('auth.signedInDesc'), icon: 'i-lucide-check-circle', color: 'success' })
  navigateTo('/')
}
</script>

<template>
  <AuthShell>
    <UAuthForm
      icon="i-lucide-user-round"
      :title="t('auth.signInTitle')"
      :description="t('auth.signInDesc')"
      :fields="fields"
      :submit="{ label: t('auth.signIn'), color: 'primary', block: true }"
      @submit="onSubmit"
    >
      <template #footer>
        <div class="flex flex-col gap-3 text-center text-sm">
          <ULink to="/forgot-password" class="text-primary font-medium">{{ t('auth.forgot') }}</ULink>
          <USeparator />
          <p class="text-muted">
            {{ t('auth.noAccountPre') }}
            <ULink to="/invite" class="text-primary font-medium">{{ t('auth.seeInvite') }}</ULink>.
          </p>
        </div>
      </template>
    </UAuthForm>

    <template #foot>
      {{ t('auth.foot') }}
    </template>
  </AuthShell>
</template>
