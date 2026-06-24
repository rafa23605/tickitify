<script setup lang="ts">
definePageMeta({ layout: 'storefront' })

const route = useRoute()
const org = computed(() => String(route.params.org))

const email = ref('')
const sent = ref(false)
const valid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
const submit = () => { if (valid.value) sent.value = true }

useHead({ title: 'Přihlášení · Tickitify' })
</script>

<template>
  <div class="px-6 py-10 min-h-[70vh] flex flex-col items-center text-center">
    <!-- enter email -->
    <template v-if="!sent">
      <div class="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
        <UIcon name="i-lucide-user-round" class="size-7" />
      </div>
      <h1 class="text-xl font-bold text-highlighted mt-5">Přihlášení k účtu</h1>
      <p class="text-sm text-muted mt-1.5 max-w-xs">
        Zadejte e-mail a pošleme vám přihlašovací odkaz. Žádné heslo nepotřebujete.
      </p>

      <div class="w-full max-w-sm mt-7 text-left">
        <UFormField label="E-mail">
          <UInput v-model="email" type="email" placeholder="vas@email.cz" size="lg" class="w-full" autofocus @keyup.enter="submit" />
        </UFormField>
        <UButton
          class="mt-4 justify-center"
          block
          size="lg"
          color="primary"
          label="Poslat přihlašovací odkaz"
          :disabled="!valid"
          @click="submit"
        />
      </div>

      <p class="text-xs text-muted mt-6 max-w-xs">
        Účet se vytvoří automaticky při prvním nákupu — přihlašujete se stejným e-mailem.
      </p>
    </template>

    <!-- link sent -->
    <template v-else>
      <div class="size-14 rounded-2xl bg-success/10 text-success flex items-center justify-center">
        <UIcon name="i-lucide-mail-check" class="size-7" />
      </div>
      <h1 class="text-xl font-bold text-highlighted mt-5">Zkontrolujte e-mail</h1>
      <p class="text-sm text-muted mt-1.5 max-w-xs">
        Přihlašovací odkaz jsme poslali na <span class="font-medium text-toned">{{ email }}</span>. Platí 15 minut.
      </p>

      <div class="w-full max-w-sm mt-7 flex flex-col gap-2.5">
        <UButton :to="`/s/${org}/account`" block size="lg" color="primary" label="Otevřít účet (demo)" icon="i-lucide-arrow-right" trailing />
        <UButton block size="lg" color="neutral" variant="subtle" label="Změnit e-mail" @click="sent = false" />
      </div>

      <p class="text-xs text-dimmed mt-6 max-w-xs">
        Prototyp — odkaz se v reálu doručí e-mailem. Tlačítko výše ho simuluje.
      </p>
    </template>
  </div>
</template>
