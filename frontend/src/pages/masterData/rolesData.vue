<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Data Roles</h1>

    <AppTable
      v-if="roleData"
      :columns="columns"
      :data="roleData.data"
      :pagination="roleData.paging"
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
          handleGetRoles();
        }
      "
      @create="createData = true"
      @edit="handleDetailRole"
      @delete="handleDeleteRole"
      @update:search="(v) => (search = v)"
      @update:page="(v) => (currentPage = v)"
      @update:sortBy="(v) => (sortBy = v)"
      @update:sortOrder="(v) => (sortOrder = v)"
    />

    <!-- Create Role -->
    <ModalCreate
      :modalValue="createData"
      title="Role"
      :formSchema="formSchema"
      @submitCreate="handleCreateRole"
      @update:modalValue="(v) => (createData = v)"
    >
      <!-- nama role -->
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Nama Role</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="nama role..."
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- alias -->
      <FormField v-slot="{ componentField }" name="alias">
        <FormItem>
          <FormLabel>Alias</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="alias role..."
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- deskripsi -->
      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="description..."
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
              <option value="true">Aktif</option>
              <option value="false">Tidak Aktif</option>
            </select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </ModalCreate>

    <!-- Update Role -->
    <ModalEdit
      :modalValue="editData"
      title="Role"
      :formSchema="formSchema"
      :initialValues="RoleDetails"
      @submitEdit="handleUpdateRole"
      @update:modalValue="(v) => (editData = v)"
    >
      <!-- nama role -->
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Nama Role</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="nama role..."
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- alias -->
      <FormField v-slot="{ componentField }" name="alias">
        <FormItem>
          <FormLabel>Alias</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="alias role..."
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- deskripsi -->
      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="description..."
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
              <option value="true">Aktif</option>
              <option value="false">Tidak Aktif</option>
            </select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </ModalEdit>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { useForm } from 'vee-validate';

import { functionHelper } from '@/utils/functionHelper';
import { rolesService } from '@/services/rolesService';

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
import ModalEdit from '@/components/organisms/AppModals/ModalEdit.vue';

const { isActiveRender } = functionHelper();
const { createRole, getRoles, getDetailRole, updateRole, deleteRole } =
  rolesService();
const { $swal } = useNuxtApp();

const loading = ref(true);
const roleData = ref(null);
const RoleDetails = ref({});

const search = ref('');
const currentPage = ref(0);
const sortBy = ref('created_at');
const sortOrder = ref('DESC');

const createData = ref(false);
const editData = ref(false);

const columns = [
  { key: '__no', label: '#', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'alias', label: 'Alias', sortable: true },
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
    name: z.string(),
    alias: z.string(),
    description: z.string().max(255),
    isActive: z.enum(['true', 'false']).default('true'),
  })
);

const handleCreateRole = async (values) => {
  try {
    const result = await createRole(values);

    if (!result.success) throw new Error(result.message || 'Gagal menambahkan');

    createData.value = false;

    await $swal
      .fire({
        icon: 'success',
        title: 'Berhasil!',
        text: result.message || 'Berhasil menambahkan data',
        showConfirmButton: false,
        timer: 1000,
      })
      .then(async () => {
        await handleGetRoles();
      });
  } catch (e) {
    await $swal.fire({
      icon: 'error',
      title: 'Gagal menambahkan data',
      text: e.message || 'Terjadi kesalahan tidak diketahui',
    });
  }
};

const handleGetRoles = async () => {
  loading.value = true;
  try {
    roleData.value = await getRoles({
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

const handleDetailRole = async (id) => {
  console.log('[DEBUG] ID yg diklik:', id); // ⬅️ Tambahkan ini

  try {
    const detail = await getDetailRole(id);
    RoleDetails.value = JSON.parse(
      JSON.stringify({
        ...detail.data,
        isActive: detail.data.isActive ? 'true' : 'false',
      })
    );
    editData.value = true;
  } catch (e) {
    await $swal.fire({
      icon: 'error',
      title: 'Gagal Mengambil Data',
      text: e.message || 'Terjadi kesalahan tidak diketahui',
    });
  }
};

const handleUpdateRole = async (values) => {
  try {
    const id = values.id;
    const result = await updateRole(values, id);

    if (!result.success) throw new Error(result.message || 'Gagal mengupdate');

    editData.value = false;

    await $swal
      .fire({
        icon: 'success',
        title: 'Berhasil!',
        text: result.message || 'Berhasil mengupdate data',
        showConfirmButton: false,
        timer: 1000,
      })
      .then(async () => {
        await handleGetRoles();
      });
  } catch (e) {
    await $swal.fire({
      icon: 'error',
      title: 'Gagal mengupdate data',
      text: e.message || 'Terjadi kesalahan tidak diketahui',
    });
  }
};

const handleDeleteRole = async (id) => {
  const confirm = await $swal.fire({
    icon: 'warning',
    title: `Hapus data ini?`,
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
  });

  if (confirm.isConfirmed) {
    try {
      await deleteRole(id);
      await handleGetRoles();
      await $swal.fire({
        title: 'Berhasil!',
        text: 'Data berhasil dihapus.',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (e) {
      await $swal.fire({
        title: 'Gagal menghapus data',
        text: e.message,
        icon: 'error',
      });
    }
  }
};

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
        handleGetRoles();
      }, 500);
    } else {
      handleGetRoles();
    }
  },
  { immediate: true }
);

onMounted(handleGetRoles);
</script>
