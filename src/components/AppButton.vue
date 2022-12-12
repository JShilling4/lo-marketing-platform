<template>
  <button :class="props.classes">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  classes: string;
}>();
</script>

<style lang="scss" scoped>
.btn {
  background-color: transparent;
  border: 1px solid #000;
  border-radius: 2rem;
  font-weight: 600;
  padding: 1rem 2rem;
  text-align: center;
  /* min-width: 12rem; */
  transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
  cursor: pointer;
  &:focus,
  &:active {
    outline: none;
  }
  &.btn-orange {
    color: var(--orange);
    border-color: var(--orange);
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    &:hover {
      background-color: var(--orange);
      color: #fff;
    }
    &:focus,
    &:active {
      background-color: transparent;
      color: var(--orange);
      &:hover {
        background-color: var(--orange);
        color: #fff;
      }
    }
    &-fill {
      background-color: var(--orange);
      border-color: #fff;
      color: #fff;
    }
  }
  &.btn-black {
    color: #000;
    border-color: #000;
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    &:hover {
      background-color: #000;
      color: #fff;
    }
  }
  &.btn-white {
    color: #fff;
    border-color: #fff;
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    &:hover {
      background-color: #fff;
      color: #000;
    }
  }
  &.btn-blue {
    color: var(--linkBlue);
    border-color: var(--linkBlue);
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    &:hover {
      background-color: var(--linkBlue);
      color: #fff;
    }
  }
  &.btn-green {
    color: var(--teal-light);
    border-color: var(--teal-light);
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    &:hover {
      background-color: var(--teal-light);
      color: #fff;
    }
  }
  &.btn-red {
    color: var(--red);
    border-color: var(--red);
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    &:hover {
      background-color: var(--red);
      color: #fff;
    }
    &-fill {
      background-color: var(--red);
      color: #fff;
      border: none;
    }
  }
}
a.btn {
  padding-bottom: 0.25rem;
}
</style>
