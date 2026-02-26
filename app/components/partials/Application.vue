<template>
  <div class="h-full bg-white text-blue-text rounded-2xl p-6 select-none flex flex-col gap-4">
    <div>
      <h3 class="text-red-text uppercase font-shoulders text-2xl">
        {{ application.name }}
      </h3>
      <p class="text-red-text font-bold">
        {{ t(`applications.status_${application.status}`) }}
      </p>
    </div>
    <div
      v-if="application.description"
      v-html="application.description"
    ></div>
    <ul class="grow">
      <li
        v-for="(date, i) in application.dates"
        :key="`date_${i}`"
      >
        <i18n-t
          scope="global"
          keypath="applications.date"
          tag="span"
        >
          <template v-slot:label><strong>{{ date.label }}</strong></template>
          <template v-slot:date>{{ date.date }}</template>
        </i18n-t>
      </li>
    </ul>
    <template v-if="applicationURL">
      <UButton
        v-if="application.status == 'open'"
        color="info"
        trailing-icon="i-lucide-arrow-right"
        size="xl"
        class="rounded-lg font-shoulders uppercase text-2xl text-secondary px-4 justify-between group hover:bg-yellow"
        :ui="{
          trailingIcon:
            'size-[32px] transition-transform duration-200 group-hover:translate-x-1',
        }"
        :to="applicationURL"
      >
        {{ t("applications.apply") }}
      </UButton>
      <UButton
        v-else
        icon="i-lucide-arrow-down-right"
        size="xl"
        class="font-shoulders uppercase text-2xl text-secondary px-0 group gap-1"
        :ui="{
          leadingIcon:
            'text-blue-light size-[32px] transition-transform duration-200 group-hover:-rotate-90',
        }"
        :to="applicationURL"
      >{{ t("applications.read_more") }}</UButton>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { ILocalizedApplication } from "~~/types/custom"
import { useOptionsStore } from "~/stores/options"

const { t } = useI18n()
const localePath = useLocalePath()
const optionsStore = useOptionsStore()

const props = defineProps<{
  application: ILocalizedApplication
}>()

const applicationURL = computed(() => {
  let url = `/${optionsStore.options?.applications_page.slug}` || ""
  if (url != "" && props.application.anchor_id) {
    url += `#${props.application.anchor_id}`
  }
  return localePath(url)
})
</script>

<style></style>
