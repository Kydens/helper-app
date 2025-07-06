<template>
  <div class="w-full overflow-auto rounded border">
    <Table>
      <TableHeader>
        <TableRow>
          <th v-for="col in columns" :key="col.key" class="px-4 py-2 text-left">
            {{ col.label }}
          </th>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(row, i) in data" :key="i">
          <td v-for="col in columns" :key="col.key" class="px-4 py-2">
            <component v-if="col.render" :is="col.render(row[col.key])" />
            <span v-else>
              {{ col.key === '__no' ? i + 1 : (row[col.key] ?? '-') }}
            </span>
          </td>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});

console.log('AppTable loaded');

import { Table, TableHeader, TableBody, TableRow } from '@/components/ui/table';
</script>
