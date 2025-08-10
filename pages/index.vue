<template>
  <div
    :style="backgroundStyles"
    class="w-full bg-contain md:bg-size-[768px] bg-no-repeat"
  >
    <Header class="maxed"></Header>
    <section
      id="title-section"
      class="maxed flex flex-col justify-end py-8"
    >
      <WorldCupTitle></WorldCupTitle>
      <div class="w-full flex flex-row items-end justify-end my-8 sm:mt-0">
        <NuxtImg
          src="/mrdwc_logo@2x.png"
          class="relative z-10 hidden sm:block sm:w-56 -ml-5 -mr-10 -mb-8"
        ></NuxtImg>
        <Countdown class=""></Countdown>
      </div>
    </section>
    <section class="bg-blue-dark py-8">
      <div class="maxed flex flex-col sm:flex-row gap-16">
        <div class="w-full sm:w-2/5">
          <Venues></Venues>
          <OfficialLogos></OfficialLogos>
        </div>
        <div class="w-full sm:w-3/5 text-lg">
          <ParagraphTitle :title="t('teams_application')"></ParagraphTitle>
          <div class="text-pretty mb-12">
            <p>{{ t('teams_application_text.line1') }}</p>
            <h3 class="text-yellow font-bold uppercase text-xl mt-6 mb-2">{{ t('timelines') }}</h3>
            <p
              class="mb-2"
              v-html="t('teams_application_text.date1', { date: getFormattedDate(teamsDate1) })"
            ></p>
            <p v-html="t('teams_application_text.date2', { date: getFormattedDate(teamsDate2) })"></p>
          </div>
          <ParagraphTitle :title="t('officials_application')"></ParagraphTitle>
          <div class="text-pretty mb-12">
            <p class="mb-6">{{ t('officials_application_text.line1') }}</p>
            <p class="">{{ t('officials_application_text.line2') }}</p>
            <p v-html="t('officials_application_text.date1', { date: getFormattedDate(officialsDate1) })"></p>
            <h3 class="text-yellow font-bold uppercase text-xl mt-6 mb-2">{{ t('timelines') }}</h3>
            <p
              class="mb-2"
              v-html="t('officials_application_text.date2', { date: getFormattedDate(officialsDate2) })"
            ></p>
            <p v-html="t('officials_application_text.date3', { date: getFormattedDate(officialsDate3) })"></p>
          </div>
        </div>
      </div>
    </section>
    <Footer></Footer>
  </div>
</template>

<script setup>
const img = useImage();
const { t, d } = useI18n();

const backgroundStyles = computed(() => {
  const imgUrl = img('background@2x.png');
  return { backgroundImage: `url('${imgUrl}')` }
})

const teamsDate1 = new Date(2025, 8, 1, 0, 0, 0);
const teamsDate2 = new Date(2025, 9, 1, 0, 0, 0);
const officialsDate1 = new Date(2025, 7, 25, 0, 0, 0);
const officialsDate2 = new Date(2025, 8, 12, 0, 0, 0);
const officialsDate3 = new Date(2025, 9, 31, 0, 0, 0);

const getFormattedDate = (date) => {
  return `<strong>${d(date, "dmy")}</strong>`;
  // return d(officialsDate1, "dmy");
};

</script>

<style scoped></style>