<template>
  <div class="w-full">
    <Header></Header>
    <div class="w-full flex flex-col justify-end">
      <WorldCupTitle class=""></WorldCupTitle>
      <div class="w-full flex flex-row items-end justify-end">
        <NuxtImg
          src="/mrdwc_logo@2x.png"
          class="relative z-10 hidden sm:block sm:w-56 -ml-5 -mr-10 -mb-8"
        ></NuxtImg>
        <Countdown class=""></Countdown>
      </div>
    </div>
  </div>
</template>

<script setup></script>
