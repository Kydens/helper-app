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
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppCardTodo from '@/components/organisms/AppCardTodo.vue';

import { todolistService } from '@/services/todolistService';

const { getTodolists } = todolistService();
const { $swal } = useNuxtApp();

const loading = ref(true);
const search = ref('');
const level = ref('');
const sortOrder = ref('DESC');
const sortBy = ref('due_date');
const todolistData = ref(null);
let finishTimeout;

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

const handleGetTodolists = async (levelParams) => {
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

const handleFinishTodolist = ({ id, isFinish }) => {
  clearTimeout(finishTimeout);
  finishTimeout = setTimeout(() => {
    console.log('Updated Todo:', id, isFinish);
    // service disini
  }, 1000);
};

const filteredLevel = (level) => {
  return todolistData.value.filter((item) => item.level === level);
};

onMounted(() => {
  handleGetTodolists();
});
</script>

<style scoped></style>
