import type { Category } from "@/types/category";
import { defineStore } from "pinia";
import { allCategories } from "./mockData";

export const useCategoryStore = defineStore("categories", {
  state: () => {
    return {
      categories: [] as Category[],
    };
  },

  actions: {
    async fetchCategories() {
      const data = allCategories;
      if (!data) return;

      this.categories = data;
    },
  },

  getters: {
    allCategories: (state) => state.categories,
    allCategories_short: (state) =>
      state.categories.map((c) => ({
        id: c.id,
        name: c.name,
      })),
    categoryById: (state) => (id: string) =>
      state.categories.find((c) => c.id == id),
    categoryByName: (state) => (name: string) =>
      state.categories.find((c) => c.name == name),
  },
});
