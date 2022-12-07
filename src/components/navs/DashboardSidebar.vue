<script setup>
const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
};

const role = localStorage.getItem('role');
</script>
<template>
  <div
    class="sidebar relative flex flex-col items-center justify-center p-4 w-[18vw] border border-gray-400 shadow-2xl bg-background h-screen z-50 overflow-scroll rounded-l-[5rem]"
    v-motion-slide-right>
    <ul class="flex flex-col justify-center items-center gap-2 w-full h-full relative">
      <a class="flex items-center justify-center" href="/">
        <img class="w-50" src="/images/logos/logo.png" alt="" />
      </a>
      <div class="flex flex-col  items-center gap-3 w-full h-full mt-24 overflow-x-auto">
        <RouterLink class="sidebar-item" to="/dashboard/home">
          <PhNewspaper class="sidebar-item-icon" /> الرئيسية
        </RouterLink>


        <RouterLink class="sidebar-item" to="/dashboard/request">
          <PhFileText class="sidebar-item-icon" />
          الطلبات
        </RouterLink>
        <RouterLink class="sidebar-item" to="/dashboard/supusersrequest" v-if="(role == 'User')">
          <PhFileText class="sidebar-item-icon" />
          طلبات الموظفين
        </RouterLink>

        <RouterLink class="sidebar-item" to="/dashboard/categories">
          <PhFileText class="sidebar-item-icon" />
          الطلبات المكتملة
        </RouterLink>
        <RouterLink class="sidebar-item" to="/dashboard/categories">
          <PhFileText class="sidebar-item-icon" />
          الطلبات المرفوضة
        </RouterLink>
        <RouterLink class="sidebar-item" to="/dashboard/requestreports" v-if="(role == 'CFO' || role == 'Accounter')">
          <PhFileText class="sidebar-item-icon" />
          التقارير
        </RouterLink>
        <RouterLink class="sidebar-item" to="/dashboard/users" v-if="(role == 'User' || role == 'Accounter')">
          <PhUser class="sidebar-item-icon" />
          الحسابات
        </RouterLink>
      </div>
      <a class="sidebar-item mt-auto cursor-pointer" @click="logout">
        <PhSignOut class="sidebar-item-icon" />
        تسجيل الخروج
      </a>
    </ul>
  </div>
</template>
<style scoped>
.sidebar {
  /* box-shadow: -20px -1px 30px 1px rgba(0, 0, 0, 0.08); */
}

.router-link-active {
  background-color: #0094da !important;
  color: white;
}

.router-link-active svg {
  fill: white;
}
</style>
