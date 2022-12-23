<script setup>
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import emitter from 'tiny-emitter/instance';
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

const role = localStorage.getItem('role');
const nList = ref([]);

emitter.on('newNotify', (message) => {
  nList.value.unshift({
    date: message.date,
    notifyTitle: message.notifyTitle,
    notifyBody: message.notifyBody,
  });

  
  var audio = new Audio('../../../public/sound/notification.mp3'); // path to file
  audio.play();
});
const fullName = localStorage.getItem('fullName');
const email = localStorage.getItem('email');

const logoutMenu = ref(null);
const logoutButton = ref(null);
const isLogoutMenuOpen = ref(false);
const isNotificationMenuOpen = ref(false);

onClickOutside(
  (logoutMenu, logoutButton),
  () => (isLogoutMenuOpen.value = false)
);
</script>
<template>
  <nav
    class="fixed xl:relative flex items-center px-8 w-full z-50 py-4"
    v-motion-slide-top>
    <!-- Path -->
    <div class="flex xl:text-xl text-on_background_variant">
      <span class="hidden xl:flex"> Contorl Panel/ {{ path }} </span>
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
            <RouterLink
              class="sidebar-item"
              to="/dashboard/home">
              <PhNewspaper class="sidebar-item-icon" /> Dashbord
            </RouterLink>

            <RouterLink
              class="sidebar-item"
              to="/dashboard/request">
              <PhFileText class="sidebar-item-icon" />
              Request
            </RouterLink>
            <RouterLink
              class="sidebar-item"
              to="/dashboard/supusersrequest"
              v-if="role == 'HOD' || role == 'HOP'">
              <PhFileText class="sidebar-item-icon" />
              Employee Request
            </RouterLink>

            <RouterLink
              class="sidebar-item"
              to="/dashboard/requestfinished"
              v-if="role == 'CFO' || role == 'Accounter' || role == 'BDM'">
              <PhFileText class="sidebar-item-icon" />
              Completed Request
            </RouterLink>
            <RouterLink
              class="sidebar-item"
              to="/dashboard/requestrejected"
              v-if="role == 'CFO' || role == 'Accounter' || role == 'BDM'">
              <PhFileText class="sidebar-item-icon" />
              Rejected Request
            </RouterLink>
            <RouterLink
              class="sidebar-item"
              to="/dashboard/requestreports"
              v-if="role == 'CFO' || role == 'Accounter' || role == 'BDM'">
              <PhFileText class="sidebar-item-icon" />
              Reports
            </RouterLink>
            <RouterLink
              class="sidebar-item"
              to="/dashboard/compnies"
              v-if="role == 'Accounter'">
              <PhBuildings class="sidebar-item-icon" />
              Companies
            </RouterLink>
            <RouterLink
              class="sidebar-item"
              to="/dashboard/logs"
              v-if="role == 'Accounter'">
              <PhFileText class="sidebar-item-icon" />
              Logs
            </RouterLink>
            <RouterLink
              class="sidebar-item"
              to="/dashboard/users"
              v-if="role == 'HOD' || role == 'HOP' || role == 'Accounter'">
              <PhUser class="sidebar-item-icon" />
              Users
            </RouterLink>
          </ul>
        </transition>
      </div>
    </div>

    <!-- Notifications -->
    <div class="ml-auto mr-[30px]">
      <div
        class="border border-on_background p-2 rounded-2xl ml-4 cursor-pointer"
        @click="isNotificationMenuOpen = !isNotificationMenuOpen">
        <div
          class="rounded-full bg-red-500 absolute flex items-center justify-center text-on_primary text-xs p-1 -mt-4 ml-7">
          {{ nList.length }}
        </div>
        <PhBell class="w-7 h-7" />
      </div>

      <!-- Dropdown menu -->
      <div
        class="z-10 w-80 absolute mt-5 bg-white rounded divide-y divide-gray-100 shadow-md right-[7rem]"
        v-if="isNotificationMenuOpen">
        <ul
          v-if="nList.length > 0"
          class="py-1 text-sm text-on_background">
          <a
            href="#"
            class="flex items-center justify-center gap-4 py-2 px-4 hover:bg-gray-100 border-b"
            v-for="item in nList">
            <PhFileText class="w-12 h-12" />
            <div class="space-y-2">
              <h1 class="font-bold text-base">{{ item.notifyTitle }}</h1>
              <p class="text-xs">{{ item.notifyBody }}</p>
            </div>
          </a>
        </ul>
        <div
          v-else
          class="p-5 text-center">
          <h1 class="text-2xl">No notifications</h1>
        </div>
      </div>
    </div>
    <!-- Log Out -->
    <div class="dropdown inline-block relative">
      <div
        class="flex items-center justify-center gap-2 cursor-pointer hover:brightness-150 duration-300 border border-on_background p-2 rounded-2xl cursor-pointer"
        ref="logoutButton"
        @click="isLogoutMenuOpen = !isLogoutMenuOpen">
        <PhCaretLeft class="h-7 w-7 -rotate-90 fill-primary" />
        <h5 class="text-xl text-primary">{{ email }}</h5>
        <PhUser class="h-7 w-7" />
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
            text="تسجيل الخروج">
            <PhSignOut class="w-5 h-5" />
          </MainButton>
        </ul>
      </transition>
    </div>
  </nav>
</template>
