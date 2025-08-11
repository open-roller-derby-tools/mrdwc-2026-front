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
    <main class="bg-blue-dark py-16">
      <div class="maxed flex flex-col sm:flex-row gap-16">
        <div class="w-full sm:w-2/5">
          <Venues></Venues>
          <OfficialLogos></OfficialLogos>
        </div>
        <div class="w-full sm:w-3/5 text-lg">
          <TeamsParagraph></TeamsParagraph>
          <OfficialsParagraph></OfficialsParagraph>
        </div>
      </div>
    </main>
    <Footer></Footer>
  </div>
</template>

<script setup>
const img = useImage();

const backgroundStyles = computed(() => {
  const imgUrl = img("background@2x.png");
  return { backgroundImage: `url('${imgUrl}')` };
});
</script>

<style scoped></style>
