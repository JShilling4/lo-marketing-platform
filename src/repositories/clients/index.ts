import axios from "axios";

export const graphql = axios.create({
  baseURL: "",
});

export const rest = axios.create({
  baseURL: "",
});
