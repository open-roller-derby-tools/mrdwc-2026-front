/* import { createDirectus, rest, readItem, readItems } from "@directus/sdk";

const directus = createDirectus("https://ordwc.infinitespace.click").with(
  rest()
);

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: { directus, readItem, readItems },
  };
}); */

import {
  createDirectus,
  rest,
  readItem,
  readItems,
  type DirectusClient,
} from "@directus/sdk";
import type { Team, TeamMember } from "~~/types/custom";

interface Schema {
  teams: Team[];
  team_members: TeamMember[];
}

const directus: DirectusClient<Schema> = createDirectus<Schema>(
  "https://ordwc.infinitespace.click"
).with(rest());

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: { directus, readItem, readItems },
  };
});
