<script setup lang="ts">
const props = defineProps<{
  rating: number;
}>();
</script>

<template>
  <div>
    <img
      height="20"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Gold_Star.svg/2048px-Gold_Star.svg.png"
      v-for="index in props.rating"
      :key="index"
    />
    <img
      height="20"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Star_empty.svg/471px-Star_empty.svg.png"
      v-for="index in 5 - props.rating"
      :key="index"
    />
  </div>
</template>
