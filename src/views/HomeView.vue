<script setup>
/* ----------------------- Imports ---------------------- */
import { ref, computed } from 'vue';
import flipbook from 'flipbook-vue';
import { onClickOutside } from '@vueuse/core';
import i18n from '@/locales/i18n';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const isLoading = ref(false);

// FlipBook
window.addEventListener('keydown', (ev) => {
  const flipbook = this.$refs.flipbook;
  if (!flipbook) return;
  if (ev.keyCode == 37 && flipbook.canFlipLeft) flipbook.flipLeft();
  if (ev.keyCode == 39 && flipbook.canFlipRight) flipbook.flipRight();
});

// Passport
const isNormalPassportOpen = ref(false);
const isDiplomaticPassportOpen = ref(false);
const isServicePassportOpen = ref(false);
const isSpecialPassportOpen = ref(false);
const passport = ref(null);
onClickOutside(passport, (isNormalPassportOpen.value = false));

// For Preloading
const normalPassportImage = new Image();
const dimpolaticPassportImage = new Image();
const specialPassportImage = new Image();
const servicePassportImage = new Image();
normalPassportImage.src = '/images/passport/normal.png';
dimpolaticPassportImage.src = '/images/passport/diplomatic.png';
specialPassportImage.src = '/images/passport/special.png';
servicePassportImage.src = '/images/passport/service.png';
//#region Passport Images
const normalPages = ref([
  'images/passport/45.jpg',
  'images/passport/44.jpg',
  'images/passport/43.jpg',
  'images/passport/42.jpg',
  'images/passport/45.jpg',
  'images/passport/44.jpg',
  'images/passport/43.jpg',
  'images/passport/42.jpg',
  'images/passport/normal.png',
]);
const servicePages = ref([
  'images/passport/45.jpg',
  'images/passport/44.jpg',
  'images/passport/43.jpg',
  'images/passport/42.jpg',
  'images/passport/45.jpg',
  'images/passport/44.jpg',
  'images/passport/43.jpg',
  'images/passport/42.jpg',
  'images/passport/service.png',
]);
const diplomaticPages = ref([
  'images/passport/45.jpg',
  'images/passport/44.jpg',
  'images/passport/43.jpg',
  'images/passport/42.jpg',
  'images/passport/45.jpg',
  'images/passport/44.jpg',
  'images/passport/43.jpg',
  'images/passport/42.jpg',
  'images/passport/diplomatic.png',
]);
const specialPages = ref([
  'images/passport/45.jpg',
  'images/passport/44.jpg',
  'images/passport/43.jpg',
  'images/passport/42.jpg',
  'images/passport/45.jpg',
  'images/passport/44.jpg',
  'images/passport/43.jpg',
  'images/passport/42.jpg',
  'images/passport/special.png',
]);
//#endregion

// Language
const lang = computed(() => {
  return i18n.global.locale;
});

// Animations
let headingBeforeEnter;
let headingEnter;
let subheadingBeforeEnter;
let subheadingEnter;
let buttonBeforeEnter;
let buttonEnter;
let passportBeforeEnter;
let passportEnter;
// Heading
headingBeforeEnter = (el) => {
  el.style.transform = 'translateX(100vw)';
};
headingEnter = (el) => {
  gsap.to(el, {
    x: 0,
    duration: 1,
    ease: true,
  });
};

// Subheading
subheadingBeforeEnter = (el) => {
  el.style.transform = 'translateX(100vw)';
};
subheadingEnter = (el) => {
  gsap.to(el, {
    x: 0,
    duration: 1,
    delay: 0.2,
    ease: true,
  });
};

buttonEnter = (el) => {
  gsap.to(el, {
    xPercent: -50,
    left: '50%',
    y: -550,
    scale: 1.2,
    ease: true,
    scrollTrigger: {
      trigger: '.video',
      start: 'top bottom',
      end: 'top top',
      scrub: 1,
    },
  });
};
</script>

<template>
  <MainLoader
    v-if="isLoading"
    :isTransparent="true" />
  <div
    :class="
      isNormalPassportOpen ||
      isDiplomaticPassportOpen ||
      isServicePassportOpen ||
      isServicePassportOpen
        ? 'h-screen overflow-hidden'
        : ''
    "
    class="w-full overflow-hidden relative z-20">
    <NavBar />

    <!--------------------- Hero Section --------------------->
    <div
      class="relative flex flex-row justify-between px-8 pt-32 xl:pt-0 xl:px-48 xl:min-h-[80vh]">
      <!-- Right Section -->
      <div
        class="flex flex-col justify-center -mt-20"
        v-if="!isLoading">
        <img
          class="fixed -right-16 -bottom-16 opacity-10 -z-10"
          src="/images/logos/iraq.svg"
          alt="" />
        <transition
          appear
          @before-enter="headingBeforeEnter"
          @enter="headingEnter">
          <h1
            :class="lang == 'ku' ? 'max-w-[25ch]' : 'max-w-[15ch]'"
            class="text-3xl xl:text-5xl font-bold leading-10 xl:leading-[1.5em] text-primary dark:text-primary_dark"
            v-if="!isLoading">
            {{ $t('home_heading') }}
          </h1>
        </transition>
        <transition
          appear
          @before-enter="subheadingBeforeEnter"
          @enter="subheadingEnter">
          <h2
            class="text-on_background_variant dark:text-primary_dark text-lg xl:text-xl mt-4 max-w-[35ch] xl:max-w-[55ch]"
            v-if="!isLoading">
            {{ $t('home_subheading') }}
          </h2>
        </transition>
        <transition
          appear
          @before-enter="buttonBeforeEnter"
          @enter="buttonEnter">
          <a
            class="mt-80 fixed z-50"
            href="https://eservice.iraqinationality.gov.iq/pssservice_ara/start.swe"
            target="_blank">
            <MainButton
              class="mt-6 xl:mt-10 h-14 button shadow-xl border-on_primary border-2"
              :text="$t('apply_now')">
              <PhCaretLeft
                :class="lang == 'en' ? 'rotate-180' : ''"
                class="fill-on_primary dark:fill-on_primary_dark w-6 h-6 duration-300" />
            </MainButton>
          </a>
        </transition>
      </div>

      <!-- Left Section -->
      <div
        :class="lang == 'en' ? 'mr-32' : 'ml-56'"
        class="hidden xl:flex items-center justify-center">
        <transition
          appear
          @enter="passportEnter">
          <img
            class="absolute rotate-[6deg] transition-all duration-300 hover:scale-[105%] hover:-translate-y-12 hover:rotate-[8deg] hover:brightness-125 cursor-pointer w-72 z-50"
            @click="isNormalPassportOpen = true"
            v-if="!isLoading"
            :src="normalPassportImage.src"
            alt="" />
        </transition>
        <transition
          enter-active-class="duration-500 delay-[900ms] ease-in-out"
          enter-from-class="opacity-0 -translate-x-64">
          <img
            class="absolute rotate-[2deg] -translate-x-5 -translate-y-3 transition-all duration-300 hover:scale-[105%] hover:-translate-y-16 hover:brightness-125 cursor-pointer w-72 z-40"
            @click="isDiplomaticPassportOpen = true"
            v-if="!isLoading"
            :src="dimpolaticPassportImage.src"
            alt="" />
        </transition>
        <transition
          enter-active-class="duration-500 delay-[1100ms] ease-in-out"
          enter-from-class="opacity-0 -translate-x-64">
          <img
            class="absolute -rotate-2 -translate-x-10 -translate-y-6 transition-all duration-300 hover:scale-[105%] hover:-translate-y-16 hover:brightness-125 cursor-pointer w-72 z-30"
            @click="isSpecialPassportOpen = true"
            v-if="!isLoading"
            :src="specialPassportImage.src"
            alt="" />
        </transition>
        <transition
          enter-active-class="duration-500 delay-[1300ms] ease-in-out"
          enter-from-class="opacity-0 -translate-x-64">
          <img
            class="absolute -translate-x-14 -translate-y-8 -rotate-[6deg] transition-all duration-300 hover:scale-[105%] hover:-rotate-[8deg] hover:brightness-125 hover:-translate-y-20 cursor-pointer w-72"
            @click="isServicePassportOpen = true"
            v-if="!isLoading"
            :src="servicePassportImage.src"
            alt="" />
        </transition>
      </div>
    </div>

    <!--------------------- Video Section --------------------->
    <div
      id="video"
      class="w-full flex flex-col xl:flex-row bg-primary dark:bg-primary_dark p-8 xl:px-48 xl:pt-16 mt-24 video">
      <VideoSlider />
    </div>

    <!-------------------- Latest News -------------------->
    <div
      id="news"
      class="w-full flex flex-col p-8 xl:px-48 mt-4">
      <div class="flex flex-col gap-2 xl:gap-6">
        <h3
          class="text-primary dark:text-primary_dark text-2xl xl:text-4xl font-bold">
          {{ $t('news_heading') }}
        </h3>
      </div>

      <!-- Cards -->
      <div class="flex flex-col xl:flex-row gap-4 mt-6 xl:mt-10">
        <NewsSlider />
      </div>
    </div>

    <!-------------------- Latest Blogs -------------------->
    <div
      id="blogs"
      class="w-full flex flex-col p-8 xl:px-48 mt-4">
      <div class="flex flex-col gap-2 xl:gap-6">
        <h3
          class="text-primary dark:text-primary_dark text-2xl xl:text-4xl font-bold">
          {{ $t('blogs_heading') }}
        </h3>
      </div>

      <!-- Cards -->
      <div class="flex flex-col xl:flex-row gap-4 mt-6 xl:mt-10">
        <BlogSlider />
      </div>
    </div>

    <!---------------------- Contact Us ---------------------->
    <ContactForm />
    <MainFooter />
  </div>

  <!-- Flip Books -->
  <div>
    <div
      class="bg-background_dark bg-opacity-50 fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center z-[90]"
      v-if="isNormalPassportOpen">
      <flipbook
        dir="rtl"
        class="w-[70vw] h-[70vh] rounded-3xl flex flex-col items-center justify-end"
        ref="passport"
        v-slot="flipbook"
        :clickToZoom="false"
        :start-page="9"
        :gloss="0.1"
        :forwardDirection="left"
        :pages="normalPages"
        @flip-left-start="onFlipLeftStart"
        @flip-left-end="onFlipLeftEnd"
        @flip-right-start="onFlipRightStart"
        @flip-right-end="onFlipRightEnd">
        <div class="flex absolute gap-32 z-[90] bottom-16">
          <MainButton
            class="max-h-max"
            @click="flipbook.flipRight">
            <PhCaretLeft class="fill-on_primary w-6 h-6 rotate-180" />
          </MainButton>
          <MainButton
            class="max-h-max"
            @click="isNormalPassportOpen = false">
            <PhX class="fill-on_primary w-6 h-6" />
          </MainButton>
          <MainButton
            class="max-h-max"
            @click="flipbook.flipLeft">
            <PhCaretLeft class="fill-on_primary w-6 h-6" />
          </MainButton>
        </div>
      </flipbook>
    </div>

    <div
      class="bg-background_dark bg-opacity-50 fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center z-[90]"
      v-if="isDiplomaticPassportOpen"
      v-motion-fade>
      <flipbook
        dir="rtl"
        class="w-[70vw] h-[70vh] rounded-3xl flex flex-col items-center justify-end"
        ref="passport"
        v-slot="flipbook"
        :clickToZoom="false"
        :start-page="9"
        :gloss="0.1"
        :forwardDirection="left"
        :pages="diplomaticPages"
        @flip-left-start="onFlipLeftStart"
        @flip-left-end="onFlipLeftEnd"
        @flip-right-start="onFlipRightStart"
        @flip-right-end="onFlipRightEnd">
        <div class="flex absolute gap-32 z-[90] bottom-16">
          <MainButton
            class="max-h-max"
            @click="flipbook.flipRight">
            <PhCaretLeft class="fill-on_primary w-6 h-6 rotate-180" />
          </MainButton>
          <MainButton
            class="max-h-max"
            @click="isDiplomaticPassportOpen = false">
            <PhX class="fill-on_primary w-6 h-6" />
          </MainButton>
          <MainButton
            class="max-h-max"
            @click="flipbook.flipLeft">
            <PhCaretLeft class="fill-on_primary w-6 h-6" />
          </MainButton>
        </div>
      </flipbook>
    </div>
    <div
      class="bg-background_dark bg-opacity-50 fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center z-[90]"
      v-if="isServicePassportOpen"
      v-motion-fade>
      <flipbook
        dir="rtl"
        class="w-[70vw] h-[70vh] rounded-3xl flex flex-col items-center justify-end"
        ref="passport"
        v-slot="flipbook"
        :clickToZoom="false"
        :start-page="9"
        :gloss="0.1"
        :forwardDirection="left"
        :pages="servicePages"
        @flip-left-start="onFlipLeftStart"
        @flip-left-end="onFlipLeftEnd"
        @flip-right-start="onFlipRightStart"
        @flip-right-end="onFlipRightEnd">
        <div class="flex absolute gap-32 z-[90] bottom-16">
          <MainButton
            class="max-h-max"
            @click="flipbook.flipRight">
            <PhCaretLeft class="fill-on_primary w-6 h-6 rotate-180" />
          </MainButton>
          <MainButton
            class="max-h-max"
            @click="isServicePassportOpen = false">
            <PhX class="fill-on_primary w-6 h-6" />
          </MainButton>
          <MainButton
            class="max-h-max"
            @click="flipbook.flipLeft">
            <PhCaretLeft class="fill-on_primary w-6 h-6" />
          </MainButton>
        </div>
      </flipbook>
    </div>

    <div
      class="bg-background_dark bg-opacity-50 fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center z-[90]"
      v-if="isSpecialPassportOpen"
      v-motion-fade>
      <flipbook
        dir="rtl"
        class="w-[70vw] h-[70vh] rounded-3xl flex flex-col items-center justify-end"
        ref="passport"
        v-slot="flipbook"
        :clickToZoom="false"
        :start-page="9"
        :gloss="0.1"
        :forwardDirection="left"
        :pages="specialPages"
        @flip-left-start="onFlipLeftStart"
        @flip-left-end="onFlipLeftEnd"
        @flip-right-start="onFlipRightStart"
        @flip-right-end="onFlipRightEnd">
        <div class="flex absolute gap-32 z-[90] bottom-16">
          <MainButton
            class="max-h-max"
            @click="flipbook.flipRight">
            <PhCaretLeft class="fill-on_primary w-6 h-6 rotate-180" />
          </MainButton>
          <MainButton
            class="max-h-max"
            @click="isSpecialPassportOpen = false">
            <PhX class="fill-on_primary w-6 h-6" />
          </MainButton>
          <MainButton
            class="max-h-max"
            @click="flipbook.flipLeft">
            <PhCaretLeft class="fill-on_primary w-6 h-6" />
          </MainButton>
        </div>
      </flipbook>
    </div>
  </div>
</template>

<style scoped>
.button {
  animation: scale 1s alternate infinite ease-in-out;
}
@keyframes scale {
  0% {
    transform: translateY(0);
    filter: brightness(100%);
  }
  100% {
    transform: translateY(-0.7rem);
    filter: brightness(125%);
  }
}
</style>
