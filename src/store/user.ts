// import type { User } from "@/types/user";
import { defineStore } from "pinia";
import { user } from "./mockData";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user,
    };
  },

  actions: {},

  getters: {},
});
