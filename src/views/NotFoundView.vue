<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <NavBar />
    <div class="flex flex-col h-full justify-center items-center gap-6">
      <h1 class="text-4xl text-primary dark:text-primary_dark font-bold">
        {{ $t('not_found') }}
      </h1>
      <RouterLink to="/home">
        <MainButton :text="$t('go_back')" />
      </RouterLink>
    </div>
    <MainFooter />
  </div>
</template>
