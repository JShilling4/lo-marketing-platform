import { createPinia, type Pinia } from "pinia";

/** Pinia Store */
const pinia: Pinia = createPinia();

export default pinia;

// Pinia Stores
import { useCategoryStore } from "./categories";
import { useTopicStore } from "./topics";
import { useProductStore } from "./products";
import { useUserStore } from "./user";

export { useCategoryStore, useTopicStore, useProductStore, useUserStore };
