<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Todolist</h1>
    <div v-if="loading" class="text-gray-500">
      <Icon name="material-symbols:hourglass-outline" class="mr-2" />
      Memuat data...
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
      <AppCardTodo
        v-for="item in levelTodo"
        :key="item.name"
        :data="filteredLevel(item.name)"
        :level="item.name"
        :colorCard="item.colorCard"
        :bgCardSoft="item.bgCardSoft"
        @finish="handleFinishTodolist"
        @create="handleCreateTodolist"
        @delete="handleDeleteTodolist"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppCardTodo from '@/components/organisms/AppCardTodo.vue';

import { todolistService } from '@/services/todolistService';

const { getTodolists, getTodolistFinish, createTodolist, deleteTodolist } =
  todolistService();
const { $swal } = useNuxtApp();

const loading = ref(true);
const search = ref('');
const level = ref('');
const sortOrder = ref('DESC');
const sortBy = ref('due_date');
const todolistData = ref([]);
const pendingUpdates = ref(new Map()); // set untuk update finish todo
let finishTimeout = null;

const levelTodo = [
  {
    name: 'Sangat Penting',
    colorCard: 'bg-red-500',
    bgCardSoft: 'bg-red-500/10',
  },
  {
    name: 'Cukup Penting',
    colorCard: 'bg-amber-500',
    bgCardSoft: 'bg-amber-500/10',
  },
  { name: 'Penting', colorCard: 'bg-blue-400', bgCardSoft: 'bg-blue-400/10' },
  {
    name: 'Tidak Penting',
    colorCard: 'bg-green-500',
    bgCardSoft: 'bg-green-500/10',
  },
];

const handleGetTodolistsByLevel = async (levelParams) => {
  try {
    const res = await getTodolists({
      search: search.value,
      level: levelParams || level.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    });

    todolistData.value = res.data || [];
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

// Quick-add ala notepad dari AppCardTodo: cuma title + level, tanpa modal
const handleCreateTodolist = async ({ title, level: itemLevel }) => {
  // id sementara biar langsung kelihatan di card sebelum response server datang
  const tempId = `temp-${Date.now()}`;
  const optimisticTodo = {
    id: tempId,
    title,
    description: '',
    level: itemLevel,
    isFinish: false,
  };

  todolistData.value = [optimisticTodo, ...todolistData.value];

  try {
    const result = await createTodolist({ title, level: itemLevel });

    if (!result.success) {
      throw new Error(result.message || 'Gagal menambahkan todo');
    }

    // ganti data optimis dengan data asli dari server (id, createdAt, dll)
    const index = todolistData.value.findIndex((t) => t.id === tempId);
    if (index !== -1) {
      todolistData.value.splice(index, 1, result.data);
    }
  } catch (e) {
    // rollback kalau gagal
    todolistData.value = todolistData.value.filter((t) => t.id !== tempId);

    await $swal.fire({
      icon: 'error',
      title: 'Gagal menambahkan todo',
      text: e.message || 'Terjadi kesalahan tidak diketahui',
    });
  }
};

const handleDeleteTodolist = async (id) => {
  const confirm = await $swal.fire({
    icon: 'warning',
    title: 'Hapus list ini?',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
  });

  if (!confirm.isConfirmed) return;

  const findListRemoved = todolistData.value.find((v) => v.id === id);
  todolistData.value = todolistData.value.filter((v) => v.id !== id);

  try {
    const result = await deleteTodolist(id);
    if (result?.success === false) {
      throw new Error(result.message || 'Gagal menghapus Todo');
    }

    // await handleGetTodolistsByLevel(findListRemoved.level);
    await handleGetTodolistsByLevel();
  } catch (e) {
    if (findListRemoved) {
      todolistData.value = [...todolistData.value, findListRemoved];
    }

    await $swal.fire({
      icon: 'error',
      title: 'Gagal menghapus todo',
      text: e.message,
    });
  }
};

const handleFinishTodolist = async ({ values, isFinish }) => {
  const todo = todolistData.value.find((d) => d.id === values);
  if (!todo) return;

  const currentIsFinish = todo.isFinish;

  // Skip jika tidak ada perubahan
  if (!pendingUpdates.value.has(values)) {
    // simpan original state
    pendingUpdates.value.set(values, {
      originalIsFinish: currentIsFinish,
    });
  }

  // Optimistic Update
  todo.isFinish = isFinish;

  // Debounce
  if (finishTimeout) {
    clearTimeout(finishTimeout);
  }

  finishTimeout = setTimeout(async () => {
    try {
      const pending = pendingUpdates.value.get(values);
      const original = pending?.originalIsFinish;

      // Cek apakah nilai akhir sama dengan nilai awal
      if (original !== undefined && todo.isFinish === original) {
        pendingUpdates.value.delete(values);
        return;
      }

      const result = await getTodolistFinish({ isFinish }, values);

      if (!result.success) {
        throw new Error(result.message || 'Gagal mengupdate');
      }

      // Refresh hanya setelah sukses
      await handleGetTodolistsByLevel();
    } catch (e) {
      console.error('Update gagal:', e);

      // Rollback
      const todoToRollback = todolistData.value.find((t) => t.id === values);
      if (todoToRollback) {
        const pending = pendingUpdates.value.get(values);
        if (pending?.originalIsFinish !== undefined) {
          todoToRollback.isFinish = pending.originalIsFinish;
        }
      }

      await $swal.fire({
        icon: 'error',
        title: 'Gagal mengupdate data',
        text: e.message || 'Terjadi kesalahan',
      });
    } finally {
      pendingUpdates.value.delete(values);
    }
  }, 1000);
};

const filteredLevel = (level) => {
  return todolistData.value.filter((item) => item.level === level);
};

onMounted(() => {
  handleGetTodolistsByLevel();
});
</script>

<style scoped></style>
