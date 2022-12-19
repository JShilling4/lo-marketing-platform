<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useProductsStore } from "../stores/products";
import { useCategoryStore } from "../stores/categories";
import { useTopicStore } from "../stores/topics";
import type { Product } from "../types/product";
import ProductCard from "@/components/ProductCard.vue";
// import infiniteScroll from "vue-infinite-scroll";
// Vue.use(infiniteScroll);

const router = useRouter();
const route = useRoute();

const productStore = useProductsStore();
const categoryStore = useCategoryStore();
const topicStore = useTopicStore();

const filteredProducts = ref<Product[]>([]);
const selectedCategories = ref<any>([]);
const selectedTopics = ref<any>([]);
const searchString = ref<string>("");
const scrollerData = ref<Product[]>([]);
const scrollSliceStart = ref<number>(0);
const scrollSliceIncrement = ref<number>(10);
const scrollerIsBusy = ref<boolean>(false);
const cardsAreLoading = ref<boolean>(false);
const sortOptions = ref<string[]>(["A-Z", "Z-A", "Most Popular"]);
const selectedSort = ref<string>("A-Z");

function filterProducts() {
  scrollerData.value = []; // reset the virtual scroller
  filteredProducts.value = JSON.parse(
    JSON.stringify([...productStore.allActiveProducts])
  ); // reset to starting dataset
  // check for category matches (inclusive)
  if (selectedCategories.value.length > 0) {
    filteredProducts.value = productStore.allActiveProducts.filter((prod) =>
      selectedCategories.value.some((sc: any) => sc.id == prod.category.id)
    );
  }
  // check for topic matches (exclusive)
  if (selectedTopics.value.length > 0) {
    const topicIdArray = selectedTopics.value.map((topic: any) => topic.name);
    filteredProducts.value = filteredProducts.value.filter((prod: any) =>
      topicIdArray.every((name: any) =>
        prod.topics.some((topic: any) => topic.name == name)
      )
    );
  }
  if (searchString.value !== "") {
    filteredProducts.value = filteredProducts.value.filter(
      (prod: any) =>
        prod.name.toLowerCase().includes(searchString.value.toLowerCase()) ||
        prod.description
          .toLowerCase()
          .includes(searchString.value.toLowerCase())
    );
  }
  if (selectedSort.value == "Z-A") {
    filteredProducts.value.reverse();
  } else if (selectedSort.value == "Most Popular") {
    filteredProducts.value = filteredProducts.value.sort((a: any, b: any) => {
      if (a.rating == b.rating) {
        return a.name > b.name ? 1 : -1;
      }
      return b.rating > a.rating ? 1 : -1;
    });
  }
  scrollSliceStart.value = 0;
  loadMoreCards();
}

function appendCategoryQueryString() {
  router.replace({
    name: "library",
    query: {
      ...route.query,
      categories: selectedCategories.value
        .map((category: any) => category.name)
        .join(","),
    },
  });
}

function categorySelected() {
  appendCategoryQueryString();
  filterProducts();
}

function removeCategory(index: number) {
  selectedCategories.value.splice(index, 1);
  appendCategoryQueryString();
  filterProducts();
}

function appendTopicQueryString() {
  router.replace({
    name: "library",
    query: {
      ...route.query,
      topics: selectedTopics.value.map((topic: any) => topic.name).join(","),
    },
  });
}

function goToReviews(e: Event, productId: string) {
  e.stopPropagation();
  e.preventDefault();
  router.push(`/product/${productId}/reviews`);
}

function topicSelected() {
  appendTopicQueryString();
  filterProducts();
}

function removeTopic(index: number) {
  selectedTopics.value.splice(index, 1);
  appendTopicQueryString();
  filterProducts();
}

function searchByString() {
  router.replace({
    name: "library",
    query: {
      ...route.query,
      search: searchString.value,
    },
  });
  filterProducts();
}

function loadMoreCards() {
  const page = filteredProducts.value.slice(
    scrollSliceStart.value,
    scrollSliceStart.value + scrollSliceIncrement.value
  );
  page.forEach((product) => {
    scrollerData.value.push(product);
  });
  scrollSliceStart.value += scrollSliceIncrement.value;
}

function filterByQueryString(
  queryCategories: any,
  queryTopics: any,
  querySearch: any
) {
  if (queryCategories) {
    queryCategories = queryCategories
      .split(",")
      .map((queryCategory: any) => queryCategory.toLowerCase());
    selectedCategories.value = categoryStore.allCategories.filter((cat: any) =>
      queryCategories.includes(cat.name.toLowerCase())
    );
  }
  if (queryTopics) {
    queryTopics = queryTopics
      .split(",")
      .map((queryTopic: any) => queryTopic.toLowerCase());
    selectedTopics.value = topicStore.allTopics.filter((topic: any) =>
      queryTopics.includes(topic.name.toLowerCase())
    );
  }
  if (querySearch) {
    searchString.value = querySearch.toLowerCase();
  }
  filterProducts();
  cardsAreLoading.value = false;
}

function sortChanged() {
  filterProducts();
}

onMounted(async () => {
  window.scrollTo(0, 0);
  // read query strings and handle filters as needed
  const queryCategories = route.query.categories || route.query.Categories;
  const queryTopics = route.query.topics || route.query.Topics;
  const querySearch = route.query.search || route.query.Search;
  const queryStringPresent = queryCategories || queryTopics || querySearch;
  cardsAreLoading.value = true;
  categoryStore.fetchCategories();
  topicStore.fetchTopics();

  // show products immediately if they exist in store
  if (productStore.allActiveProducts.length > 0) {
    filteredProducts.value = productStore.allActiveProducts.filter(
      (product: any) => product.isActive == 1
    );
    if (!queryStringPresent) {
      loadMoreCards();
    } else {
      filterByQueryString(queryCategories, queryTopics, querySearch);
    }
  }

  // if products were not in store, render the cards after store is populated
  await productStore.getAllProducts();

  if (!queryStringPresent) {
    filterProducts();
    // set up virtual scroller
    scrollSliceStart.value = 0;
    scrollerData.value = [];
    loadMoreCards();
  } else {
    filterByQueryString(queryCategories, queryTopics, querySearch);
  }

  cardsAreLoading.value = false;
});
</script>

<template>
  <div class="library">
    <h1 class="heading">Library</h1>

    <div class="chipBar">
      <i class="fas fa-tag"></i>
      <div class="chip-container">
        <span
          v-if="selectedCategories.concat(selectedTopics).length < 1"
          class="noTagsText"
          >No tags selected.</span
        >
        <!-- <chip-marker
          v-for="(category, index) in selectedCategories"
          :key="`category${category.id}`"
          :id="category.id"
          :name="category.name"
          @remove-chip="removeCategory(index, category.id)"
        />
        <chip-marker
          v-for="(topic, index) in selectedTopics"
          :key="`topic${topic.name}`"
          :name="topic.name"
          @remove-chip="removeTopic(index)"
        /> -->
      </div>
    </div>

    <div class="filterBar">
      <div class="tagFilter-container">
        <!-- Category -->
        <div class="form-group">
          <div class="multiselect-wrapper --library">
            <!-- <multi-select
              v-model="selectedCategories"
              :multiple="true"
              track-by="id"
              label="name"
              selectLabel=""
              selectedLabel=""
              placeholder="Categories"
              deselectLabel=""
              :close-on-select="false"
              :preserve-search="true"
              :options="allCategories"
              @input="categorySelected"
            >
              <template v-slot:selection="{ values, isOpen }">
                <span
                  class="multiselect__single"
                  v-if="values.length &amp;&amp; !isOpen"
                >
                  {{ values.length }} categor{{
                    values.length > 1 ? "ies" : "y"
                  }}
                  selected
                </span>
              </template>

              <template v-slot:tag><span></span></template>
            </multi-select> -->
          </div>
        </div>

        <!-- Topics -->
        <div class="form-group">
          <div class="multiselect-wrapper --library">
            <!-- <multi-select
              v-model="selectedTopics"
              :multiple="true"
              track-by="name"
              label="name"
              placeholder="Topics"
              selectLabel=""
              selectedLabel=""
              deselectLabel=""
              :close-on-select="false"
              :preserve-search="true"
              :options="allTopics"
              @input="topicSelected"
            >
              <template v-slot:selection="{ values, isOpen }">
                <span
                  class="multiselect__single"
                  v-if="values.length &amp;&amp; !isOpen"
                >
                  {{ values.length }} topic<span v-if="values.length > 1"
                    >s</span
                  >
                  selected
                </span>
              </template>

              <template v-slot:tag><span></span></template>
            </multi-select> -->
          </div>
        </div>
      </div>

      <!-- Search -->
      <div class="search">
        <i class="fas fa-search"></i>
        <input
          type="search"
          placeholder="Search"
          v-model="searchString"
          @input="searchByString"
        />
      </div>

      <!-- Sort -->
      <div class="multiselect-wrapper sortControl">
        <div class="form-group">
          <!-- <multi-select
            v-model="selectedSort"
            :options="sortOptions"
            placeholder="Sort"
            label=""
            selectLabel=""
            selectedLabel=""
            deselectLabel=""
            @input="sortChanged"
          /> -->
        </div>
      </div>
    </div>

    <!-- Product Cards -->
    <div>
      <transition-group tag="div" name="list" class="cardRow">
        <div
          v-for="product in scrollerData"
          :key="product.id"
          class="cardContainer"
        >
          <router-link
            :to="{ path: `/product/${product.id}`, query: { ...route.query } }"
          >
            <product-card :details="product">
              <slot>
                <span class="categoryLabel">{{ product.category.name }}</span>
                <div class="bottomRow">
                  <div>
                    <img
                      height="20"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Gold_Star.svg/2048px-Gold_Star.svg.png"
                      v-for="index in Number(product.rating)"
                      :key="index"
                    />
                    <img
                      height="20"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Star_empty.svg/471px-Star_empty.svg.png"
                      v-for="index in 5 - Number(product.rating)"
                      :key="index"
                    />
                  </div>
                </div>
              </slot>
            </product-card>
          </router-link>
        </div>
        <div class="emptyRowFiller" key="filler1"></div>
        <div class="emptyRowFiller" key="filler2"></div>
        <div class="emptyRowFiller" key="filler3"></div>
        <div class="emptyRowFiller" key="filler4"></div>
      </transition-group>
    </div>

    <!-- <loading-dots v-if="cardsAreLoading" loading-text="Loading products" /> -->
    <div v-if="!cardsAreLoading && scrollerData.length < 1" class="noResults">
      There are no products that match your search.
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../assets/scss/mixins";

.library {
  padding: var(--standard-view);
  @include breakpoint(desktop) {
    padding: 4rem 4rem 10rem;
  }
  @include breakpoint(tablet-port) {
    padding: 4rem 2rem 10rem;
  }
}
.heading {
  font-weight: 800;
}
.chipBar {
  display: flex;
  margin-top: 3rem;
  min-height: 4rem;
  .chip-container {
    display: flex;
    flex-wrap: wrap;
  }
  .fa-tag {
    color: var(--gray);
    margin-right: 0.5rem;
  }
  .noTagsText {
    color: var(--gray);
    font-size: 12px;
    font-weight: 600;
    margin-left: 1rem;
    line-height: 15px;
  }
}
.filterBar {
  display: flex;
  align-items: flex-end;
  margin-top: 1rem;
  height: 3.7rem;
  @include breakpoint(tablet-port) {
    flex-wrap: wrap;
    height: unset;
  }
  .form-group {
    margin-bottom: 0;
    @include breakpoint(tablet-port) {
      margin-bottom: 1rem;
    }
  }
  .multiselect-wrapper {
    width: 17rem;
    margin-right: 1rem;
    label {
      color: var(--orange);
    }
    :deep(.multiselect__content-wrapper) {
      width: 17rem;
    }
    :deep(.multiselect__single) {
      color: var(--orange);
      font-weight: 800;
    }
  }
  .tagFilter-container {
    display: flex;
    @include breakpoint(mobile) {
      flex-wrap: wrap;
    }
  }
  .search {
    position: relative;
    margin-left: 1rem;
    @include breakpoint(laptop) {
      position: absolute;
      right: 4rem;
      top: 15.25rem;
      margin: 0;
    }
    @include breakpoint(tablet-port) {
      right: 2rem;
    }
    input {
      width: 23rem;
      height: 2.6rem;
      padding: 0.5rem 0.5rem 0.25rem 2.8rem;
      border-radius: 5rem;
      border: 1px solid var(--gray);
      @include breakpoint(desktop) {
        width: 22rem;
      }
      @include breakpoint(tablet-port) {
        width: 17rem;
      }
      &:focus,
      &:active {
        outline: none;
      }
    }
    .fa-search {
      position: absolute;
      top: 0.6rem;
      left: 0.75rem;
      color: var(--gray);
    }
  }
  .sortControl {
    margin-left: auto;
    @include breakpoint(tablet-port) {
      margin-left: 0;
    }
  }
}
.cardContainer {
  width: var(--prodCardContainer-width);
  margin: 0 auto;
}
.cardRow {
  display: flex;
  flex-wrap: wrap;
  margin-top: 5rem;
  padding: 0 4px;
  .categoryLabel {
    color: var(--gray);
    margin-top: 0.25rem;
    font-size: 1.4rem;
  }
  .bottomRow {
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    .orderBtn {
      display: inline-block;
      font-size: 1.3rem;
      margin-right: 1.5rem;
    }
  }
}
.emptyRowFiller {
  width: var(--prodCardContainer-width);
  height: 0;
  margin: 0 auto;
}
:deep(p.loading) {
  text-align: left;
}
</style>
