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
                <chip-marker
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
                />
            </div>
        </div>

        <div class="filterBar">
            <!-- Category -->
            <div class="tagFilter-container">
                <div class="form-group">
                    <div class="multiselect-wrapper --library">
                        <multi-select
                            v-model="selectedCategories"
                            :multiple="true"
                            track-by="id"
                            label="name"
                            selectLabel=""
                            placeholder="Categories"
                            deselectLabel=""
                            :close-on-select="false"
                            :preserve-search="true"
                            :options="allCategories"
                            @input="filterProducts"
                        >
                            <template
                                slot="selection"
                                slot-scope="{ values, isOpen }"
                            >
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

                            <template slot="tag"><span></span></template>
                        </multi-select>
                    </div>
                </div>

                <!-- Topics -->
                <div class="form-group">
                    <div class="multiselect-wrapper --library">
                        <multi-select
                            v-model="selectedTopics"
                            :multiple="true"
                            track-by="name"
                            label="name"
                            placeholder="Topics"
                            selectLabel=""
                            deselectLabel=""
                            :close-on-select="false"
                            :preserve-search="true"
                            :options="allTopics"
                            @input="filterProducts"
                        >
                            <template
                                slot="selection"
                                slot-scope="{ values, isOpen }"
                            >
                                <span
                                    class="multiselect__single"
                                    v-if="values.length &amp;&amp; !isOpen"
                                >
                                    {{ values.length }} topic<span
                                        v-if="values.length > 1"
                                        >s</span
                                    >
                                    selected
                                </span>
                            </template>

                            <template slot="tag"><span></span></template>
                        </multi-select>
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
        </div>

        <div
            v-infinite-scroll="loadMoreCards"
            infinite-scroll-disabled="busy"
            infinite-scroll-distance="10"
            infinite-scroll-immediate-check="false"
        >
            <transition-group tag="div" name="list" class="cardRow">
                <div
                    v-for="product in scrollerData"
                    :key="product.id"
                    class="cardContainer"
                >
                    <product-card :details="product">
                        <slot>
                            <span class="categoryLabel">{{
                                product.category.name
                            }}</span>
                            <div class="bottomRow">
                                <router-link
                                    :to="`/catalog/product/${product.id}`"
                                >
                                    <app-button
                                        classes="btn btn-orange orderBtn"
                                        text="I'm Interested!"
                                    />
                                </router-link>

                                <!-- <star-rating
                  :star-size="25"
                  :show-rating="false"
                  :increment="0.5"
                  :read-only="true"
                  :rating="product.rating"
                /> -->
                            </div>
                        </slot>
                    </product-card>
                </div>
                <div class="emptyRowFiller" key="filler1"></div>
                <div class="emptyRowFiller" key="filler2"></div>
                <div class="emptyRowFiller" key="filler3"></div>
                <div class="emptyRowFiller" key="filler4"></div>
            </transition-group>
        </div>

        <loading-dots v-if="cardsAreLoading" loading-text="Loading products" />
        <div
            v-if="!cardsAreLoading && scrollerData.length < 1"
            class="noResults"
        >
            There are no products that match your search.
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import infiniteScroll from "vue-infinite-scroll";
import { mapState, mapGetters, mapActions } from "vuex";

Vue.use(infiniteScroll);

export default {
    name: "CatalogLibrary",
    components: {
        "product-card": () => import("@/components/Shared/ProductCard"),
        // 'star-rating': () => import('vue-star-rating'),
        "multi-select": () => import("vue-multiselect"),
        "chip-marker": () => import("@/components/Shared/ChipMarker"),
        "app-button": () => import("@/components/Shared/AppButton"),
        "loading-dots": () => import("@/components/Shared/LoadingDots")
    },
    data() {
        return {
            productList: [],
            filteredProducts: [],
            selectedCategories: [],
            selectedTopics: [],
            searchString: "",
            scrollerData: [],
            scrollSliceStart: 0,
            scrollSliceIncrement: 10,
            scrollerIsBusy: false,
            cardsAreLoading: false
        };
    },

    computed: {
        ...mapState(["products"]),
        ...mapGetters(["allCategories", "allTopics", "allCatalogProducts"])
    },

    methods: {
        ...mapActions(["fetchCategoriesTopics", "updateProducts"]),
        filterProducts() {
            this.scrollerData = []; // reset the virtual scroller
            this.filteredProducts = this.productList; // reset to starting dataset
            // check for category matches (inclusive)
            if (this.selectedCategories.length > 0) {
                this.filteredProducts = this.productList.filter(prod =>
                    this.selectedCategories.some(
                        sc => sc.id == prod.category.id
                    )
                );
            }
            // check for topic matches (exclusive)
            if (this.selectedTopics.length > 0) {
                const topicIdArray = this.selectedTopics.map(
                    topic => topic.name
                );
                this.filteredProducts = this.filteredProducts.filter(prod =>
                    topicIdArray.every(name =>
                        prod.topics.some(topic => topic.name == name)
                    )
                );
            }
            if (this.searchString !== "") {
                this.filteredProducts = this.filteredProducts.filter(prod =>
                    prod.name
                        .toLowerCase()
                        .includes(this.searchString.toLowerCase())
                );
            }
            this.scrollSliceStart = 0;
            this.loadMoreCards();
        },
        removeCategory(index) {
            this.selectedCategories.splice(index, 1);
            this.filterProducts();
        },
        removeTopic(index) {
            this.selectedTopics.splice(index, 1);
            this.filterProducts();
        },
        searchByString() {
            this.filterProducts();
        },
        loadMoreCards() {
            const page = this.filteredProducts.slice(
                this.scrollSliceStart,
                this.scrollSliceStart + this.scrollSliceIncrement
            );
            page.forEach(product => {
                this.scrollerData.push(product);
            });
            this.scrollSliceStart += this.scrollSliceIncrement;
        }
    },

    async created() {
        this.cardsAreLoading = true;
        this.fetchCategoriesTopics();
        // show products immediately if they exist in store
        if (this.allCatalogProducts.length > 0) {
            this.productList = this.allCatalogProducts.filter(
                product => product.isActive == 1
            );
            this.filteredProducts = this.productList;

            this.loadMoreCards();
        }
        // if products were not in store, render the cards after store is popped
        await this.updateProducts();
        this.productList = this.allCatalogProducts.filter(
            product => product.isActive == 1
        );
        this.filteredProducts = this.productList;

        this.scrollSliceStart = 0;
        this.scrollerData = [];
        this.loadMoreCards();
        this.cardsAreLoading = false;
    }
};
</script>

<style lang="scss" scoped>
.library {
    padding: $standard-view;
    h1.heading {
        font-weight: 800;
    }
    @include breakpoint(desktop) {
        padding: 4rem 4rem 10rem;
    }
    @include breakpoint(tablet-port) {
        padding: 4rem 2rem 10rem;
    }
}

.chipBar {
    display: flex;
    margin-top: 3rem;
    .chip-container {
        display: flex;
        flex-wrap: wrap;
    }
    .fa-tag {
        color: $gray;
        margin-right: 0.5rem;
    }
    .noTagsText {
        color: $gray;
        font-size: 12px;
        margin-left: 1rem;
    }
}
.filterBar {
    display: flex;
    align-items: center;
    margin-top: 2rem;
    @include breakpoint(tablet-port) {
        flex-wrap: wrap;
    }
    .form-group {
        margin-bottom: 0;
    }
    .multiselect-wrapper {
        width: 17rem;
        margin-right: 1rem;
    }
    .tagFilter-container {
        display: flex;
        @include breakpoint(mobile) {
            flex-direction: column;
        }
        .form-group:first-of-type {
            @include breakpoint(mobile) {
                margin-bottom: 2rem;
            }
        }
    }
    .search {
        position: relative;
        margin: 0 5.5rem 0 auto;
        @include breakpoint(tablet-land) {
            position: absolute;
            right: 4rem;
            top: 15.25rem;
            margin: 0;
        }
        @include breakpoint(tablet-port) {
            right: 2rem;
        }
        input {
            width: 27.5rem;
            height: 2.6rem;
            padding: 0.5rem 0.5rem 0.25rem 2.8rem;
            border-radius: 5rem;
            border: 1px solid $gray;
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
            color: $gray;
        }
    }
}

.cardContainer {
    width: $prodCardContainer-width;
    margin: 0 auto;
    @include breakpoint(tablet-port) {
        width: 275px;
    }
}
.cardRow {
    display: flex;
    flex-wrap: wrap;
    margin-top: 5rem;
    padding: 0 4px;
    .categoryLabel {
        color: $gray;
        margin-top: 0.25rem;
        font-size: 1.4rem;
    }
    .bottomRow {
        margin-top: auto;
        display: flex;
        align-items: center;
        .orderBtn {
            display: inline-block;
            font-size: 1.1rem;
            margin-right: 1.5rem;
            margin-top: 0.5rem;
            font-weight: 700;
            font-family: "Nunito Sans", sans-serif;
        }
    }
}
.emptyRowFiller {
    width: $prodCardContainer-width;
    height: 0;
    margin: 0 auto;
}
::v-deep p.loading {
    text-align: left;
}
</style>

<style lang="scss">
// global
.multiselect-wrapper.--library {
    .multiselect-wrapper {
        max-width: 17rem;
    }
    .multiselect__content-wrapper {
        width: 35rem;
    }
}
</style>
