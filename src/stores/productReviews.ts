import { defineStore } from "pinia";

export const useProductReviewsStore = defineStore("productReviews", {
  state: () => {
    return {
      productReviews: [] as any,
    };
  },

  actions: {
    async updateProductReviews(payload: any) {
      const { data } = await productReviewRepository.getAll(payload);
      if (!data) return;

      if (data.marketingV1GetProductReview.length > 0) {
        this.productReviews = data.marketingV1GetProductReview;
      }
    },

    async updateProductReview(payload: any) {
      const { data } = await productReviewRepository.get(payload);
      if (!data) return;

      if (data.marketingV1GetProductReview.length > 0) {
        const reviewIndex = this.productReviews.findIndex(
          (product: any) => product.id == payload.productId
        );
        const { review } = payload;
        if (reviewIndex >= 0) {
          this.productReviews.splice(reviewIndex, 1, review);
        } else {
          this.productReviews.push(review);
        }
      }
    },

    async createProductReview(payload: any) {
      const { data } = await productReviewRepository.post(payload);
      if (!data) return;

      const reviewIndex = this.productReviews.findIndex(
        (review: any) => review.product.id == payload.productId
      );
      if (reviewIndex >= 0) {
        this.productReviews.splice(reviewIndex, 1, data.review);
      } else {
        this.productReviews.push(data.review);
      }
    },

    async deleteProductReview(payload: any) {
      const { data } = await productReviewRepository.delete(payload);
      if (!data) return;

      const reviewIndex = this.productReviews.findIndex(
        (review: any) =>
          review.product.id == payload.productId &&
          review.employee.employeeNumber == payload.employeeNumber
      );
      this.productReviews.splice(reviewIndex, 1);
      // Vue.toasted.success("Review successfully deleted.");
    },
  },

  getters: {
    productReviewsByProductId: (state) => (productId: any) =>
      state.productReviews.filter(
        (review: any) => review.product.id == productId
      ),
  },
});
