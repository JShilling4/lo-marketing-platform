<template>
  <div class="fieldOptions" v-on-clickaway="clickedAway">
    <ul>
      <li class="option" @click="$emit('change', 'text')">Text</li>
      <li class="option" @click="$emit('change', 'dropdown')">Dropdown</li>
      <li class="option" @click="$emit('change', 'date')">Date</li>
      <li class="option" @click="$emit('change', 'radio')">Radio</li>
      <li class="option" @click="$emit('change', 'textbox')">Text Box</li>
      <li class="option" @click="$emit('change', 'file')">File Upload</li>
    </ul>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway';

export default {
  mixins: [clickaway],
  name: 'FieldOptionMenu',
  methods: {
    clickedAway() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.fieldOptions {
  position: absolute;
  top: 0;
  left: 9rem;
  padding: 1rem 0;
  box-shadow: $dropdownShadow;
  text-align: center;
  font-size: 14px;
  width: 14rem;
  .option {
    margin: 1.5rem 0;
    cursor: pointer;
    color: #333;
    &:hover {
      color: $orange;
      font-weight: 500;
    }
  }
}
</style>
