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
        class="p-4 rounded-xl h-full flex flex-col gap-3"
        :class="bgCardSoft"
      >
        <!-- Quick add: notepad style, langsung ketik -->
        <div class="mb-2">
          <div v-if="isAdding" class="flex flex-col gap-1">
            <input
              ref="quickAddInput"
              v-model="draftTitle"
              type="text"
              placeholder="Tambahkan todolist..."
              class="w-full bg-white rounded-lg px-3 py-2 text-sm border border-transparent focus:border-gray-300 outline-none"
              @keydown.enter.prevent="commitDraft"
              @keydown.esc.prevent="cancelDraft"
              @blur="handleBlur"
            />
            <small class="pl-1 text-muted-foreground">
              Enter atau klik di luar untuk simpan, Esc untuk batal
            </small>
          </div>
          <button
            v-else
            type="button"
            class="text-sm text-left text-muted-foreground hover:text-foreground hover:cursor-pointer flex items-center gap-1"
            @click="startAdding"
          >
            <Icon name="material-symbols:add" class="w-4 h-4" />
            Tambah todo
          </button>
        </div>

        <div v-if="data.length === 0 && !isAdding">
          <label class="text-gray-500">Tidak ada data</label>
        </div>

        <template v-else>
          <template v-for="(item, index) in data.slice(0, 3)" :key="item.id">
            <div class="group flex items-start space-x-2 w-full">
              <div class="pt-0.5">
                <Checkbox
                  :id="`${item.id}`"
                  :model-value="item.isFinish"
                  @update:modelValue="
                    (val) => emit('finish', { values: item.id, isFinish: val })
                  "
                  class="border-ring hover:cursor-pointer focus:ring-0"
                />
              </div>

              <label
                class="flex flex-row w-full hover:cursor-pointer"
                :for="`${item.id}`"
              >
                <div class="flex w-full justify-between">
                  <p
                    :class="
                      item.isFinish ? 'line-through text-muted-foreground' : ''
                    "
                  >
                    {{ item.title }}
                  </p>
                </div>
                <Button variant="ghost" type="button" @click="emit('delete', item.id)">
                  <Icon name="material-symbols:delete" class="w-6 h-6" />
                </Button>
              </label>
            </div>

            <hr v-if="index !== data.length - 1 && index < 2" class="my-4" />
          </template>
        </template>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { functionHelper } from '@/utils/functionHelper.js';

const props = defineProps({
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

const emit = defineEmits(['finish', 'create', 'delete']);

const { camelCase } = functionHelper();

const isAdding = ref(false);
const draftTitle = ref('');
const quickAddInput = ref(null);
// dipakai supaya blur (klik di luar) tidak dobel-commit
// dengan Enter yang sudah menangani commit-nya sendiri
let committingViaEnter = false;

const startAdding = async () => {
  isAdding.value = true;
  draftTitle.value = '';
  await nextTick();
  quickAddInput.value?.focus();
};

// Enter: simpan lalu tetap fokus di input, biar bisa lanjut ketik todo berikutnya
const commitDraft = async () => {
  const title = draftTitle.value.trim();

  if (!title) {
    cancelDraft();
    return;
  }

  committingViaEnter = true;
  emit('create', { title, level: props.level });
  draftTitle.value = '';

  await nextTick();
  quickAddInput.value?.focus();
  committingViaEnter = false;
};

const cancelDraft = () => {
  isAdding.value = false;
  draftTitle.value = '';
};

// Blur (klik di luar form): auto-insert kalau ada isinya, lalu tutup form
const handleBlur = () => {
  if (committingViaEnter) return;

  const title = draftTitle.value.trim();
  if (title) {
    emit('create', { title, level: props.level });
  }

  isAdding.value = false;
  draftTitle.value = '';
};
</script>

<style></style>
