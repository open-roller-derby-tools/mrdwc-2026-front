<template>
  <div>
    <ParagraphTitle :title="t('teams_application')"></ParagraphTitle>
    <div class="text-pretty mb-12">
      <p>{{ t("teams_application_text.line1") }}</p>
      <h3 class="text-yellow font-bold uppercase text-xl mt-6 mb-2">
        {{ t("timelines") }}
      </h3>
      <p
        class="mb-2"
        v-html="t('teams_application_text.date1', {
          date: getFormattedDate(teamsDate1),
        })
          "
      ></p>
      <p v-html="t('teams_application_text.date2', {
        date: getFormattedDate(teamsDate2),
      })
        "></p>
      <h3 class="text-yellow font-bold uppercase text-xl mt-6 mb-2">
        {{ t("forms") }}
      </h3>
      <NuxtLink
        to="https://docs.google.com/forms/d/e/1FAIpQLSe7f1zGTMb5Cji3Cdm5Evl0-XYIhVtPgfDE4egdenmr3XK11g/viewform"
        target="_blank"
        class="flex items-center gap-2 underline underline-offset-2"
      >
        <IconExternalLink class="w-3 text-blue-light"></IconExternalLink>
        <span>{{ t('teams_application_text.form1') }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconExternalLink from './icons/IconExternalLink.vue';

const { t, d } = useI18n();

const teamsDate1 = new Date(2025, 8, 1, 0, 0, 0);
const teamsDate2 = new Date(2025, 9, 1, 0, 0, 0);

const getFormattedDate = (date: Date) => {
  return `<strong>${d(date, "dmy")}</strong>`;
};
</script>

<style></style>