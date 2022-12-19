import type { Product } from "@/types/product";
import { defineStore } from "pinia";
import { allProducts, getProduct } from "./mockData";

export const useProductsStore = defineStore("products", {
  state: () => {
    return {
      products: [] as Product[],
    };
  },

  actions: {
    async getAllProducts() {
      const data = allProducts;
      if (!data) return;

      this.products = data;
      // Vue.toasted.success('Products data refreshed!');
    },

    async getProduct(id: string) {
      const data = getProduct(id);
      if (!data) return;
      if (this.products.length > 0) {
        const productIndex = this.products.findIndex(
          (product: any) => product.id == id
        );
        // udpate product
        if (productIndex >= 0) {
          this.products.splice(productIndex, 1, data);
        } else {
          this.products.push(data);
        }
      }
    },

    // async postProduct(payload) {
    //   const { data } = await productRepository.post(payload);
    //   if (!data) return;

    //   const productIndex = this.products.findIndex(
    //     (product: any) => product.id == data.id
    //   );
    //   if (productIndex == -1) {
    //     // product doesnt exist, create it
    //     this.products.push(data);
    //     // Vue.toasted.success("Product successfully created!");
    //   } else {
    //     // product exists, update it
    //     Object.assign(this.products[productIndex], data);
    //     // Vue.toasted.success("Product successfully saved!");
    //   }
    // },

    // async bulkPostProducts(payload) {
    //   const { data } = await productRepository.bulkPost(payload);
    //   if (!data) return;

    //   // loop the product IDs and make the necessary mutations
    //   payload.productIds.forEach((id: any) => {
    //     const productIndex = this.products.findIndex(
    //       (product: any) => product.id == id
    //     );
    //     if (payload.category !== null) {
    //       this.products[productIndex].category = payload.category;
    //     }
    //     if (payload.assignTo !== null) {
    //       this.products[productIndex].assignTo = payload.assignTo;
    //     }
    //     if (payload.isActive !== null) {
    //       this.products[productIndex].isActive = payload.isActive;
    //     }
    //   });
    // },
    // Vue.toasted.success("Bulk order update successful!");
  },

  getters: {
    productById: (state) => (id: string) =>
      state.products.find((product) => product.id == id),

    allProducts: (state) => state.products,

    allActiveProducts: (state) =>
      state.products.filter((product) => product.isActive === true),

    allDiscoverProducts: (state): Product[] =>
      state.products.filter((product) => product.displayDiscover === true),

    allCatalogProducts: (state): Product[] =>
      state.products.filter((product) => product.displayRealtor === true),
  },
});
