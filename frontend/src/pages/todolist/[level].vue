<template>
  <div class="p-4">
    <NuxtLink v-if="parentRoute" :to="parentRoute">
      <Button variant="default">
        <Icon name="material-symbols:arrow-left-alt-rounded" class="w-5 h-5" />
        Kembali
      </Button>
    </NuxtLink>
    <h1 class="text-xl font-bold my-4">Todolist {{ levelTitle }}</h1>

    <!-- Table Level Todo -->
    <AppTable
      v-if="todoData"
      :columns="columns"
      :data="todoData.data"
      :pagination="todoData.paging"
      :search="search"
      :loading="loading"
      :sortBy="sortBy"
      :sortOrder="sortOrder"
      @refresh="
        () => {
          currentPage = 0;
          handleGetTodolists();
        }
      "
      @create="createData = true"
      @edit="handleDetailTodo"
      @delete="handleDeleteTodo"
      :canCreate="true"
      :canUpdate="true"
      :canDelete="true"
      @update:search="(v) => (search = v)"
      @update:page="(v) => (currentPage = v)"
      @update:sortBy="(v) => (sortBy = v)"
      @update:sortOrder="(v) => (sortOrder = v)"
    />

    <!-- Create Todo -->
    <ModalCreate
      :modalValue="createData"
      title="Todolist"
      :formSchema="formSchema"
      :initialValues="{ level: levelTitle, isFinish: 'false' }"
      @submitCreate="handleCreateTodo"
      @update:modalValue="(v) => (createData = v)"
    >
      <!-- title -->
      <FormField v-slot="{ componentField }" name="title">
        <FormItem>
          <FormLabel>Judul</FormLabel>
          <FormControl>
            <Input type="text" placeholder="title..." v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- description -->
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

      <!-- dueDate -->
      <FormField v-slot="{ componentField }" name="dueDate">
        <FormItem>
          <FormLabel>Due Date</FormLabel>
          <FormControl>
            <Input
              type="date"
              placeholder="dueDate..."
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- level -->
      <FormField
        v-slot="{ componentField }"
        name="level"
        :defaultValue="levelTitle"
      >
        <FormItem>
          <FormLabel>Level</FormLabel>
          <FormControl>
            <select
              class="border px-3 py-2 rounded w-full"
              v-bind="componentField"
            >
              <option value="Sangat Penting">Sangat Penting</option>
              <option value="Cukup Penting">Cukup Penting</option>
              <option value="Penting">Penting</option>
              <option value="Tidak Penting">Tidak Penting</option>
            </select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </ModalCreate>

    <!-- Modal Edit Todo -->
    <ModalEdit
      :modalValue="editData"
      title="Todolist"
      :formSchema="formSchema"
      :initialValues="todoDetails"
      @submitEdit="handleUpdateTodo"
      @update:modalValue="(v) => (editData = v)"
    >
      <!-- title -->
      <FormField v-slot="{ componentField }" name="title">
        <FormItem>
          <FormLabel>Judul</FormLabel>
          <FormControl>
            <Input type="text" placeholder="title..." v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- description -->
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

      <!-- dueDate -->
      <FormField v-slot="{ componentField }" name="dueDate">
        <FormItem>
          <FormLabel>Due Date</FormLabel>
          <FormControl>
            <Input
              type="date"
              placeholder="dueDate..."
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- level -->
      <FormField
        v-slot="{ value, handleChange, handleBlur }"
        name="level"
        :defaultValue="levelTitle"
      >
        <FormItem>
          <FormLabel>Level</FormLabel>
          <FormControl>
            <select
              class="border px-3 py-2 rounded w-full"
              :value="value"
              @change="handleChange"
              @blur="handleBlur"
            >
              <option value="Sangat Penting">Sangat Penting</option>
              <option value="Cukup Penting">Cukup Penting</option>
              <option value="Penting">Penting</option>
              <option value="Tidak Penting">Tidak Penting</option>
            </select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- finish -->
      <FormField
        v-slot="{ value, handleChange, handleBlur }"
        name="isFinish"
        :defaultValue="'false'"
      >
        <FormItem>
          <FormLabel>Status</FormLabel>
          <FormControl>
            <select
              class="border px-3 py-2 rounded w-full"
              :value="value"
              @change="handleChange"
              @blur="handleBlur"
            >
              <option value="true">Selesai</option>
              <option value="false">Belum Selesai</option>
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
import { useRoute } from 'vue-router';

import { functionHelper } from '@/utils/functionHelper';
import { todolistService } from '@/services/todolistService';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AppTable from '@/components/organisms/AppTable.vue';
import ModalCreate from '@/components/organisms/AppModals/ModalCreate.vue';
import ModalEdit from '@/components/organisms/AppModals/ModalEdit.vue';

const route = useRoute();
const { getFormattedDate, getRouteParentName, isActiveData } = functionHelper();
const {
  getTodolists,
  createTodolist,
  getDetailTodolist,
  updateTodolist,
  deleteTodolist,
} = todolistService();
const { $swal } = useNuxtApp();

const loading = ref(true);
const todoData = ref(null);
const todoDetails = ref({});

const search = ref('');
const currentPage = ref(0);
const sortBy = ref('created_at');
const sortOrder = ref('DESC');

const createData = ref(false);
const editData = ref(false);

const level = route.params.level;
const levelTitle =
  level
    .replace(/([A-Z]+)/g, ' $1')
    .charAt(0)
    .toUpperCase() + level.slice(1).replace(/([A-Z][a-z])/g, ' $1');

const parentRoute = computed(() => {
  const r = getRouteParentName(route);
  return r || null;
});

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(1).max(255),
    description: z.string().optional(),
    level: z.enum([
      'Sangat Penting',
      'Cukup Penting',
      'Penting',
      'Tidak Penting',
    ]),
    isFinish: z.enum(['true', 'false']),
    dueDate: z.coerce.date(),
  })
);

const columns = [
  { key: '__no', label: '#', sortable: true },
  { key: 'title', label: 'Judul Todo', sortable: true },
  { key: 'description', label: 'Deskripsi', sortable: true },
  {
    key: 'dueDate',
    label: 'Due Date',
    sortable: true,
    render: (date) => h('span', getFormattedDate(date)),
  },
  {
    key: 'level',
    label: 'Level',
  },
  {
    key: 'isFinish',
    label: 'Status',
    sortable: true,
    render: (value) =>
      isActiveData(value, {
        trueLabel: 'Selesai',
        falseLabel: 'Belum Selesai',
      }),
  },
  { key: 'actions', label: 'Aksi', sortable: false },
];

const handleCreateTodo = async (values) => {
  try {
    const result = await createTodolist(values);
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
        await handleGetTodolists();
      });
  } catch (e) {
    await $swal.fire({
      icon: 'error',
      title: 'Gagal menambahkan data',
      text: e.message || 'Terjadi kesalahan tidak diketahui',
    });
  }
};

const handleGetTodolists = async () => {
  loading.value = true;
  try {
    todoData.value = await getTodolists({
      page: currentPage.value,
      search: search.value,
      level: levelTitle,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    });
    console.log(todoData.value);
  } catch (e) {
    await $swal.fire({
      icon: 'error',
      title: 'Gagal mengambil data',
      text: e.message || 'Terjadi kesalahan diketahui',
    });
  } finally {
    loading.value = false;
  }
};

const handleDetailTodo = async (id) => {
  try {
    const detail = await getDetailTodolist(id);

    let dateStr = '';
    if (detail.data.dueDate) {
      dateStr = new Date(detail.data.dueDate).toISOString().split('T')[0];
    }
    todoDetails.value = JSON.parse(
      JSON.stringify({
        ...detail.data,
        isFinish: detail.data.isFinish ? true : false,
        dueDate: dateStr,
      })
    );
    console.log(todoDetails.value);
    editData.value = true;
  } catch (e) {
    await $swal.fire({
      icon: 'error',
      title: 'Gagal Mengambil Data',
      text: e.message || 'Terjadi kesalahan tidak diketahui',
    });
  }
};

const handleUpdateTodo = async (values) => {
  try {
    const id = values.id;
    const result = await updateTodolist(values, id);

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
        await handleGetTodolists();
      });
  } catch (e) {
    await $swal.fire({
      icon: 'error',
      title: 'Gagal mengupdate data',
      text: e.message || 'Terjadi kesalahan tidak diketahui',
    });
  }
};

const handleDeleteTodo = async (id) => {
  const confirm = await $swal.fire({
    icon: 'warning',
    title: `Hapus data ini?`,
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
  });

  if (confirm.isConfirmed) {
    try {
      await deleteTodolist(id);
      await handleGetTodolists();
      $swal.fire({
        title: 'Berhasil!',
        text: 'Data berhasil dihapus.',
        icon: 'success',
        timer: 1000,
        confirmButtonText: false,
      });
    } catch (e) {
      $swal.fire('Gagal menghapus data', e.message, 'error');
    }
  }
};

let debounceTimeout;
let isInitialFetch = true;
watch(
  [search, currentPage, sortBy, sortOrder],
  (
    [newSearch, newPage, newSortBy, newSortOrder],
    [oldSearch, oldPage, oldSortBy, oldSortOrder]
  ) => {
    if (isInitialFetch) {
      isInitialFetch = false;
      return;
    }

    if (newSearch !== oldSearch) {
      clearTimeout(debounceTimeout);

      debounceTimeout = setTimeout(() => {
        handleGetTodolists();
      }, 500);
    } else {
      handleGetTodolists();
    }
  },
  { immediate: true }
);

onMounted(handleGetTodolists);
</script>

<style scoped></style>
