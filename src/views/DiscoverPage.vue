<template>
  <div class="discover">
    <h1 class="heading">Discover</h1>

    <div class="discover__utilityBar">
      <div class="search">
        <i class="fas fa-search"></i>
        <input type="search" placeholder="Search" />
      </div>
      <app-button v-if="userIsAdmin" classes="btn btn-orange" @click.native="addIdeaShowing = true" text="Add an Idea" />
    </div>

    <div class="content-container">
      <div class="resources-products">
        <ul class="cardFilter">
          <li
            :class="{ '--selected': showcaseFilterSelection == 'All' }"
            @click="showcaseFilterSelection = 'All'"
          >
            All
          </li>
          <li
            :class="{ '--selected': showcaseFilterSelection == 'Products' }"
            @click="showcaseFilterSelection = 'Products'"
          >
            Products
          </li>
          <li
            :class="{ '--selected': showcaseFilterSelection == 'Resources' }"
            @click="showcaseFilterSelection = 'Resources'"
          >
            Resources
          </li>
        </ul>

        <transition-group
          tag="div"
          name="list"
          class="cardRow"
        >
          <div v-for="item in showcaseItems" :key="item.id" class="cardContainer">
            <product-card
              v-if="item.hasOwnProperty('productImages')"
              :key="item.id"
              :details="item"

            >
              <slot>
                <router-link :to="`/product/${item.id}`" class="btn btn-orange">Order</router-link>
                <ul class="statRow__statList">
                  <li>
                    <star-rating
                      :star-size="25"
                      :show-rating="false"
                      :increment="0.5"
                      :read-only="true"
                      :rating="item.rating"
                    />
                  </li>
                </ul>
              </slot>
            </product-card>

            <resource-card
              v-else
              :key="item.id"
              :resource="item"
            />
          </div>
          <div class="emptyRowFiller" key="filler1"></div>
          <div class="emptyRowFiller" key="filler2"></div>
          <!-- <div class="emptyRowFiller" key="filler3"></div> -->
        </transition-group>
      </div>

      <div class="ideas">
        <ul class="cardFilter --ideas">
          <li :class="{ '--selected': sideFilterSelection == 'All' }">All</li>
          <li :class="{ '--selected': sideFilterSelection == 'Ideas' }">Ideas</li>
          <li :class="{ '--selected': sideFilterSelection == 'Polls' }">Polls</li>
        </ul>
        <idea-card
          v-for="idea in ideas.ideas"
          :key="idea.id"
          :details="idea"
          :active-user="users.activeUser"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
// components
import StarRating from 'vue-star-rating';
import IdeaCard from '@/components/DiscoverPage/IdeaCard';
import AddIdea from '@/components/DiscoverPage/AddIdea';
import ProductCard from '@/components/Shared/ProductCard';
import ResourceCard from '@/components/Shared/ResourceCard';

export default {
  name: 'discover-page',
  components: {
    'product-card': ProductCard,
    'resource-card': ResourceCard,
    'star-rating': StarRating,
    'idea-card': IdeaCard,
    'app-button': () => import('@/components/Shared/AppButton'),
  },
  data() {
    return {
      showcaseFilterSelection: 'All',
      sideFilterSelection: 'All',
    };
  },
  computed: {
    ...mapState(['users', 'products', 'ideas', 'auth']),
    ...mapGetters(['allDiscoverProducts', 'allResources']),
    showcaseItems() {
      if (this.showcaseFilterSelection == 'Products') {
        return this.allDiscoverProducts;
      }
      if (this.showcaseFilterSelection == 'Resources') {
        return this.allResources;
      }
      return this.allDiscoverProducts.concat(this.allResources);
    },
    userIsAdmin() {
      try {
        return this.users.activeUser.userRoles.includes('ROLE_MARKETING_EMPLOYEE');
      } catch (error) { /* shhhh */ }
      return false;
    },
  },
  methods: {
    ...mapActions(['addCommentToIdea', 'updateProducts']),
    filterShowcase() {},
  },
  sockets: {
    addIdeaComment(data) {
      const { ideaId, comment } = data;
      this.addCommentToIdea({ ideaId, comment });
    },
  },
  mounted() {
    this.updateProducts();
  },
};
</script>

<style lang="scss" scoped>
.discover {
  position: relative;
  padding: $standard-view;
  &__utilityBar {
    display: flex;
    justify-content: space-between;
    margin: 2rem 0 4rem;
    .search {
      position: relative;
      input {
        height: 2.5rem;
        width: 35rem;
        padding: 0 0.5rem 0 2.5rem;
        border-radius: 5rem;
        border: 1px solid $gray;
        &:focus,
        &:active {
          outline: none;
        }
      }
      .fa-search {
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        color: $gray;
      }
    }
    button {
      &:hover {
        background-color: $orange;
        color: #fff;
      }
    }
  }
  .cardFilter {
    display: flex;
    margin: 0 0 3rem 0.5rem;
    .--selected {
      color: #000;
    }
    li {
      margin-right: 4rem;
      font-weight: 600;
      color: $gray;
      cursor: pointer;
    }
    &.--ideas {
      justify-content: flex-end;
      margin: 0 0.5rem 3rem 4rem;
      li {
        margin-left: 4rem;
        margin-right: 0;
      }
    }
  }
}

// content layout
.content-container {
  display: flex;
}
.resources-products {
  width: 75%;
}
.ideas {
  width: 25%;
}

// products/resources
.cardContainer {
  width: 21%;
  min-width: 30rem;
  margin-right: 8rem;
}
.cardRow {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 0 4px;
}
.emptyRowFiller {
  width: 21%;
  min-width: 30rem;
  height: 0;
}

</style>
