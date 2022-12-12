<template>
  <input class="textInput" :value="modelValue" @input="handleInput" />
</template>

<script setup lang="ts">
export type PropTypes = {
  modelValue: string | number;
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
.textInput {
  background-color: #fff;
  outline: none;
  &:focus {
    border: 1px solid var(--teal-light);
  }
}
</style>
