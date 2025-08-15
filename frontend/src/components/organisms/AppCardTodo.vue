<template>
  <Card class="p-0 flex flex-col gap-1 h-full w-full">
    <CardHeader
      class="py-4 px-6 rounded-t-xl flex justify-between items-center"
      :class="colorCard"
    >
      <h3 class="text-md font-medium text-white">{{ level }}</h3>
      <div class="flex gap-2 items-center">
        <NuxtLink
          :to="`/todolist/${camelCase(level)}`"
          class="text-white hover:cursor-pointer hover:underline"
        >
          View
        </NuxtLink>

        <h3
          class="text-sm font-medium text-white px-3 py-2 rounded bg-white/25"
        >
          {{ data.length }}
        </h3>
      </div>
    </CardHeader>

    <CardContent class="bg-white pt-2 pb-3 px-4 rounded-b-xl w-full h-full">
      <div
        v-if="data.length === 0"
        class="p-4 rounded-xl h-full"
        :class="bgCardSoft"
      >
        <label class="text-gray-500">Tidak ada data</label>
      </div>

      <div v-else class="p-4 rounded-xl flex-col h-full" :class="bgCardSoft">
        <template v-for="(item, index) in data" :key="item.id">
          <div class="flex items-start space-x-2 w-full cursor-pointer">
            <div class="pt-0.5">
              <Checkbox
                :id="`${item.id}`"
                v-model="item.isFinish"
                @update:modelValue="
                  (val) => emit('finish', { id: item.id, isFinish: val })
                "
                class="border-ring hover:cursor-pointer focus:ring-0"
              />
            </div>

            <label class="flex flex-col w-full" :for="`${item.id}`">
              <div class="flex w-full justify-between">
                <p
                  :class="
                    item.isFinish ? 'line-through text-muted-foreground' : ''
                  "
                >
                  {{ item.title }}
                </p>
              </div>
              <small
                class="text-muted-foreground line-clamp-3"
                :class="
                  item.isFinish ? 'line-through text-muted-foreground' : ''
                "
              >
                {{ item.description }}
              </small>
            </label>
          </div>

          <hr v-if="index !== data.length - 1" class="my-4" />
        </template>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  colorCard: {
    type: String,
    required: true,
  },
  bgCardSoft: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['finish']);

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { functionHelper } from '@/utils/functionHelper.js';

const { camelCase } = functionHelper();
</script>

<style></style>
