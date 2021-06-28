<template>
  <img
    :src="avatarUrl"
    :width="imageWidth"
    :class="['avatar', computedSize]"
    @error="setAltImage"
    ref="avatarImage"
  />
</template>

<script>
export default {
  name: 'AppAvatar',
  props: {
    avatarUrl: {
      type: String,
      default: '',
    },
    imageWidth: {
      type: String,
      default: '35px',
    },
    fallback: {
      type: Function,
    },
    size: {
      type: String,
    },
  },
  computed: {
    computedSize() {
      if (this.size === 'large') {
        return 'avatar--large';
      }
      if (this.size === 'small') {
        return 'avatar--small';
      }
      return 'avatar--large';
    },
  },
  methods: {
    setAltImage() {
      this.$refs.avatarImage.src = 'https://a.ruoff.com/image/blah/size/100/type/ShortcutIcon';
    },
  },
};
</script>

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
