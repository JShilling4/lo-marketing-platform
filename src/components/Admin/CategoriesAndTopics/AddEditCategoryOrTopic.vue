<template>
  <div class="addEditCategoryOrTopic">
    <h2 class="heading">Add/Edit {{ type == "categories" ? "Category" : "Topic" }}</h2>
    <ValidationObserver ref="observer" v-slot="{ invalid }" tag="form">
      <div class="inline-group">
        <!-- Name -->
        <ValidationProvider
          mode="passive"
          v-slot="{ errors }"
          rules="required"
          class="form-group"
          tag="div"
        >
          <label> {{ type == "categories" ? "Category" : "Topic" }} Name </label>
          <text-input v-focus type="text" name="name" v-model="localItem.name" />
          <span class="errorMessage">{{ errors[0] }}</span>
        </ValidationProvider>
      </div>
      <!-- Description -->
      <div class="form-group">
        <label> {{ type == "categories" ? "Category" : "Topic" }} Description </label>
        <text-area v-model="localItem.description" />
      </div>
      <div class="inline-group">
        <!-- Status -->
        <div class="form-group">
          <label> {{ type == "categories" ? "Category" : "Topic" }} Status </label>
          <div class="input-group">
            <div class="input-group">
              <radio-input
                name="status"
                label="Active"
                id="status_active"
                labelFor="status_active"
                :check="1"
                v-model="localItem.isActive"
              />
            </div>
            <div class="input-group">
              <radio-input
                name="status"
                label="Inactive"
                id="status_inactive"
                labelFor="status_inactive"
                :check="0"
                v-model="localItem.isActive"
              />
            </div>
          </div>
        </div>
        <!-- Catalog item -->
        <div v-if="type == 'categories'" class="form-group">
          <label>Add to Catalog?</label>
          <div class="input-group">
            <div class="input-group">
              <radio-input
                name="isCatalog"
                label="Yes"
                :check="1"
                id="catalogYes"
                labelFor="catalogYes"
                v-model="localItem.displayRealtor"
              />
            </div>
            <div class="input-group">
              <radio-input
                name="isCatalog"
                :check="0"
                label="No"
                labelFor="catalogNo"
                id="catalogNo"
                v-model="localItem.displayRealtor"
              />
            </div>
          </div>
        </div>
      </div>
    </ValidationObserver>
    <div class="form-controls">
      <app-button @click.native="saveItem" classes="btn btn-green control" text="Save" />
      <app-button @click.native="close" classes="btn btn-black control" text="Cancel" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import TextInput from '@/components/Shared/Inputs/TextInput';
import TextArea from '@/components/Shared/Inputs/TextArea';
import RadioInput from '@/components/Shared/Inputs/RadioInput';
import AppButton from '@/components/Shared/AppButton';

export default {
  name: 'AddEditCategoryOrTopic',
  props: {
    item: Object,
    type: String,
    action: String,
  },
  components: {
    'text-input': TextInput,
    'text-area': TextArea,
    'radio-input': RadioInput,
    'app-button': AppButton,
  },
  data() {
    return {
      localItem: { ...this.item },
    };
  },
  methods: {
    ...mapActions(['manageCategory', 'manageTopic', 'deleteTopic']),
    close() {
      this.$emit('close');
    },
    async saveItem() {
      const formValid = await this.$refs.observer.validate();
      if (formValid) {
        const isCategory = this.type == 'categories';
        if (isCategory) {
          const { response, categoryIndex } = await this.manageCategory(this.localItem);
          if (response.status == '200') {
            if (categoryIndex == -1) {
              this.$socket.emit('addCategory', response.data);
            } else {
              this.$socket.emit('editCategory', { category: response.data, categoryIndex });
            }
          }
        } else {
          const { response, topicIndex } = await this.manageTopic(this.localItem);
          if (response.status == '200') {
            if (this.$socket) {
              if (topicIndex == -1) {
                this.$socket.emit('addTopic', response.data);
              } else {
                this.$socket.emit('editTopic', { topic: response.data, topicIndex });
              }
            }
          }
        }
        this.close();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.addEditCategoryOrTopic {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  padding: 4rem 6rem;
  background-color: #fff;
  box-shadow: $dropdownShadow;
  transition: position 0.3s ease-in-out, opacity 0.3s ease-in-out;
  .heading {
    margin-bottom: 2rem;
      font-weight: 800;
  }
}
.inline-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
  .form-group {
    width: 45%;
  }
    label {
        font-weight: 700;
    }
  input {
  }
}
label  {
    font-weight: 700;
}

.form-controls {
  display: flex;
  justify-content: flex-start;
  margin-top: 2rem;
  .control {
    margin-right: 1.5rem;
      font-family: 'Nunito Sans', sans-serif;
      font-weight: 700;
  }
}
</style>
