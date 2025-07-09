<template>
  <Card class="w-full overflow-auto rounded border">
    <CardHeader class="flex items-center justify-between px-6 py-2 border-b">
      <Input
        v-model="internalSearch"
        @input="emit('update:search', internalSearch)"
        type="text"
        placeholder="Cari..."
        class="px-2 py-1 border rounded w-full max-w-sm"
      />
      <Button class="ml-4" @click="emit('refresh')">
        <Icon name="material-symbols:refresh" class="w-4 h-4 mr-1" />
        Refresh Data
      </Button>
    </CardHeader>

    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-2 text-left cursor-pointer"
              @click="col.sortable && handleSort(col.key)"
            >
              <div class="flex items-center gap-1">
                {{ col.label }}
                <Icon
                  v-if="col.sortable"
                  :name="
                    (col.key === '__no' && currentSortKey === 'created_at') ||
                    currentSortKey === col.key
                      ? currentSortOrder === 'ASC'
                        ? 'mdi:arrow-up'
                        : 'mdi:arrow-down'
                      : 'mdi:arrow-down'
                  "
                  class="w-4 h-4"
                />
              </div>
            </th>
          </TableRow>
        </TableHeader>
        <TableBody>
          <!-- loading state -->
          <TableRow v-if="loading">
            <td
              :colspan="columns.length"
              class="px-4 py-6 text-center text-gray-500"
            >
              <Icon name="material-symbols:hourglass-outline" class="mr-2" />
              Memuat data...
            </td>
          </TableRow>

          <!-- jika data kosong -->
          <TableRow v-else-if="!data?.length">
            <td
              :colspan="columns.length"
              class="px-4 py-6 text-center font-semibold"
            >
              Data kosong
            </td>
          </TableRow>

          <TableRow v-for="(row, i) in data" :key="row.id || i">
            <td v-for="col in columns" :key="col.key" class="px-4 py-2">
              <template v-if="col.key === '__no'">
                {{
                  i +
                  1 +
                  (pagination?.currentPage ?? 0) * (pagination?.size ?? 10)
                }}
              </template>
              <template v-else-if="col.key === 'actions'">
                <div class="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    class="bg-chart-4"
                    @click="emit('edit', row)"
                  >
                    <Icon name="material-symbols:edit" class="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    @click="emit('delete', row)"
                  >
                    <Icon name="material-symbols:delete" class="w-4 h-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </template>
              <template v-else-if="col.render">
                <component :is="col.render(row[col.key])" />
              </template>
              <template v-else>
                {{ row[col.key] ?? '-' }}
              </template>
            </td>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>

    <CardFooter class="flex justify-between items-center px-4 py-3 border-t">
      <p>
        Menampilkan
        {{
          pagination?.size <= pagination?.size
            ? pagination?.total
            : pagination?.size
        }}
        data pada halaman {{ pagination?.currentPage + 1 }} dari total
        {{ pagination?.total }} data
      </p>
      <div class="flex items-center gap-2">
        <Button
          size="sm"
          :disabled="currentPage === 0"
          @click="emit('update:page', currentPage - 1)"
        >
          <Icon name="material-symbols:chevron-left" class="w-4 h-4" />
        </Button>

        <Button
          v-for="p in paginationPages"
          :key="p"
          size="sm"
          :variant="p === currentPage ? 'default' : 'outline'"
          :disabled="p === -1"
          @click="p !== -1 && emit('update:page', p)"
        >
          <span v-if="p === -1">...</span>
          <span v-else>{{ p + 1 }}</span>
        </Button>

        <Button
          size="sm"
          :disabled="currentPage + 1 >= totalPage"
          @click="emit('update:page', currentPage + 1)"
        >
          <Icon name="material-symbols:chevron-right" class="w-4 h-4" />
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>

<script setup>
const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  pagination: {
    type: Object,
    required: true,
  },
  search: {
    type: String,
    default: '',
  },
  sortBy: {
    type: String,
    default: '',
  },
  sortOrder: {
    type: String,
    default: '',
  },
});

const emit = defineEmits([
  'edit',
  'delete',
  'refresh',
  'update:search',
  'update:page',
  'update:sortBy',
  'update:sortOrder',
]);

import { ref, watch } from 'vue';
import { Table, TableHeader, TableBody, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';

const internalSearch = ref(props.search || '');
const currentPage = computed(() => props.pagination?.currentPage ?? 0);
const totalPage = computed(() => props.pagination?.totalPage ?? 1);
const currentSortKey = computed(() => props.sortBy);
const currentSortOrder = computed(() => props.sortOrder);

watch(
  () => props.search,
  (val) => (internalSearch.value = val)
);

const paginationPages = computed(() => {
  const pages = [];

  if (totalPage.value <= 5) {
    for (let i = 0; i < totalPage.value; i++) pages.push(i);
  } else if (currentPage.value <= 2) {
    pages.push(0, 1, 2, 3, 4, -1, totalPage.value - 1);
  } else if (currentPage.value >= totalPage.value - 3) {
    pages.push(
      0,
      -1,
      totalPage.value - 5,
      totalPage.value - 4,
      totalPage.value - 3,
      totalPage.value - 2,
      totalPage.value - 1
    );
  } else {
    pages.push(
      0,
      -1,
      currentPage.value - 1,
      currentPage.value,
      currentPage.value + 1,
      -1,
      totalPage.value - 1
    );
  }

  return pages;
});

const handleSort = (key) => {
  if (key === '__no') {
    if (currentSortKey.value === 'created_at') {
      emit(
        'update:sortOrder',
        currentSortOrder.value === 'ASC' ? 'DESC' : 'ASC'
      );
    } else {
      emit('update:sortBy', 'created_at');
      emit('update:sortOrder', 'ASC');
    }
    return;
  }

  if (key === currentSortKey.value) {
    emit('update:sortOrder', currentSortOrder.value === 'ASC' ? 'DESC' : 'ASC');
  } else {
    emit('update:sortBy', key);
    emit('update:sortOrder', 'ASC');
  }
};
</script>
