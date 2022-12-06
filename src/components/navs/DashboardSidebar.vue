<script setup>
const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
};
</script>
<template>
  <div
    class="sidebar relative flex flex-col items-center justify-center p-4 w-[18vw] shadow-2xl bg-background h-screen z-50 overflow-scroll"
    v-motion-slide-right>
    <ul class="flex flex-col justify-center items-center gap-2 w-full h-full relative">
      <a class="flex items-center justify-center" href="/">
        <img class="w-32" src="/images/logos/interior.png" alt="" />
      </a>

      <RouterLink class="sidebar-item" to="/dashboard/news">
        <PhNewspaper class="sidebar-item-icon" /> الرئيسية
      </RouterLink>


      <RouterLink class="sidebar-item" to="/dashboard/request">
        <PhFileText class="sidebar-item-icon" />
        الطلبات
      </RouterLink>
      <RouterLink class="sidebar-item" to="/dashboard/supusersrequest">
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
      <RouterLink class="sidebar-item" to="/dashboard/categories">
        <PhFileText class="sidebar-item-icon" />
        التقارير
      </RouterLink>
      <RouterLink class="sidebar-item" to="/dashboard/users">
        <PhUser class="sidebar-item-icon" />
        الحسابات
      </RouterLink>
      <a class="sidebar-item mt-auto cursor-pointer" @click="logout">
        <PhSignOut class="sidebar-item-icon" />
        تسجيل الخروج
      </a>
    </ul>
  </div>
</template>
<style scoped>
.sidebar {
  box-shadow: -20px -1px 30px 1px rgba(0, 0, 0, 0.08);
}

.router-link-active {
  background-color: var(--primary) !important;
  color: white;
}

.router-link-active svg {
  fill: white;
}
</style>
