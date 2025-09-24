// NOTE: Disabled because using standard $fetch is easier after all
import {
  createDirectus,
  rest,
  readItem,
  readItems,
  type DirectusClient,
} from "@directus/sdk";

import type { Schema } from "~~/types/custom";

const directus: DirectusClient<Schema> = createDirectus<Schema>(
  "https://ordwc.infinitespace.click"
).with(rest());

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: { directus, readItem, readItems },
  };
});
