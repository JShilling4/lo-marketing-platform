<template>
  <div class="guidanceTip" v-on-clickaway="close">
    <i class="fas fa-times closer" @click="close"></i>
    <span class="title">{{ title }}</span>
    <p class="bodyText" v-html="bodyText"></p>
  </div>
</template>

<script>
// mixins
import { mixin as clickaway } from 'vue-clickaway';

export default {
  name: 'GuidanceTip',
  mixins: [clickaway],
  props: {
    title: {
      type: String,
      default: '',
    },
    bodyText: {
      type: String,
      required: true,
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.guidanceTip {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: $orange;
  color: #fff;
  padding: 1rem;
  border-radius: 10px;
  z-index: 100;
  @include breakpoint(mobile) {
    width: 90%;
  }
  .title {
    display: block;
    margin-bottom: .5rem;
    font-weight: 600;
  }
  .closer {
    position: absolute;
    top: 1rem;
    right: 1rem;
    cursor: pointer;
  }
}
</style>
