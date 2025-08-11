<template>
  <div>
    <ParagraphTitle :title="t('officials_application')"></ParagraphTitle>
    <div class="text-pretty">
      <p class="mb-6">{{ t("officials_application_text.line1") }}</p>
      <p class="">{{ t("officials_application_text.line2") }}</p>
      <p v-html="t('officials_application_text.date1', {
        date: formattedDate1,
      })
        "></p>
      <h3 class="text-yellow font-bold uppercase text-xl mt-6 mb-2">
        {{ t("timelines") }}
      </h3>
      <p
        class="mb-2"
        v-html="t('officials_application_text.date2', {
          date: formattedDate2,
        })
          "
      ></p>
      <p v-html="t('officials_application_text.date3', {
        date: formattedDate3,
      })
        "></p>
      <h3 class="text-yellow font-bold uppercase text-xl mt-6 mb-2">
        {{ t("forms") }}
      </h3>
      <NuxtLink
        to="https://docs.google.com/forms/d/e/1FAIpQLSeyz9bFn4MEuzbTU1Mj7qYZ1BMuNs2Qz6KJ6J_sW_VJ7UO29w/viewform"
        target="_blank"
        class="flex items-center gap-2 underline underline-offset-2"
      >
        <IconExternalLink class="w-3 text-blue-light"></IconExternalLink>
        <span>{{ t('officials_application_text.form1') }}</span>
      </NuxtLink>
      <NuxtLink
        to="https://docs.google.com/forms/d/e/1FAIpQLSd-AbAg8p8Oe9BjLqBZHHy-V-oUM_blWUhgncPbU6WJQ9kSUw/viewform"
        target="_blank"
        class="flex items-center gap-2 underline underline-offset-2"
      >
        <IconExternalLink class="w-3 text-blue-light"></IconExternalLink>
        <span>{{ t('officials_application_text.form2') }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconExternalLink from './icons/IconExternalLink.vue';

const { t, d } = useI18n();

const formattedDate1 = computed(() => {
  return `<strong>${d(new Date(2025, 7, 25, 0, 0, 0), "dmy")}</strong>`;
})
const formattedDate2 = computed(() => {
  return `<strong>${d(new Date(2025, 8, 12, 0, 0, 0), "dmy")}</strong>`;
})
const formattedDate3 = computed(() => {
  return `<strong>${d(new Date(2025, 9, 31, 0, 0, 0), "dmy")}</strong>`;
})
</script>

<style></style>