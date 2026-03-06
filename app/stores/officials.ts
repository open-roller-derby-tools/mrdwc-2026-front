/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores
 
 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia";
import type {
  IOfficialsCrewsRequestData,
  IOfficialsCrew,
  ILocalizedOfficialsCrew,
  ILocalizedOfficial,
} from "~~/types/custom";

export const useOfficialsStore = defineStore("officials", () => {
  const { locale, fallbackLocale } = useI18n();

  const isReady = ref<boolean>(false);
  const officials = ref<IOfficialsCrew[]>();

  /**
   * Fetch data from the API.
   * Skips the network request when data was already loaded (e.g. from a previous call during the same server run).
   */
  async function fetch() {
    if (isReady.value && officials.value != null) {
      return officials.value;
    }
    try {
      const fields = {
        id: true,
        name: true,
        secret_name: true,
        color: true,
		members_so: {
			officials_id: {
				id: true,
				name: true,
				country: true,
				roles: true,
			},
		},
		members_nso: {
			officials_id: {
				id: true,
				name: true,
				country: true,
				roles: true,
			},
		},
      };
      const { data } = await $fetch<IOfficialsCrewsRequestData>(
        buildRESTURL("officials_crews", fields).href
      );

      officials.value = data;
      isReady.value = true;
      return data;
    } catch (error) {
      console.error("Error fetching officials:", error);
      isReady.value = false;
      throw error;
    }
  }

  /**
   * Return an array of localized officials crews.
   * This getter transforms the raw officials data into a structure suitable for localized display.
   * Flattens the nested officials_id structure and maps members to proper IOfficial objects.
   */
  const localizedOfficials = computed((): ILocalizedOfficialsCrew[] => {
    const list: ILocalizedOfficialsCrew[] = [];

    officials.value?.forEach((crew: IOfficialsCrew) => {
      // Flatten members_so array by extracting officials_id
      const members_so: ILocalizedOfficial[] = (crew.members_so as any[])?.map((member: any) => ({
        id: member.officials_id?.id || 0,
        name: member.officials_id?.name || "",
        country: member.officials_id?.country || "",
        roles: member.officials_id?.roles || [],
      })) || [];

      // Flatten members_nso array by extracting officials_id
      const members_nso: ILocalizedOfficial[] = (crew.members_nso as any[])?.map((member: any) => ({
        id: member.officials_id?.id || 0,
        name: member.officials_id?.name || "",
        country: member.officials_id?.country || "",
        roles: member.officials_id?.roles || [],
      })) || [];

      let l_crew: ILocalizedOfficialsCrew = {
        id: crew.id,
        name: crew.name,
        secret_name: crew.secret_name,
        color: crew.color,
        members_so,
        members_nso,
      };

      list.push(l_crew);
    });

    return list;
  });

  /**
   * Expose the required properties, getters and actions
   */
  return { fetch, isReady, officials, localizedOfficials };
});
