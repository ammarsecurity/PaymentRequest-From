<script setup>
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

const props = defineProps({
  path: String,
});
const menu = ref(null);
const button = ref(null);
const isMenuOpen = ref(false);
onClickOutside((menu, button), () => (isMenuOpen.value = false));

const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
};


const fullName = localStorage.getItem('fullName');
const email = localStorage.getItem('email');


const logoutMenu = ref(null);
const logoutButton = ref(null);
const isLogoutMenuOpen = ref(false);
onClickOutside(
  (logoutMenu, logoutButton),
  () => (isLogoutMenuOpen.value = false)
);
</script>
<template>
  <nav
    class="fixed xl:relative flex items-center justify-between px-8 bg-background shadow-md w-full z-50 py-4"
    v-motion-slide-top>
    <!-- Path -->
    <div class="flex xl:text-xl text-on_background_variant">
      <span class="hidden xl:flex"> صفحة التحكم / {{ path }} </span>
      <!-- Navigation Mobile -->
      <div class="dropdown inline-block relative">
        <button
          class="rounded inline-flex items-center gap-2 xl:hidden"
          ref="button"
          @click="isMenuOpen = !isMenuOpen">
          <span class="text-primary text-xl">{{ path }}</span>

          <PhCaretLeft class="fill-primary w-6 h-6 -rotate-90" />
        </button>
        <transition
          enter-active-class="duration-300 ease-in-out"
          enter-from-class="-translate-y-2 opacity-0"
          leave-active-class="duration-300 ease-in-out"
          leave-to-class="-translate-y-2 opacity-0">
          <ul
            class="mt-2 dropdown-menu absolute bg-background rounded-2xl shadow-lg"
            v-if="isMenuOpen"
            ref="menu">
            <RouterLink to="/dashboard/settings">
              <li class="py-2 px-4 block text-lg">اعدادات الموقع</li>
            </RouterLink>
            <RouterLink to="/dashboard/news">
              <li class="py-2 px-4 block text-lg">الاخبار</li>
            </RouterLink>
            <RouterLink to="/dashboard/blogs">
              <li class="py-2 px-4 block text-lg">المقالات</li>
            </RouterLink>
            <RouterLink to="/dashboard/messages">
              <li class="py-2 px-4 block text-lg">الرسائل</li>
            </RouterLink>
            <RouterLink to="/dashboard/videos">
              <li class="py-2 px-4 block text-lg">الفيديوهات</li>
            </RouterLink>
            <RouterLink to="/dashboard/instructions">
              <li class="py-2 px-4 block text-lg">التعليمات</li>
            </RouterLink>
            <RouterLink to="/dashboard/features">
              <li class="py-2 px-4 block text-lg">المميزات</li>
            </RouterLink>
            <RouterLink to="/dashboard/centers">
              <li class="py-2 px-4 block text-lg">مراكز التقديم</li>
            </RouterLink>
          </ul>
        </transition>
      </div>
    </div>
    <!-- Log Out -->
    <div class="dropdown inline-block relative">
      <div
        class="flex items-center justify-center gap-2 cursor-pointer hover:brightness-150 duration-300"
        ref="logoutButton"
        @click="isLogoutMenuOpen = !isLogoutMenuOpen">
        <PhCaretLeft class="h-6 w-6 -rotate-90 fill-primary" />
        <h5 class="text-xl text-primary">{{email}}</h5>
        <PhUser class="h-10 w-10" />
      </div>
      <transition
        enter-active-class="duration-300 ease-in-out"
        enter-from-class="-translate-y-2 opacity-0"
        leave-active-class="duration-300 ease-in-out"
        leave-to-class="-translate-y-2 opacity-0">
        <ul
          class="flex items-center justify-center mt-2 absolute bg-background dark:bg-background_dark dark:border dark:border-primary_dark rounded-full shadow-lg"
          v-if="isLogoutMenuOpen"
          ref="logoutMenu">
          <MainButton
            class="hover:gap-2 text-lg w-full"
            @click="logout"
            text="تسجيل الخروج"
            ><PhSignOut class="w-5 h-5" />
          </MainButton>
        </ul>
      </transition>
    </div>
  </nav>
</template>
