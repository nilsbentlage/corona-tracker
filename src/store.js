import { writable } from "svelte/store";

export const districtStore = writable(
  JSON.parse(localStorage.getItem("districts"))
);
