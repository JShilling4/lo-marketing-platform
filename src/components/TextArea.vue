<template>
  <textarea class="textArea" :value="modelValue" @input="handleInput" />
</template>

<script setup lang="ts">
export type PropTypes = {
  modelValue: string;
};

withDefaults(defineProps<PropTypes>(), {
  modelValue: "",
});

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit("update:modelValue", value);
};
</script>

<style lang="scss" scoped>
.textArea {
  background-color: #fff;
  outline: none;
  height: 10rem;
  resize: none;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;

  &:focus {
    border: 1px solid var(--teal-light);
  }
}
</style>
