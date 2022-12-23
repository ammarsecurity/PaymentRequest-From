<script setup>
/* ----------------------- Imports ---------------------- */
// Tools
import { RouterView } from 'vue-router';
import { computed, onMounted } from 'vue';
import i18n from '@/locales/i18n';
import { useSignalR } from '@dreamonkey/vue-signalr';
import emitter from "tiny-emitter/instance";
/* ------------------------ Index ----------------------- */
// Language
onMounted(async () => {

  const signalr = useSignalR();
  const invokeSignalr = async (comeBack = false) => {
    await signalr.invoke('AddUserToOnlineList', localStorage.getItem("role"), localStorage.getItem("userId"));
    if (comeBack) {
      console.log('signalr RE:Connected', localStorage.getItem("role"), localStorage.getItem("userId"));
    }
    console.log("signalr Connected", localStorage.getItem("role"), localStorage.getItem("userId"));
  }
  await invokeSignalr();
  window.addEventListener('offline', async function (e) {
    console.log('offline');
  });

  window.addEventListener('online', async function (e) {
    console.log('online');
    try {
      setTimeout(async () => {
        await invokeSignalr(true);
      }, 5000);
    } catch (e) {
      setTimeout(async () => {
        await invokeSignalr(true);
      }, 10000);
    }
  });

  signalr.on('Notify', (message) => {
    console.log(message);
    emitter.emit('newNotify', message)
  });
})
const lang = computed(() => {
  return i18n.global.locale;
});
</script>

<template>
  <div class="bg-background dark:bg-background_dark bg-[url('/images/pattern.svg')]" :dir="'ltr'">
    <RouterView v-slot="{ Component }" :key="lang">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}
</style>
