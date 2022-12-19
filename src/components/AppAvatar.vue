<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  avatarUrl: string;
  size: string;
}>();

const computedSize = computed(() => {
  if (props.size === "large") {
    return "avatar--large";
  }
  if (props.size === "small") {
    return "avatar--small";
  }
  return "avatar--large";
});
</script>

<template>
  <img
    :src="avatarUrl"
    width="35"
    :class="['avatar', computedSize]"
    ref="avatarImage"
  />
</template>

<style lang="scss" scoped>
.avatar {
  border: 2px solid lightgray;
  border-radius: 50%;
  &--large {
    width: 6.5rem;
  }
  &--small {
    width: 3.5rem;
  }
}
</style>
