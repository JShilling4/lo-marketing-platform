<template>
  <div class="base-pagination">
    <i
      class="fas fa-angle-left pageDirectionControl --prev"
      :disabled="isPreviousButtonDisabled"
      @click="previousPage"
    />

    <base-pagination-trigger
      v-for="paginationTrigger in paginationTriggers"
      :class="{
        '--current': paginationTrigger === currentPage
      }"
      :key="paginationTrigger"
      :pageNumber="paginationTrigger"
      @loadPage="onLoadPage"
    />

    <i
      class="fas fa-angle-right pageDirectionControl --next"
      :disabled="isNextButtonDisabled"
      @click="nextPage"
    />
  </div>
</template>

<script>
import BasePaginationTrigger from '@/components/Shared/Pagination/BasePaginationTrigger';

export default {
  name: 'BasePaginiation',
  components: {
    'base-pagination-trigger': BasePaginationTrigger,
  },
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    pageCount: {
      type: Number,
      required: true,
    },
    visiblePagesCount: {
      type: Number,
      default: 9,
    },
  },
  computed: {
    isPreviousButtonDisabled() {
      return this.currentPage === 1;
    },
    isNextButtonDisabled() {
      return this.currentPage === this.pageCount;
    },
    paginationTriggers() {
      const { currentPage } = this;
      const { pageCount } = this;
      const { visiblePagesCount } = this;
      const visiblePagesThreshold = (visiblePagesCount - 1) / 2;
      const paginationTriggersArray = Array(this.visiblePagesCount - 1).fill(0);

      if (pageCount < visiblePagesCount) {
        const paginationTriggers = [];
        for (let i = 0; i < pageCount; i++) {
          paginationTriggers.push(i + 1);
        }
        return paginationTriggers;
      }

      if (currentPage <= visiblePagesThreshold + 1) {
        paginationTriggersArray[0] = 1;
        const paginationTriggers = paginationTriggersArray.map(
          (paginationTrigger, index) => paginationTriggersArray[0] + index,
        );
        paginationTriggers.push(pageCount);
        return paginationTriggers;
      }

      if (currentPage >= pageCount - visiblePagesThreshold + 1) {
        const paginationTriggers = paginationTriggersArray.map(
          (paginationTrigger, index) => pageCount - index,
        );
        paginationTriggers.reverse().unshift(1);
        return paginationTriggers;
      }

      paginationTriggersArray[0] = currentPage - visiblePagesThreshold + 1;
      const paginationTriggers = paginationTriggersArray.map(
        (paginationTrigger, index) => paginationTriggersArray[0] + index,
      );
      paginationTriggers.unshift(1);
      paginationTriggers[paginationTriggers.length - 1] = pageCount;
      return paginationTriggers;
    },
  },
  methods: {
    nextPage() {
      this.$emit('nextPage');
    },
    previousPage() {
      this.$emit('previousPage');
    },
    onLoadPage(value) {
      this.$emit('loadPage', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.pageDirectionControl {
  color: $gray;
  font-size: 20px;
  cursor: pointer;
  &[disabled] {
    display: none;
  }
  &.--prev {
    margin-right: 2rem;
  }
  &.--next {
    margin-left: 2rem;
  }
}
</style>
