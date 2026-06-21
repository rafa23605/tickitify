<script setup lang="ts">
import type { FormError } from '@nuxt/ui'

const t = useT()

useHead({ title: t('reset.docTitle') })

const toast = useToast()

const fields = computed(() => [
  { name: 'password', type: 'password' as const, label: t('reset.passwordLabel'), placeholder: t('reset.passwordPlaceholder'), required: true },
  { name: 'confirm', type: 'password' as const, label: t('reset.confirmLabel'), placeholder: t('reset.confirmPlaceholder'), required: true }
])

const validate = (state: any): FormError[] => {
  const errors: FormError[] = []
  if (state.password && state.password.length < 8) {
    errors.push({ name: 'password', message: t('reset.errorMinLength') })
  }
  if (state.confirm && state.confirm !== state.password) {
    errors.push({ name: 'confirm', message: t('reset.errorMismatch') })
  }
  return errors
}

const onSubmit = () => {
  toast.add({
    title: t('reset.toastTitle'),
    description: t('reset.toastDescription'),
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
      :title="t('reset.title')"
      :description="t('reset.description', { email: 'ondrej.novak@cvf.cz' })"
      :fields="fields"
      :validate="validate"
      :submit="{ label: t('reset.submitLabel'), color: 'primary', block: true }"
      @submit="onSubmit"
    >
      <template #footer>
        <p class="text-center text-sm">
          <ULink to="/login" class="text-primary font-medium">{{ t('reset.backToSignIn') }}</ULink>
        </p>
      </template>
    </UAuthForm>

    <template #foot>
      {{ t('reset.foot') }}
    </template>
  </AuthShell>
</template>
