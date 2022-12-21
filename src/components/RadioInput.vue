<script setup lang="ts">
type RadioCheck = string | number | boolean;

const props = defineProps<{
  modelValue: string | number | boolean | null;
  check: RadioCheck;
  label: string;
  labelFor: string;
  isDisabled?: boolean;
  name: string;
  id: string;
}>();

const emit = defineEmits<{
  (e: "input", check: RadioCheck): void;
}>();

function onRadioChange() {
  emit("input", props.check);
}
</script>

<template>
  <div class="radio-group">
    <input
      type="radio"
      :checked="check == modelValue"
      :id="id"
      @change="onRadioChange"
    />
    <label :for="labelFor" class="radio-label">{{ label }}</label>
  </div>
</template>

<style lang="scss" scoped>
label {
  font-weight: normal;
  margin: 1rem 2rem 0 0.3rem;
}
input {
  margin-right: 1rem;
}
.form-group {
  display: flex;
}
.radio-group {
  display: flex;
  align-items: center;
  input[type="radio"] {
    position: absolute;
    opacity: 0;
    z-index: 100;
    cursor: pointer;
    + .radio-label {
      &:before {
        content: "";
        background: #fff;
        border-radius: 100%;
        border: 1px solid var(--gray);
        display: inline-block;
        width: 12px;
        height: 12px;
        position: relative;
        top: 0;
        left: -4px;
        vertical-align: top;
        cursor: pointer;
        text-align: center;
        transition: all 250ms ease;
      }
    }
    &:checked {
      + .radio-label {
        &:before {
          background-color: var(--teal-light);
          box-shadow: inset 0 0 0 3px #fff;
        }
      }
    }
    &:focus {
      + .radio-label {
        &:before {
          outline: none;
        }
      }
    }
    + .radio-label {
      margin-top: 3px;
      cursor: pointer;
      &:empty {
        &:before {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
