<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useProductStore } from "@/store";
import { useUserStore } from "@/store";

import StarRating from "@/components/StarRating.vue";
import TextInput from "@/components/TextInput.vue";
import TextArea from "@/components/TextArea.vue";
import RadioInput from "@/components/RadioInput.vue";
import SingleFileInput from "@/components/SingleFileInput.vue";
import VueMultiselect from "vue-multiselect";
import AppButton from "@/components/AppButton.vue";

import type { Product } from "@/types/product";
import type { Order } from "@/types/order";
import type { OrderDeliverable } from "@/types/orderDeliverable";
import type { ProductImage } from "@/types/productImage";

const route = useRoute();
const router = useRouter();

const productStore = useProductStore();
const userStore = useUserStore();

const product = ref<Product>({} as Product);
const localOrder = ref<Order>({} as Order);
// const productDataLoaded = ref<boolean>(false);
const selectedImageId = ref<string | null>(null);

// computed
const processTime = computed(() => {
  const { processingTime } = product.value;
  const dayCount = processingTime / 8;
  const hourCount = Math.floor(processingTime % 8);
  if (dayCount == 0) {
    return "Instant";
  }
  if (dayCount == 1) {
    return `${dayCount} Business Day`;
  }
  if (dayCount <= 1) {
    return `${hourCount} hour(s)`;
  }
  return `${dayCount} Business Days`;
});

const selectedImagePreviewPath = computed(() => {
  if (selectedImageId.value !== null) {
    const selectedImage = product.value.productImages.find(
      (image) => image.id == selectedImageId.value
    );
    const preview = selectedImage?.filepaths.find(
      (filepath) => filepath.type == "preview"
    );
    return preview?.path ?? null;
  }
  try {
    const primaryImage = product.value.productImages.find(
      (image) => image.primary === true
    );
    const preview = primaryImage?.filepaths.find(
      (filepath) => filepath.type == "preview"
    );
    return preview?.path ?? null;
  } catch (error) {
    console.log(error);
  }
  return undefined;
});

const selectedImageFullscreenPath = computed(() => {
  if (selectedImageId.value !== null) {
    const selectedImage = product.value.productImages.find(
      (image) => image.id == selectedImageId.value
    );
    const fullScreen = selectedImage?.filepaths.find(
      (filepath) => filepath.type == "fullScreen"
    );

    return fullScreen?.path ?? null;
  }

  try {
    const primaryImage = product.value.productImages.find(
      (image) => image.primary === true
    );
    const fullScreen = primaryImage?.filepaths.find(
      (filepath) => filepath.type == "fullScreen"
    );

    return fullScreen?.path ?? null;
  } catch (error) {
    console.log(error);
  }
  return undefined;
});

// methods
function detailFileChanged(file: File, index: number) {
  const reader = new FileReader();
  reader.onload = (fileEvent) => {
    if (!fileEvent.target) return;
    localOrder.value.details[index].value = fileEvent.target.result as string;
    // refs[`input${index}`][0].syncValue(
    //   localOrder.value.details[index].value
    // ); // this will let validitor know if files are present
  };
  reader.readAsDataURL(file);
  localOrder.value.details[index].fileName = file.name;
}

async function placeOrder() {
  // create a deliverable if this is an instant download product
  if (product.value.isDownload) {
    const delObj: OrderDeliverable = {
      id: "",
      filepath: product.value.instantAssetPath,
      status: "final",
      createdDatetime: "",
      assets: null,
      versions: null,
    };
    localOrder.value.deliverables.push(delObj);
    localOrder.value.status = "Completed";
  }
  // post the order request & route to the order page
  // const { response } = createOrder(localOrder.value);
  // router.push(`/orders/${response.data.id}`);
}

function setOrderData() {
  // populate the order locally
  localOrder.value.orderedBy = {
    employeeNumber: userStore.user.employeeNumber,
    fullName: userStore.user.fullName,
  };
  localOrder.value.orderedFor = {
    employeeNumber: userStore.user.employeeNumber,
    fullName: userStore.user.fullName,
  };
  localOrder.value.secondaryAssignTo = product.value.secondaryAssignTo;
  localOrder.value.dueDate = new Date().toISOString();
  localOrder.value.product = product.value;
  localOrder.value.product.name = product.value.name;
  localOrder.value.details = JSON.parse(
    JSON.stringify(product.value.formFields)
  );
}

function getThumbnailPath(image: ProductImage) {
  const thumb = image.filepaths.find(
    (filepath) => filepath.type == "thumbnail"
  );
  return thumb?.path ?? "";
}

onMounted(async () => {
  window.scrollTo(0, 0);
  // first check if we have this product loaded in the store
  const p = productStore.productById(route.params.productId as string);
  if (p) {
    product.value = JSON.parse(JSON.stringify(p));
    setOrderData();
  } else {
    // product is not in store, attempt to load from API & route to 404 if doesnt exist
    productStore.getAllProducts();
    const p = productStore.productById(route.params.productId as string);
    if (!p) {
      router.push("/404");
    } else {
      product.value = JSON.parse(JSON.stringify(p));
      setOrderData();
    }
  }
});
</script>

<template>
  <div class="productPage">
    <transition name="fadeInOut" mode="out-in">
      <div v-if="product.category" class="content-wrapper">
        <!-- PRODUCT DISPLAY -->
        <div class="productDisplay">
          <!-- Main Preview -->
          <a
            class="main"
            :href="selectedImageFullscreenPath ?? ''"
            target="_blank"
          >
            <img
              v-if="selectedImagePreviewPath"
              class="main"
              :src="selectedImagePreviewPath"
            />
          </a>
          <!-- Thumbnails -->
          <div class="productDisplay__thumbDock">
            <img
              v-for="image in product.productImages"
              :key="image.id"
              :src="getThumbnailPath(image)"
              class="thumb"
              @click="selectedImageId = image.id"
            />
          </div>
          <!-- Product Info -->
          <div class="productInfo">
            <div class="productInfo__infoBlock">
              <label>Category:</label>
              <span v-if="product.category">{{ product.category.name }}</span>
            </div>
            <div class="productInfo__infoBlock">
              <label>Processing Time:</label>
              <span>{{ processTime }}</span>
            </div>
          </div>
        </div>

        <!-- ORDER DETAILS -->
        <div class="orderDetails">
          <h1>{{ product.name }}</h1>
          <ul class="statRow">
            <li class="statRow__reviews">
              <star-rating :rating="product.rating" />
              <router-link :to="`/product/${$route.params.productId}/reviews`">
                {{ product.reviewCount }} Review
                <span v-if="product.reviewCount > 1">s</span>
              </router-link>
            </li>
            <li class="statRow__orderCount">{{ product.orderCount }} orders</li>
          </ul>
          <h3>Product Details</h3>
          <p class="productDescription" v-html="product.description"></p>

          <!-- User provided details -->
          <form class="fieldHolder">
            <!-- Details -->
            <div
              v-for="(field, index) in localOrder.details"
              :key="field.sortOrder"
              class="form-group"
            >
              <label>
                {{ field.label }}
                <i v-if="field.required" class="fas fa-asterisk asterisk"></i>
              </label>

              <!-- Text Input -->
              <text-input
                v-if="field.type == 'text'"
                :placeholder="field.placeholder"
                :field="field"
                v-model="field.value"
              />

              <!-- Dropdown -->
              <div v-if="field.type == 'dropdown'" class="multiselect-wrapper">
                <vue-multiselect
                  v-model="field.value"
                  selectLabel=""
                  deselectLabel=""
                  :preserve-search="true"
                  :options="field.options.map((option) => option.value)"
                  :taggable="false"
                />
              </div>

              <!-- Date input -->
              <date-time-picker
                v-if="field.type == 'date'"
                v-model="field.value"
                color="#f38e36"
                :no-label="true"
                label="Select date"
                :only-date="true"
                :no-weekends-days="true"
              />

              <!-- Radio -->
              <div v-if="field.type == 'radio'" class="input-group">
                <radio-input
                  v-for="option in field.options"
                  :key="option.label"
                  :check="option.value"
                  :label="option.value"
                  :label-for="`${field.label.split(' ').join('')}-${
                    option.value
                  }`"
                  :id="`${field.label.split(' ').join('')}-${option.value}`"
                  v-model="field.value"
                  :name="field.label.split(' ').join('')"
                />
              </div>

              <!-- Textbox -->
              <text-area
                v-if="field.type == 'textbox'"
                :placeholder="field.placeholder"
                v-model="field.value"
              />

              <!-- Single File Upload -->
              <single-file-input
                v-if="field.type == 'file'"
                buttonText="Upload"
                @input="detailFileChanged($event, index)"
              />
            </div>
          </form>

          <!-- CONTROLS -->
          <div class="button-group">
            <app-button classes="btn btn-green" @click="placeOrder"
              >Place Order</app-button
            >
            <app-button
              classes="btn btn-black"
              @click="
                router.push({ path: '/library', query: { ...route.query } })
              "
              >Cancel</app-button
            >
          </div>
        </div>
      </div>

      <!-- <loading-dots v-else loading-text="Loading product details" /> -->
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@import "../assets/scss/mixins";

.productPage {
  padding: 4rem 23% 10rem;
  @include breakpoint(desktop) {
    padding: 4rem 10% 10rem;
  }
  @include breakpoint(laptop) {
    padding: 4rem 4rem 10rem;
  }
  @include breakpoint(tablet-land) {
    padding: 6rem 4rem 10rem;
    flex-wrap: wrap;
  }
  @include breakpoint(tablet-land) {
    padding: 6rem 2rem 10rem;
  }
}
.content-wrapper {
  display: flex;
  justify-content: space-between;
  @include breakpoint(tablet-land) {
    flex-wrap: wrap;
  }
}
.productDisplay {
  width: 40%;
  min-width: 42rem;
  @include breakpoint(laptop) {
    min-width: 38rem;
  }
  @include breakpoint(mobile) {
    min-width: unset;
    width: 100%;
  }
  a.main {
    display: block;
    width: 90%;
    max-width: 375px;
    @include breakpoint(laptop) {
      min-width: 34rem;
    }
    @include breakpoint(mobile) {
      min-width: unset;
      width: 100%;
    }
  }
  img.main {
    width: 100%;
    object-fit: cover;
  }
  img.thumb {
    height: 100px;
    width: 100px;
    margin: 2rem 2rem 1rem 0;
    cursor: pointer;
    object-fit: cover;
    &.--selected {
      border: 4px solid var(--teal-light);
    }
  }
  &__thumbDock {
    display: flex;
    flex-wrap: wrap;
    max-width: 375px;
  }
  .productInfo {
    margin-top: 2rem;
    &__infoBlock {
      display: flex;
      margin-bottom: 1rem;
      label {
        margin-right: 1rem;
        font-weight: 700;
      }
    }
  }
}
.orderDetails {
  width: 40%;
  min-width: 35rem;
  @include breakpoint(tablet-land) {
    margin-top: 2rem;
  }
  @include breakpoint(mobile) {
    min-width: unset;
    width: 100%;
  }
  h1 {
    margin-bottom: 2rem;
    font-weight: 800;
  }
  .statRow {
    &__reviews {
      display: flex;
      align-items: center;
      width: 25rem;
      margin: 0 0 0.5rem;
      a {
        margin-left: 1rem;
        font-size: 1.4rem;
        color: var(--gray-mid);
        &:hover {
          color: var(--teal-light);
        }
      }
    }
    &__orderCount {
      margin-bottom: 2rem;
      color: var(--gray-mid);
    }
  }
  .productDescription {
    font-size: 14px;
    margin-bottom: 3rem;
  }
  h3 {
    width: 40%;
    margin-bottom: 2rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--gray);
    font-size: 1.8rem;
    color: #333;
    font-weight: 800;
  }
  p {
    width: 75%;
  }
}
.fieldHolder {
  margin-top: 3rem;
  max-width: 75%;
  .form-group {
    position: relative;
    label {
      font-weight: 700;
    }
    .field-controls {
      position: absolute;
      top: 0;
      right: 0;
      .fas {
        font-size: 14px;
        cursor: pointer;
        -webkit-font-smoothing: antialiased;
        transition: transform 0.1s ease;
        &:hover {
          transform: scale(1.3);
        }
      }
      .deleteIcon {
        color: var(--red);
        margin-left: 1rem;
      }
      .editIcon {
        color: var(--linkBlue);
      }
    }
  }
}
.button-group {
  display: flex;
  margin-top: 4rem;
  button {
    margin-bottom: 2rem;
    min-width: 11rem;
    margin-right: 2rem;
    font-family: "Nunito Sans", Arial, sans-serif;
    font-weight: 700;
  }
}
:deep(p.loading) {
  text-align: left;
}
</style>
