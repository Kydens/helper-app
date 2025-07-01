<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Pesan dari API:</h1>
    <p class="mt-2 text-gray-700">{{ apiMessage }}</p>
  </div>
</template>

<script>
import { useRuntimeConfig } from '#app';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const config = useRuntimeConfig();
    const apiMessage = ref('Memuat...');

    onMounted(async () => {
      try {
        const data = await $fetch(`${config.public.apiBase}`);
        apiMessage.value = data.message;
      } catch (err) {
        console.error(err);
        apiMessage.value = 'Gagal mengambil data dari API.';
      }
    });

    return { apiMessage };
  },
};
</script>

<style scoped></style>
