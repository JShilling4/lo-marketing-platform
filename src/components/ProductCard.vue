<script setup lang="ts">
import { computed, ref } from "vue";
import type { Product } from "../types/product";

const props = defineProps<{
  details: Product;
}>();

const tooltipShowing = ref<boolean>(false);
const primaryPreviewPath = computed(() => {
  try {
    const primaryImage = props.details.productImages.find(
      (image: any) => image.primary == 1
    );
    const preview = primaryImage?.filepaths.find(
      (filepath: any) => filepath.type == "preview"
    );
    return preview?.path;
  } catch (error) {
    /* shhhh */
  }
  return undefined;
});

const nameEllipsis = computed(() => {
  let name = props.details.name;
  if (name.length > 25) {
    return name.substring(0, 25) + "...";
  } else {
    return name;
  }
});

function checkOverflow() {
  if (props.details.name.length > 25) {
    tooltipShowing.value = true;
  } else {
    tooltipShowing.value = false;
  }
}
</script>

<template>
  <div class="productCard">
    <img :src="primaryPreviewPath" />
    <div class="productCard__footer">
      <div class="nameContainer">
        <h2 @mouseover="checkOverflow()" @mouseleave="tooltipShowing = false">
          {{ nameEllipsis }}
        </h2>
        <transition name="tooltip">
          <span v-if="tooltipShowing" class="tooltip">
            {{ props.details.name }}
          </span>
        </transition>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../assets/scss/mixins";

.productCard {
  position: relative;
  margin: 0 0 8rem;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
  width: var(--prodCard-width);
  transition: transform 0.6s;
  backface-visibility: hidden;
  transform: scale(0.97) translate3d(0, 0, 0) perspective(1px);
  -webkit-font-smoothing: subpixel-antialiased;

  img {
    display: block;
    width: 100%;
    margin: 0 auto;
    object-fit: cover;
    height: var(--prodCard-height);
    border: 1px solid white;
  }

  &:before {
    content: "";
    position: absolute;
    z-index: -1;
    top: -1px;
    left: -1px;
    height: 0;
    width: 0;
    padding: 1px;
    background-color: transparent;
    transition: background-color 0.3s, height 0.5s, width 0.5s;
  }

  &:hover:before {
    background-color: var(--teal-light);
    height: 100%;
    width: 100%;
  }

  &:hover {
    transform: translateY(-1rem) scale(1) translate3d(0, 0, 0);
  }

  &__footer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.5rem 2rem 1rem;
    background-color: #fff;
    .nameContainer {
      position: relative;
      h2 {
        font-size: 1.6rem;
        cursor: default;
      }
      .tooltip {
        position: absolute;
        bottom: 3rem;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.8);
        border-radius: 2rem;
        padding: 1rem 2rem;
      }
    }
  }

  button.duplicate {
    margin-left: 1rem;
  }
}
@include slideUpEnter("tooltip", 0, 3rem);
</style>
