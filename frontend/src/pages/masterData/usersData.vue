<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Data Users</h1>
    <AppTable
      v-if="res?.data?.length"
      :columns="columns"
      :data="res.data || []"
      @refresh="getUsers"
    />
    <div v-else-if="loading" class="text-gray-500">
      <Icon name="material-symbols:hourglass-outline" />
      Memuat data...
    </div>
    <div v-else class="font-bold">Data kosong</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { functionHelper } from '@/utils/functionHelper';
import { useApiFetch } from '@/composables/useApiFetch';
import AppTable from '@/components/organisms/AppTable.vue';

const loading = ref(true);
const res = ref(null);
const { isActiveRender } = functionHelper();

onMounted(async () => {
  loading.value = true;
  try {
    const result = await useApiFetch('/api/users');
    console.log('[DEBUG] Fetched result:', result);
    res.value = result;
  } catch (e) {
    await $swal.fire({
      icon: 'error',
      title: 'Gagal Mengambil Data',
      text: e.message || 'Terjadi kesalahan tidak diketahui',
    });
  } finally {
    loading.value = false;
  }
});

const columns = [
  { key: '__no', label: '#' },
  { key: 'fullname', label: 'Nama Lengkap' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'telphone', label: 'No. Telp' },
  {
    key: 'isActive',
    label: 'isActive',
    render: (value) => isActiveRender(value),
  },
];
</script>

<style></style>
