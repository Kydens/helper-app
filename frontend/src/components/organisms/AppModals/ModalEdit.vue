<template>
  <Form
    v-slot="{ handleSubmit }"
    :validation-schema="formSchema"
    :initial-values="initialValues"
    :key="modalValue ? 'form-open' : 'form-closed'"
    as="form"
    id="edit-form"
  >
    <Dialog
      :open="modalValue"
      @update:open="(v) => emit('update:modalValue', v)"
    >
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader class="border-b-2 border-seconday pb-2">
          <DialogTitle class="font-bold">Edit {{ title }}</DialogTitle>
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
            Save
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
import { useForm } from 'vee-validate';

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
  initialValues: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modalValue', 'submitEdit']);

const { handleSubmit, resetForm } = useForm({
  validationSchema: props.formSchema,
  initialValues: props.initialValues,
});

watch(
  () => props.modalValue,
  async (isOpen) => {
    if (isOpen) {
      await nextTick();
      setTimeout(() => {
        resetForm({
          values: {
            ...props.initialValues,
            isActive: props.initialValues.isActive ? 'true' : 'false',
          },
        });
      }, 0);
    }
  }
);

const handleSubmitForm = (values) => {
  emit('submitEdit', { ...values, id: props.initialValues.id });
  emit('update:modalValue', false);
};
</script>

<style></style>
