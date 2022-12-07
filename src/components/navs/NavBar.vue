<script setup>
/* ----------------------- Imports ---------------------- */
// Tools
import { ref, computed } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useDark, useToggle } from '@vueuse/core';

// Data
import { LANG_KEY } from '@/localStorageKeys';
import i18n from '@/locales/i18n';

/* ------------------------ Index ----------------------- */
const isMenuOpen = ref(false);

// Dark Mode
const isDark = useDark();
const toggleDark = useToggle(isDark);

// Language Switcher
const languageMenu = ref(null);
const languageButton = ref(null);
const isLanguageMenuOpen = ref(false);
onClickOutside(
  (languageMenu, languageButton),
  () => (isLanguageMenuOpen.value = false)
);

const lang = computed(() => {
  return i18n.global.locale;
});
const changeLang = (lang) => {
  localStorage.setItem(LANG_KEY, lang);
  i18n.global.locale = lang;
};
</script>

<template>
  <nav
    class="fixed bg-background dark:bg-background_dark xl:bg-transparent xl:dark:bg-transparent xl:relative z-[100] w-full flex items-center py-4 px-8 xl:px-24 xl:py-6 justify-between">
    <a class="flex relative gap-4 items-center" href="/">
      <img class="w-16 xl:w-20" src="/images/logos/interior.png" alt="" />
    </a>
    <div class="gap-4 hidden xl:flex xl:gap-6">
      <RouterLink
        class="text-xl text-on_background dark:text-on_background_dark hover:text-primary dark:hover:text-primary_dark transition-all duration-300 hover:-translate-y-1"
        to="/home">
        {{ $t('home') }}
      </RouterLink>
      <RouterLink
        class="text-xl text-on_background dark:text-on_background_dark hover:text-primary dark:hover:text-primary_dark transition-all duration-300 hover:-translate-y-1"
        to="/news">
        {{ $t('news') }}
      </RouterLink>
      <RouterLink
        class="text-xl text-on_background dark:text-on_background_dark hover:text-primary dark:hover:text-primary_dark transition-all duration-300 hover:-translate-y-1"
        to="/blogs">
        {{ $t('blogs') }}
      </RouterLink>
      <RouterLink
        class="text-xl text-on_background dark:text-on_background_dark hover:text-primary dark:hover:text-primary_dark transition-all duration-300 hover:-translate-y-1"
        to="/centers">
        {{ $t('applying_centers') }}
      </RouterLink>

      <RouterLink
        class="text-xl text-on_background dark:text-on_background_dark hover:text-primary dark:hover:text-primary_dark transition-all duration-300 hover:-translate-y-1"
        to="/instructions">
        {{ $t('instructions') }}
      </RouterLink>
      <RouterLink
        class="text-xl text-on_background dark:text-on_background_dark hover:text-primary dark:hover:text-primary_dark transition-all duration-300 hover:-translate-y-1"
        to="/features">
        {{ $t('passport_features') }}
      </RouterLink>
    </div>
    <div class="hidden xl:flex items-center xl:gap-6">
      <a href="/contact">
        <MainButton :text="$t('contact')" />
      </a>
      <transition enter-active-class="duration-700 ease-in-out" enter-from-class="-translate-y-96 rotate-180 opacity-0"
        leave-active-class="duration-700 ease-in-out" leave-to-class="-translate-y-96 rotate-180 opacity-0">
        <PhMoonStars v-if="!isDark" @click="toggleDark()" :class="lang === 'en' ? '-translate-x-16' : 'translate-x-16'"
          class="fill-on_primary absolute dark:fill-on_primary_dark w-12 h-12 bg-primary dark:bg-primary_dark rounded-full p-3 cursor-pointer transition-all duration-300 hover:brightness-125" />
      </transition>
      <transition enter-active-class="duration-700 ease-in-out" enter-from-class="-translate-y-96 rotate-180 opacity-0"
        leave-active-class="duration-700 ease-in-out" leave-to-class="-translate-y-96 rotate-180 opacity-0">
        <PhSun v-if="isDark" @click="toggleDark()" :class="lang === 'en' ? '-translate-x-16' : 'translate-x-16'"
          class="fill-on_primary absolute dark:fill-on_primary_dark w-12 h-12 bg-primary dark:bg-primary_dark rounded-full p-3 cursor-pointer transition-all duration-300 hover:brightness-125" />
      </transition>

      <!-- Language Switcher -->
      <div class="inline-block relative">
        <button class="rounded inline-flex items-center gap-2" ref="languageButton"
          @click="isLanguageMenuOpen = !isLanguageMenuOpen">
          <PhGlobe class="fill-primary dark:fill-primary_dark w-6 h-6 xl:h-7 xl:w-7" />
          <span class="text-primary dark:text-primary_dark text-xl" v-if="lang == 'ar'">العربية</span>
          <span class="text-primary dark:text-primary_dark text-xl" v-if="lang == 'en'">English</span>
          <span class="text-primary dark:text-primary_dark text-xl" v-if="lang == 'ku'">كوردى</span>
          <PhCaretLeft class="fill-primary dark:fill-primary_dark w-6 h-6 -rotate-90" />
        </button>
        <transition enter-active-class="duration-300 ease-in-out" enter-from-class="-translate-y-2 opacity-0"
          leave-active-class="duration-300 ease-in-out" leave-to-class="-translate-y-2 opacity-0">
          <ul
            class="mt-2 dropdown-menu absolute bg-background dark:bg-background_dark dark:border dark:border-primary_dark rounded-2xl shadow-lg w-full"
            v-if="isLanguageMenuOpen" ref="languageMenu">
            <li
              class="py-2 px-4 block text-lg hover:bg-primary hover:text-on_primary dark:hover:bg-primary_dark transition-all duration-300 rounded-t-xl whitespace-no-wrap text-on_background dark:text-on_background_dark cursor-pointer"
              @click="changeLang('ar')">
              العربية
            </li>
            <li
              class="py-2 px-4 block text-lg hover:bg-primary hover:text-on_primary dark:hover:bg-primary_dark transition-all duration-300 whitespace-no-wrap text-on_background dark:text-on_background_dark cursor-pointer"
              @click="changeLang('en')">
              English
            </li>
            <li
              class="py-2 px-4 block text-lg hover:bg-primary hover:text-on_primary dark:hover:bg-primary_dark transition-all duration-300 rounded-b-xl whitespace-no-wrap text-on_background dark:text-on_background_dark cursor-pointer"
              @click="changeLang('ku')">
              كوردى
            </li>
          </ul>
        </transition>
      </div>
    </div>
    <!------------------------- Mobile ------------------------->
    <!-- Mobile Menu Button -->
    <PhList class="w-8 h-8 xl:hidden fill-on_background dark:fill-on_background_dark" ref="button"
      @click="isMenuOpen = !isMenuOpen" />
  </nav>

  <!-- Mobile Menu Dropdown -->
  <transition enter-active-class="duration-300 ease-in-out" enter-from-class="opacity-0"
    leave-active-class="duration-300 ease-in-out" leave-to-class="opacity-0">
    <div class="fixed z-30 bg-on_background bg-opacity-50 w-screen h-screen" v-if="isMenuOpen"></div>
  </transition>
  <transition enter-active-class="duration-300 ease-in-out" enter-from-class="-translate-y-[30rem]"
    leave-active-class="duration-300 ease-in-out" leave-to-class="-translate-y-[30rem]">
    <nav
      class="flex flex-col fixed xl:hidden shadow-lg z-40 w-full items-start justify-center mt-20 gap-8 py-8 px-8 bg-background dark:bg-background_dark text-2xl"
      ref="menu" id="menu" v-if="isMenuOpen">
      <RouterLink class="text-xl text-on_background dark:text-on_background_dark flex gap-2 items-center" to="/home">
        <PhHouse class="fill-on_background dark:fill-primary_dark w-6 h-6" />

        {{ $t('home') }}
      </RouterLink>
      <RouterLink class="text-xl text-on_background dark:text-on_background_dark flex gap-2 items-center" to="/blogs">
        <PhFileText class="fill-on_background dark:fill-primary_dark w-6 h-6" />

        {{ $t('blogs') }}
      </RouterLink>
      <RouterLink class="text-xl text-on_background dark:text-on_background_dark flex gap-2 items-center" to="/news">
        <PhNewspaper class="fill-on_background dark:fill-primary_dark w-6 h-6" />

        {{ $t('news') }}
      </RouterLink>
      <RouterLink class="text-xl text-on_background dark:text-on_background_dark flex gap-2 items-center" to="/centers">
        <PhBuildings class="fill-on_background dark:fill-primary_dark w-6 h-6" />

        {{ $t('applying_centers') }}
      </RouterLink>
      <RouterLink class="text-xl text-on_background dark:text-on_background_dark flex gap-2 items-center"
        to="/instructions">
        <PhListChecks class="fill-on_background dark:fill-primary_dark w-6 h-6" />

        {{ $t('instructions') }}
      </RouterLink>
      <RouterLink class="text-xl text-on_background dark:text-on_background_dark flex gap-2 items-center"
        to="/features">
        <PhStarFour class="fill-on_background dark:fill-primary_dark w-6 h-6" />

        {{ $t('passport_features') }}
      </RouterLink>

      <div>
        <div class="flex text-xl gap-2 items-center justify-center text-primary dark:text-primary_dark" v-if="!isDark"
          @click="toggleDark()">
          <PhMoonStars
            class="fill-primary dark:fill-primary_dark w-6 h-6 cursor-pointer transition-all duration-300 hover:brightness-125" />
          {{ $t('dark_mode') }}
        </div>
        <div class="flex text-xl gap-2 items-center justify-center text-primary dark:text-primary_dark" v-if="isDark"
          @click="toggleDark()">
          <PhSun
            class="fill-primary dark:fill-primary_dark w-6 h-6 cursor-pointer transition-all duration-300 hover:brightness-125" />
          {{ $t('light_mode') }}
        </div>
      </div>
      <!-- Language Switcher -->
      <div class="dropdown inline-block relative">
        <button class="rounded inline-flex items-center gap-2" ref="languageButton"
          @click="isLanguageMenuOpen = !isLanguageMenuOpen">
          <PhGlobe class="fill-primary dark:fill-primary_dark w-6 h-6 xl:h-7 xl:w-7" />
          <span class="text-primary dark:text-primary_dark text-xl" v-if="lang == 'ar'">العربية</span>
          <span class="text-primary dark:text-primary_dark text-xl" v-if="lang == 'en'">English</span>
          <span class="text-primary dark:text-primary_dark text-xl" v-if="lang == 'ku'">كوردى</span>
          <PhCaretLeft class="fill-primary dark:fill-primary_dark w-6 h-6 -rotate-90" />
        </button>
        <transition enter-active-class="duration-300 ease-in-out" enter-from-class="-translate-y-2 opacity-0"
          leave-active-class="duration-300 ease-in-out" leave-to-class="-translate-y-2 opacity-0">
          <ul
            class="mt-2 dropdown-menu absolute bg-background dark:bg-background_dark dark:border dark:border-primary_dark rounded-2xl shadow-lg w-full"
            v-if="isLanguageMenuOpen" ref="languageMenu">
            <li
              class="py-2 px-4 block text-lg hover:bg-primary hover:text-on_primary dark:hover:bg-primary_dark transition-all duration-300 rounded-t-xl whitespace-no-wrap text-on_background dark:text-on_background_dark cursor-pointer"
              @click="changeLang('ar'), (isMenuOpen = false)">
              العربية
            </li>
            <li
              class="py-2 px-4 block text-lg hover:bg-primary hover:text-on_primary dark:hover:bg-primary_dark transition-all duration-300 whitespace-no-wrap text-on_background dark:text-on_background_dark cursor-pointer"
              @click="changeLang('en'), (isMenuOpen = false)">
              English
            </li>
            <li
              class="py-2 px-4 block text-lg hover:bg-primary hover:text-on_primary dark:hover:bg-primary_dark transition-all duration-300 rounded-b-xl whitespace-no-wrap text-on_background dark:text-on_background_dark cursor-pointer"
              @click="changeLang('ku'), (isMenuOpen = false)">
              كوردى
            </li>
          </ul>
        </transition>
      </div>
    </nav>
  </transition>
</template>

<style scoped>
.router-link-active {
  color: #0094da;
  font-weight: bold;
}
</style>
