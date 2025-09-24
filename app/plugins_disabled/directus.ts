// NOTE: Disabled because using standard $fetch is easier after all
import {
  createDirectus,
  rest,
  readItem,
  readItems,
  type DirectusClient,
} from "@directus/sdk";

import type { ISchema } from "~~/types/custom";

const directus: DirectusClient<ISchema> = createDirectus<ISchema>(
  "https://ordwc.infinitespace.click"
).with(rest());

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: { directus, readItem, readItems },
  };
});
