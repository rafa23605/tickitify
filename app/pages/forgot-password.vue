<script setup lang="ts">
const t = useT()

useHead({ title: t('forgot.docTitle') })

const sent = ref(false)
const sentTo = ref('')

const fields = computed(() => [
  { name: 'email', type: 'text' as const, label: t('forgot.emailLabel'), placeholder: t('forgot.emailPlaceholder'), required: true }
])

const onSubmit = (event: any) => {
  sentTo.value = event.data?.email || t('forgot.defaultInbox')
  sent.value = true
}
</script>

<template>
  <AuthShell>
    <UAuthForm
      v-if="!sent"
      icon="i-lucide-key-round"
      :title="t('forgot.title')"
      :description="t('forgot.description')"
      :fields="fields"
      :submit="{ label: t('forgot.submitLabel'), color: 'primary', block: true }"
      @submit="onSubmit"
    >
      <template #footer>
        <p class="text-center text-sm">
          <ULink to="/login" class="text-primary font-medium">{{ t('forgot.backToSignIn') }}</ULink>
        </p>
      </template>
    </UAuthForm>

    <UEmpty
      v-else
      icon="i-lucide-mail-check"
      :title="t('forgot.sentTitle')"
      :description="t('forgot.sentDescription', { email: sentTo })"
      :actions="[
        { label: t('forgot.openResetPage'), trailingIcon: 'i-lucide-arrow-right', color: 'primary' as const, to: '/reset-password' },
        { label: t('forgot.backToSignIn'), color: 'neutral' as const, variant: 'subtle' as const, to: '/login' }
      ]"
      class="py-6"
    />

    <template #foot>
      {{ t('forgot.foot') }}
    </template>
  </AuthShell>
</template>
