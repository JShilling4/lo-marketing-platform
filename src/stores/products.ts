import { defineStore } from "pinia";
import { productRepository } from "../repositories/productRepository";

export const useProductsStore = defineStore("products", {
  state: () => {
    return {
      products: [] as any,
      productReviews: [] as any,
    };
  },

  actions: {
    async getAllProducts() {
      const { data } = await productRepository.getAll();
      if (!data) return;

      this.products = data.marketingV1GetProduct;
      // Vue.toasted.success('Products data refreshed!');
    },

    async getProduct(id: any) {
      const { data } = await productRepository.get(id);
      if (!data) return;
      if (data.marketingV1GetProduct.length > 0) {
        const productIndex = this.products.findIndex(
          (product: any) => product.id == id
        );
        // udpate product
        const { product } = data.marketingV1GetProduct[0];
        if (productIndex >= 0) {
          this.products.splice(productIndex, 1, product);
        } else {
          this.products.push(product);
        }
      }
    },

    async postProduct(payload: any) {
      const { data } = await productRepository.post(payload);
      if (!data) return;

      const productIndex = this.products.findIndex(
        (product: any) => product.id == data.id
      );
      if (productIndex == -1) {
        // product doesnt exist, create it
        this.products.push(data);
        // Vue.toasted.success("Product successfully created!");
      } else {
        // product exists, update it
        Object.assign(this.products[productIndex], data);
        // Vue.toasted.success("Product successfully saved!");
      }
    },

    async bulkPostProducts(payload: any) {
      const { data } = await productRepository.bulkPost(payload);
      if (!data) return;

      // loop the product IDs and make the necessary mutations
      payload.productIds.forEach((id: any) => {
        const productIndex = this.products.findIndex(
          (product: any) => product.id == id
        );
        if (payload.category !== null) {
          this.products[productIndex].category = payload.category;
        }
        if (payload.assignTo !== null) {
          this.products[productIndex].assignTo = payload.assignTo;
        }
        if (payload.isActive !== null) {
          this.products[productIndex].isActive = payload.isActive;
        }
      });
    },
    // Vue.toasted.success("Bulk order update successful!");
  },

  getters: {
    productById: (state) => (id: any) =>
      state.products.find((product: any) => product.id == id),

    allProducts: (state) => state.products,

    allActiveProducts: (state) =>
      state.products.filter((product: any) => product.isActive === 1),

    allDiscoverProducts: (state) =>
      state.products.filter((product: any) => product.displayDiscover === 1),

    allCatalogProducts: (state) =>
      state.products.filter((product: any) => product.displayRealtor === 1),
  },
});
