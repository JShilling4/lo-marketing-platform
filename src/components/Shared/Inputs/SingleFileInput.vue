<template>
  <div class="upload-wrapper">
    <app-button
      classes="btn btn-orange"
      @click.native="$refs.fileInput.click()"
      :text="buttonText"
    />
    <input
      type="file"
      ref="fileInput"
      :name="name"
      @input="onFileChange"
      :disabled="isDisabled"
    />
    <div v-if="showFileName" class="uploadFileName-wrapper">
      <img src="@/assets/images/document_icon.png" />
      <span class="uploadFileName --uploadEmpty">
        {{ formatFileName }}
      </span>
    </div>
    <slot name="removal-button"></slot>
  </div>
</template>

<script>
export default {
  name: 'SingleFileInput',
  components: {
    'app-button': () => import('@/components/Shared/AppButton'),
  },
  props: {
    buttonText: String,
    buttonSize: {
      type: String,
      // default: 'small',
    },
    name: String,
    fileName: [String, File],
    isDisabled: Boolean,
    showFileName: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      localFileName: '',
      file: null,
    };
  },
  computed: {
    formatFileName() {
      if (this.localFileName instanceof Object) {
        return this.localFileName.name.split('/').pop();
      }
      return this.localFileName == '' ? 'No file selected' : this.localFileName;
    },
  },
  methods: {
    onFileChange() {
      // eslint-disable-next-line prefer-destructuring
      this.file = this.$refs.fileInput.files[0];
      if (this.file) {
        // make sure a file is present to avoid console errors
        this.localFileName = this.file.name;
        this.$emit('input', this.file);
        this.$refs.fileInput.value = '';
      }
    },
  },
  watch: {
    fileName(value) {
      this.localFileName = value;
    },
  },
  mounted() {
    if (this.fileName && this.fileName !== null && this.fileName !== '') {
      this.localFileName = this.fileName.split('/').pop();
    }
  },
};
</script>

<style lang="scss" scoped>
.upload-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  position: relative;
  input[type="file"] {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    min-width: unset;
    z-index: 1;
  }
  button {
    display: inline-block;
    padding: .2rem 1rem;
    font-size: 12px;
    cursor: pointer;
    z-index: 2;
  }
  .uploadFileName-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    margin-left: 1rem;
    .uploadFileName {
      margin-left: 0.4rem;
      font-size: 13px;
      text-decoration: underline;
      max-width: 30rem;
      overflow-x: auto;
      color: $linkBlue;
    }
  }
}
</style>
