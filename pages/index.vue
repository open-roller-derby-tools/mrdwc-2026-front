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
        <div>
          <Venues></Venues>
          <OfficialLogos></OfficialLogos>
        </div>
        <div class="">
          <ParagraphTitle :title="t('teams_application')"></ParagraphTitle>
          <ParagraphTitle :title="t('officials_application')"></ParagraphTitle>
        </div>
      </div>
    </section>
    <Footer></Footer>
  </div>
</template>

<script setup>
const img = useImage();
const { t } = useI18n();

const backgroundStyles = computed(() => {
  const imgUrl = img('background@2x.png');
  return { backgroundImage: `url('${imgUrl}')` }
})
</script>

<style scoped></style>