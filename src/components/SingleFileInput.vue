<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import AppButton from "./AppButton.vue";

export type PropTypes = {
  buttonText: string;
  buttonSize: string;
  name: string;
  fileName: string | File;
  isDisabled: boolean;
  showFileName: boolean;
};

const props = withDefaults(defineProps<PropTypes>(), {
  showFileName: true,
});

const emit = defineEmits<{
  (e: "input", file: File): void;
}>();

const localFileName = ref<string>("");
const file = ref<File | null>(null);
const fileInputRef = ref<HTMLInputElement>();

const formatFileName = computed(() => {
  return localFileName.value == "" ? "No file selected" : localFileName.value;
});

function onFileChange() {
  if (!fileInputRef?.value?.files) return;

  file.value = fileInputRef.value.files[0];
  if (file.value) {
    // make sure a file is present to avoid console errors
    localFileName.value = file.value.name;
    emit("input", file.value);
    fileInputRef.value.value = "";
  }
}

// watch(props.fileName, (value) => {
//   localFileName.value = value;
// });

onMounted(() => {
  // if (props.fileName && props.fileName !== null && props.fileName !== "") {
  //   localFileName.value = props.fileName.split("/").pop();
  // }
});
</script>

<template>
  <div class="upload-wrapper">
    <app-button
      classes="btn btn-orange"
      @click="fileInputRef?.click()"
      :text="buttonText"
    />
    <input
      type="file"
      ref="fileInputRef"
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
    padding: 0.2rem 1rem;
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
      color: var(--linkBlue);
    }
  }
}
</style>
