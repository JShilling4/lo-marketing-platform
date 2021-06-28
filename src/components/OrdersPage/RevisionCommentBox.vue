<template>
  <div class="comment-box">
    <div class="content">
      <label>Please describe your desired changes:</label>
      <text-area v-focus v-model="localComment" />
    </div>
    <div class="comment-box__controls">
      <app-button classes="btn btn-green" @click.native="$emit('add-revision-comment')" text="Send"/>
      <app-button classes="btn btn-red" @click.native="$emit('close')" text="Cancel" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'RevisionCommentBox',
  components: {
    'text-area': () => import('@/components/Shared/Inputs/TextArea'),
    'app-button': () => import('@/components/Shared/AppButton'),
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  computed: {
    localComment: {
      get() { return this.value; },
      set(localComment) { this.$emit('input', localComment); },
    },
  },
};
</script>

<style lang="scss" scoped>
.comment-box {
  padding: 0 2rem;
  .content {
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
  }
  label {
    margin-bottom: 1rem;
    color: #fff;
  }
  /deep/ .textArea {
    border: none;
    padding: 1rem;
    &:focus {
      outline: none;
      border: none;
    }
  }
  &__controls {
    display: flex;
    justify-content: space-between;
    padding: 0 0 1rem;
    background-color: #fff;
    .btn {
      width: 9rem;
        font-weight: 700;
        font-family: 'Nunito Sans', sans-serif;
    }
  }
}
</style>
