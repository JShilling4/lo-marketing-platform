import type { Topic } from "@/types/topic";
import { defineStore } from "pinia";
import { allTopics } from "./mockData";

export const useTopicStore = defineStore("topics", {
  state: () => {
    return {
      topics: [] as Topic[],
    };
  },

  actions: {
    async fetchTopics() {
      const data = allTopics;
      if (!data) return;

      this.topics = data;
    },
  },

  getters: {
    allTopics: (state) => state.topics,
  },
});
