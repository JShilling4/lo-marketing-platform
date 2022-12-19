<script setup lang="ts">
const props = defineProps<{
  name: string;
  id?: string;
}>();

const emit = defineEmits<{
  (e: "remove-chip"): void;
}>();
</script>

<template>
  <span class="chipMarker">
    {{ props.name }}
    <span class="remover" @click="emit('remove-chip')">
      <i class="fas fa-times-circle"></i>
    </span>
  </span>
</template>

<style lang="scss" scoped>
@import "../assets/scss/mixins";

.chipMarker {
  color: #fff;
  background-color: var(--gray-dark);
  font-size: 12px;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  border-radius: 15rem;
  margin: 0 0.5rem 0;

  .remover {
    margin-left: 1rem;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
