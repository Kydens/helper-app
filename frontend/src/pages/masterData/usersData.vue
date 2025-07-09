<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Data Users</h1>

    <AppTable
      v-if="res"
      :columns="columns"
      :data="res.data"
      :pagination="res.paging"
      :search="search"
      :loading="loading"
      :sortBy="sortBy"
      :sortOrder="sortOrder"
      @refresh="
        () => {
          currentPage = 0;
          handleGetUsers();
        }
      "
      @edit="handleEditUser"
      @delete="handleDeleteUser"
      @update:search="(v) => (search = v)"
      @update:page="(v) => (currentPage = v)"
      @update:sortBy="(v) => (sortBy = v)"
      @update:sortOrder="(v) => (sortOrder = v)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import AppTable from '@/components/organisms/AppTable.vue';
import { functionHelper } from '@/utils/functionHelper';
import { usersService } from '@/services/usersService';

const { isActiveRender } = functionHelper();
const { getUsers, deleteUser } = usersService();
const { $swal } = useNuxtApp();

const loading = ref(true);
const res = ref(null);

const search = ref('');
const currentPage = ref(0);
const sortBy = ref('created_at');
const sortOrder = ref('DESC');

const columns = [
  { key: '__no', label: '#', sortable: true },
  { key: 'fullname', label: 'Nama Lengkap', sortable: true },
  { key: 'username', label: 'Username', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'telphone', label: 'No. Telp', sortable: true },
  {
    key: 'isActive',
    label: 'Status',
    render: (value) => isActiveRender(value),
  },
  {
    key: 'actions',
    label: 'Aksi',
    sortable: false,
  },
];

const handleGetUsers = async () => {
  loading.value = true;
  try {
    console.log('fetching with', {
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    });
    res.value = await getUsers({
      page: currentPage.value,
      search: search.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    });
  } catch (e) {
    await $swal.fire({
      icon: 'error',
      title: 'Gagal Mengambil Data',
      text: e.message || 'Terjadi kesalahan tidak diketahui',
    });
  } finally {
    loading.value = false;
  }
};

const handleDeleteUser = async (user) => {
  const confirm = await $swal.fire({
    icon: 'warning',
    title: `Hapus data ${user.fullname}?`,
    text: 'Data ini akan dihapus secara soft delete',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
  });

  if (confirm.isConfirmed) {
    try {
      await deleteUser(user.id);
      await handleGetUsers();
      $swal.fire('Berhasil!', 'Data berhasil dihapus.', 'success');
    } catch (e) {
      $swal.fire('Gagal menghapus data', e.message, 'error');
    }
  }
};

const handleEditUser = (user) => {
  console.log('Edit user:', user);
};

console.log({
  currentSortKey: sortBy.value,
  currentSortOrder: sortOrder.value,
});

let debounceTimeout;
watch(
  [search, currentPage, sortBy, sortOrder],
  (
    [newSearch, newPage, newSortBy, newSortOrder],
    [oldSearch, oldPage, oldSortBy, oldSortOrder]
  ) => {
    if (newSearch !== oldSearch) {
      clearTimeout(debounceTimeout);

      debounceTimeout = setTimeout(() => {
        handleGetUsers();
      }, 500);
    } else {
      handleGetUsers();
    }
  },
  { immediate: true }
);

onMounted(handleGetUsers);
</script>
