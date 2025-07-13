<template>
  <Form
    v-slot="{ handleSubmit }"
    as="form"
    keep-values
    :validation-schema="formSchema"
  >
    <Dialog
      :open="modalValue"
      @update:open="(v) => emit('update:modalValue', v)"
    >
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader class="border-b-2 border-seconday pb-2">
          <DialogTitle class="font-bold">Tambah {{ title }}</DialogTitle>
        </DialogHeader>

        <div id="submitForm" class="flex flex-col gap-4 px-2 overflow-y-auto">
          <slot />
        </div>

        <DialogFooter>
          <DialogClose as-child>
            <Button
              type="button"
              variant="outline"
              class="transition-all hover:cursor-pointer"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            type="submit"
            @click="handleSubmit(handleSubmitForm)"
            class="transition-all hover:cursor-pointer"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Form>
</template>

<script setup>
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

const props = defineProps({
  modalValue: {
    type: Boolean,
    required: true,
    default: false,
  },
  title: {
    type: String,
    required: true,
    default: '',
  },
  formSchema: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modalValue', 'submitCreate']);

const handleSubmitForm = (values) => {
  emit('submitCreate', values);
  emit('update:modalValue', false);
};
</script>

<style></style>
