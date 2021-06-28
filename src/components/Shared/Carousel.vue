<template>
  <div class="carousel-view">
    <i
      class="fas fa-angle-left carousel-view__previous"
      @click="previous"
    />
    <transition-group class="carousel" tag="div">
      <div
        v-for="slide in slides"
        class="slide"
        :key="slide.id"
        @click="$emit('slide-clicked', slide)"
      >
        <div v-if="showProofInfo" class="slideInfo">
          <span class="slideInfo__line">{{
            getCarouselImage(slide)
              .split("/")
              .pop()
          }}</span>
          <span class="slideInfo__line">{{ `Status: ${parsedSlideStatus(slide.status)}` }}</span>
        </div>
        <img :src="getCarouselImage(slide)" :class="slide.status" />
      </div>
    </transition-group>
    <i
      class="fas fa-angle-right carousel-view__next"
      @click="next"
    />
  </div>
</template>

<script>
/* eslint-disable global-require */
export default {
  name: 'Carousel',
  props: {
    deliverables: Array,
    showProofInfo: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      slides: [...this.deliverables],
    };
  },
  watch: {
    deliverables: {
      deep: true,
      handler() {
        this.slides = [...this.deliverables];
      },
    },
  },
  methods: {
    next() {
      const first = this.slides.shift();
      this.slides = this.slides.concat(first);
    },
    previous() {
      const last = this.slides.pop();
      this.slides = [last].concat(this.slides);
    },
    getCarouselImage(deliverable) {
      const image = deliverable.assets.find((asset) => asset.type == 'carousel');
      if (image) {
        return image.filepath;
      }
      return deliverable.assets.find((asset) => asset.type == 'raw').filepath;
    },
    parsedSlideStatus(status) {
      switch (status) {
        case 'final': {
          return 'Finalized';
        }
        case 'approved': {
          return 'Approved';
        }
        case 'underReview': {
          return 'Under Review';
        }
        case 'deprecated': {
          return 'Needs Revision';
        }
        default: {
          return 0;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.carousel-view {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__previous,
  &__next {
    position: absolute;
    top: 5rem;
    color: $gray;
    font-size: 1.7em;
    z-index: 100;
    cursor: pointer;
  }
  &__previous {
    left: 0;
  }
  &__next {
    right: 0;
  }
}
.carousel {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 90%;
  height: 12rem;
}
.slide {
  position: relative;
  margin: 1rem 1rem;
  flex: 0 0 16rem;
  height: 12rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease-in-out;
  background-size: cover;
  background-repeat: no-repeat;
  word-break: break-word;
  &:hover .slideInfo {
    display: flex;
  }
  .slideInfo {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    left: 0.5rem;
    top: 0.5rem;
    height: 100%;
    z-index: 11;
    padding-right: 0.5rem;
    &::after {
      content: "";
      position: absolute;
      display: inline-block;
      width: 100%;
      height: 100%;
      top: 0;
      background: transparent;
    }
    &:hover::after {
      cursor: url("~@/assets/images/eye_icon.png"), auto;
      opacity: 1;
    }
    &__line {
      display: block;
      color: #fff;
      font-size: 13px;
      margin-bottom: 1rem;
    }
  }
  &::after {
    content: "";
    position: absolute;
    display: inline-block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    opacity: 0;
    transition: all 0.7s;
    z-index: 10;
  }
  &:hover::after {
    cursor: url("~@/assets/images/eye_icon.png"), auto;
    opacity: 1;
  }
  img {
    max-height: 80px;
    width: 120px;
    box-shadow: $slideShadow;
    object-fit: cover;
  }
  .deprecated {
    border: 3px solid $orange;
  }
  .final, .approved {
    border: 3px solid $approved;
  }
}
</style>
