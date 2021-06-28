<template>
    <div class="library">
        <h1 class="heading">Library</h1>

        <div class="chipBar">
            <i class="fas fa-tag"></i>
            <div class="chip-container">
                <span
                    v-if="selectedCategories.concat(selectedTopics).length < 1"
                    class="noTagsText"
                >No tags selected.</span>
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
            <div class="tagFilter-container">
                <!-- Category -->
                <div class="form-group">
                    <div class="multiselect-wrapper --library">
                        <multi-select
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
                            <template
                                slot="selection"
                                slot-scope="{ values, isOpen }"
                            >
                                <span
                                    class="multiselect__single"
                                    v-if="values.length &amp;&amp; !isOpen"
                                >
                                    {{ values.length }} categor{{ values.length > 1 ? "ies" : "y" }} selected
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
                            selectedLabel=""
                            deselectLabel=""
                            :close-on-select="false"
                            :preserve-search="true"
                            :options="allTopics"
                            @input="topicSelected"
                        >
                            <template
                                slot="selection"
                                slot-scope="{ values, isOpen }"
                            >
                                <span
                                    class="multiselect__single"
                                    v-if="values.length &amp;&amp; !isOpen"
                                >
                                    {{ values.length }} topic<span v-if="values.length > 1">s</span> selected
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

            <!-- Sort -->
            <div class="multiselect-wrapper sortControl">
                <div class="form-group">
                    <multi-select
                        v-model="selectedSort"
                        :options="sortOptions"
                        placeholder="Sort"
                        label=""
                        selectLabel=""
                        selectedLabel=""
                        deselectLabel=""
                        @input="sortChanged"
                    />
                </div>
            </div>
        </div>

        <!-- Product Cards -->
        <div
            v-infinite-scroll="loadMoreCards"
            infinite-scroll-disabled="busy"
            infinite-scroll-distance="10"
            infinite-scroll-immediate-check="false"
        >
            <transition-group
                tag="div"
                name="list"
                class="cardRow"
            >
                <div
                    v-for="product in scrollerData"
                    :key="product.id"
                    class="cardContainer"
                >
                    <router-link :to="{ path: `/product/${product.id}`, query: { ...$route.query } }">
                        <product-card :details="product">
                            <slot>
                                <span class="categoryLabel">{{ product.category.name }}</span>
                                <div class="bottomRow">
                                    <star-rating
                                        :star-size="25"
                                        :show-rating="false"
                                        :increment="0.5"
                                        :read-only="true"
                                        :rating="product.rating"
                                        @click.native="goToReviews($event, product.id)"
                                    />
                                </div>
                            </slot>
                        </product-card>
                    </router-link>
                </div>
                <div
                    class="emptyRowFiller"
                    key="filler1"
                ></div>
                <div
                    class="emptyRowFiller"
                    key="filler2"
                ></div>
                <div
                    class="emptyRowFiller"
                    key="filler3"
                ></div>
                <div
                    class="emptyRowFiller"
                    key="filler4"
                ></div>
            </transition-group>
        </div>

        <loading-dots
            v-if="cardsAreLoading"
            loading-text="Loading products"
        />
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
    name: "library-page",
    components: {
        "product-card": () => import("@/components/Shared/ProductCard"),
        "star-rating": () => import("vue-star-rating"),
        "multi-select": () => import("vue-multiselect"),
        "chip-marker": () => import("@/components/Shared/ChipMarker"),
        "loading-dots": () => import("@/components/Shared/LoadingDots"),
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
            cardsAreLoading: false,
            sortOptions: ["A-Z", "Z-A", "Most Popular"],
            selectedSort: "A-Z",
        };
    },

    computed: {
        ...mapState(["products"]),
        ...mapGetters(["allCategories", "allTopics", "allActiveProducts"]),
    },

    methods: {
        ...mapActions(["fetchCategoriesTopics", "updateProducts"]),
        filterProducts() {
            this.scrollerData = []; // reset the virtual scroller
            this.filteredProducts = JSON.parse(
                JSON.stringify([...this.allActiveProducts])
            ); // reset to starting dataset
            // check for category matches (inclusive)
            if (this.selectedCategories.length > 0) {
                this.filteredProducts = this.allActiveProducts.filter((prod) =>
                    this.selectedCategories.some(
                        (sc) => sc.id == prod.category.id
                    )
                );
            }
            // check for topic matches (exclusive)
            if (this.selectedTopics.length > 0) {
                const topicIdArray = this.selectedTopics.map(
                    (topic) => topic.name
                );
                this.filteredProducts = this.filteredProducts.filter((prod) =>
                    topicIdArray.every((name) =>
                        prod.topics.some((topic) => topic.name == name)
                    )
                );
            }
            if (this.searchString !== "") {
                this.filteredProducts = this.filteredProducts.filter(
                    (prod) =>
                        prod.name
                            .toLowerCase()
                            .includes(this.searchString.toLowerCase()) ||
                        prod.description
                            .toLowerCase()
                            .includes(this.searchString.toLowerCase())
                );
            }
            if (this.selectedSort == "Z-A") {
                this.filteredProducts.reverse();
            } else if (this.selectedSort == "Most Popular") {
                this.filteredProducts = this.filteredProducts.sort((a, b) => {
                    if (a.rating == b.rating) {
                        return a.name > b.name ? 1 : -1;
                    }
                    return b.rating > a.rating ? 1 : -1;
                });
            }
            this.scrollSliceStart = 0;
            this.loadMoreCards();
        },
        appendCategoryQueryString() {
            this.$router.replace({
                name: "library",
                query: {
                    ...this.$route.query,
                    categories: this.selectedCategories
                        .map((category) => category.name)
                        .join(","),
                },
            });
        },
        categorySelected() {
            this.appendCategoryQueryString();
            this.filterProducts();
        },
        removeCategory(index) {
            this.selectedCategories.splice(index, 1);
            this.appendCategoryQueryString();
            this.filterProducts();
        },
        appendTopicQueryString() {
            this.$router.replace({
                name: "library",
                query: {
                    ...this.$route.query,
                    topics: this.selectedTopics
                        .map((topic) => topic.name)
                        .join(","),
                },
            });
        },
        goToReviews(e, productId) {
            e.stopPropagation();
            e.preventDefault();
            this.$router.push(`/product/${productId}/reviews`);
        },
        topicSelected() {
            this.appendTopicQueryString();
            this.filterProducts();
        },
        removeTopic(index) {
            this.selectedTopics.splice(index, 1);
            this.appendTopicQueryString();
            this.filterProducts();
        },
        searchByString() {
            this.$router.replace({
                name: "library",
                query: {
                    ...this.$route.query,
                    search: this.searchString,
                },
            });
            this.filterProducts();
        },
        loadMoreCards() {
            const page = this.filteredProducts.slice(
                this.scrollSliceStart,
                this.scrollSliceStart + this.scrollSliceIncrement
            );
            page.forEach((product) => {
                this.scrollerData.push(product);
            });
            this.scrollSliceStart += this.scrollSliceIncrement;
        },
        filterByQueryString(queryCategories, queryTopics, querySearch) {
            if (queryCategories) {
                queryCategories = queryCategories
                    .split(",")
                    .map((queryCategory) => queryCategory.toLowerCase());
                this.selectedCategories = this.allCategories.filter((cat) =>
                    queryCategories.includes(cat.name.toLowerCase())
                );
            }
            if (queryTopics) {
                queryTopics = queryTopics
                    .split(",")
                    .map((queryTopic) => queryTopic.toLowerCase());
                this.selectedTopics = this.allTopics.filter((topic) =>
                    queryTopics.includes(topic.name.toLowerCase())
                );
            }
            if (querySearch) {
                this.searchString = querySearch.toLowerCase();
            }

            this.filterProducts();
            this.cardsAreLoading = false;
        },
        sortChanged() {
            this.filterProducts();
        },
    },

    async mounted() {
        window.scrollTo(0, 0);
        // read query strings and handle filters as needed
        const queryCategories =
            this.$route.query.categories || this.$route.query.Categories;
        const queryTopics =
            this.$route.query.topics || this.$route.query.Topics;
        const querySearch =
            this.$route.query.search || this.$route.query.Search;
        const queryStringPresent =
            queryCategories || queryTopics || querySearch;

        this.cardsAreLoading = true;
        this.fetchCategoriesTopics();
        // show products immediately if they exist in store
        if (this.allActiveProducts.length > 0) {
            this.filteredProducts = this.allActiveProducts.filter(
                (product) => product.isActive == 1
            );
            if (!queryStringPresent) {
                this.loadMoreCards();
            } else {
                this.filterByQueryString(
                    queryCategories,
                    queryTopics,
                    querySearch
                );
            }
        }

        // if products were not in store, render the cards after store is populated
        await this.updateProducts();

        if (!queryStringPresent) {
            this.filterProducts();
            // set up virtual scroller
            this.scrollSliceStart = 0;
            this.scrollerData = [];
            this.loadMoreCards();
        } else {
            this.filterByQueryString(queryCategories, queryTopics, querySearch);
        }
        this.cardsAreLoading = false;
    },
};
</script>

<style lang="scss" scoped>
.library {
    padding: $standard-view;
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
        color: $gray;
        margin-right: 0.5rem;
    }
    .noTagsText {
        color: $gray;
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
            color: $orange;
        }
        ::v-deep .multiselect__content-wrapper {
            width: 17rem;
        }
        ::v-deep .multiselect__single {
            color: $orange;
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
    .sortControl {
        margin-left: auto;
        @include breakpoint(tablet-port) {
            margin-left: 0;
        }
    }
}

.cardContainer {
    width: $prodCardContainer-width;
    margin: 0 auto;
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
    width: $prodCardContainer-width;
    height: 0;
    margin: 0 auto;
}
::v-deep p.loading {
    text-align: left;
}
</style>
