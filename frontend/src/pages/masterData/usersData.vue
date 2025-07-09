<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Data Users</h1>

    <AppTable
      v-if="user"
      :columns="columns"
      :data="user.data"
      :pagination="user.paging"
      :search="search"
      :loading="loading"
      :sortBy="sortBy"
      :sortOrder="sortOrder"
      :canCreate="true"
      :canUpdate="true"
      :canDelete="true"
      @refresh="
        () => {
          currentPage = 0;
          handleGetUsers();
        }
      "
      @create="createData = true"
      @edit="handleEditUser"
      @delete="handleDeleteUser"
      @update:search="(v) => (search = v)"
      @update:page="(v) => (currentPage = v)"
      @update:sortBy="(v) => (sortBy = v)"
      @update:sortOrder="(v) => (sortOrder = v)"
    />

    <ModalCreate
      :modalValue="createData"
      title="User"
      :formSchema="formSchema"
      @submit="handleCreateUser"
      @update:modalValue="(v) => (createData = v)"
    >
      <!-- nama lengkap -->
      <FormField v-slot="{ componentField }" name="fullname">
        <FormItem>
          <FormLabel>Fullname</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="fullname..."
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- username -->
      <FormField v-slot="{ componentField }" name="username">
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="username..."
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- email -->
      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              type="email"
              placeholder="email..."
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- password -->
      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="password..."
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- telphone -->
      <FormField v-slot="{ componentField }" name="telphone">
        <FormItem>
          <FormLabel>No. Telepon (Optional)</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="nomor telepon..."
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- status -->
      <FormField
        v-slot="{ componentField }"
        name="isActive"
        :defaultValue="'true'"
      >
        <FormItem>
          <FormLabel>Status</FormLabel>
          <FormControl>
            <select
              class="border px-3 py-2 rounded w-full"
              v-bind="componentField"
            >
              <option :value="'true'">Aktif</option>
              <option :value="'false'">Tidak Aktif</option>
            </select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </ModalCreate>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { useRouter } from 'vue-router';

import { functionHelper } from '@/utils/functionHelper';
import { usersService } from '@/services/usersService';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppTable from '@/components/organisms/AppTable.vue';
import ModalCreate from '@/components/organisms/AppModals/ModalCreate.vue';

const { isActiveRender } = functionHelper();
const { createUser, getUsers, deleteUser } = usersService();
const { $swal } = useNuxtApp();
const loading = ref(true);
const user = ref(null);

const search = ref('');
const currentPage = ref(0);
const sortBy = ref('created_at');
const sortOrder = ref('DESC');

const createData = ref(false);

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

const formSchema = toTypedSchema(
  z.object({
    fullname: z.string().optional(),
    username: z.string().min(4, 'Minimal 4 karaker!').max(255),
    email: z.string().email(),
    password: z.string().min(8, 'Minimal 8 karakter'),
    telphone: z.string().optional(),
    isActive: z.enum(['true', 'false']).transform((val) => val === 'true'),
  })
);

const handleCreateUser = async (values) => {
  try {
    const result = await createUser(values);

    if (!result.success) throw new Error(result.message || 'Gagal menambahkan');

    createData.value = false;

    $swal
      .fire({
        icon: 'success',
        title: result.message || 'Berhasil menambahkan data',
        showConfirmButton: false,
        timer: 1000,
      })
      .then(async () => {
        await handleGetUsers();
      });
  } catch (e) {
    await $swal.fire({
      icon: 'error',
      title: 'Gagal menambahkan data',
      text: e.message || 'Terjadi kesalahan tidak diketahui',
    });
  }
};

const handleGetUsers = async () => {
  loading.value = true;
  try {
    user.value = await getUsers({
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

const handleEditUser = (id) => {
  console.log('Edit user:', id);
};

const handleDeleteUser = async (id) => {
  const confirm = await $swal.fire({
    icon: 'warning',
    title: `Hapus data ini?`,
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
  });

  if (confirm.isConfirmed) {
    try {
      await deleteUser(id);
      await handleGetUsers();
      $swal.fire('Berhasil!', 'Data berhasil dihapus.', 'success');
    } catch (e) {
      $swal.fire('Gagal menghapus data', e.message, 'error');
    }
  }
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
