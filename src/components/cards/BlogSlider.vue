<script>
import { Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { axiosInstance } from '@/api/axiosInstance.js';
import dayjs from 'dayjs';
import i18n from '@/locales/i18n';

export default {
  data() {
    return {
      news: [],
      dayjs,
    };
  },
  computed: {
    lang() {
      return i18n.global.locale;
    },
  },
  mounted() {
    this.getNews();
  },
  methods: {
    getNews: function () {
      this.isLoading = true;
      axiosInstance
        .get(`Blog?PageNumber=1&PageSize=10`)
        .then(({ data }) => {
          this.news = data.data;
          this.isLoading = false;
        })
        .catch((error) => { });
    },
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      modules: [Pagination, Autoplay],
    };
  },
};
</script>
<template>
  <swiper class="hidden xl:flex w-full" :modules="modules" :slides-per-view="3" :space-between="30" :autoplay="{
    delay: 3500,
    disableOnInteraction: false,
  }" :pagination="{ clickable: true }">
    <swiper-slide v-for="item in news" :key="item.id">
      <!-- Post -->
      <div
        class="relative z-20 rounded-3xl shadow-md bg-background dark:bg-background_dark dark:border dark:border-background transition-all duration-300">
        <!-- Image -->
        <img class="rounded-t-3xl h-48 object-cover w-full" :src="item.photo" alt="" />

        <!-- Details -->
        <div class="flex flex-col px-6 pt-6 pb-8">
          <h4 class="text-lg xl:text-xl font-bold text-primary dark:text-on_background_dark">
            {{ item.title }}
          </h4>
          <p class="text-sm xl:text-base text-on_background_variant dark:text-primary_container mt-4">
            {{ item.shortInfo }}
          </p>
          <span class="flex gap-2 items-center mt-4 text-on_background_variant dark:text-primary_container">
            <PhCalendar class="fill-on_background_variant dark:fill-primary_container w-6 h-6" />
            {{ dayjs(item.createdAt).format('ddd, DD MMM YYYY') }}
          </span>
          <a :href="'/news-post?id=' + item.id"
            class="flex gap-2 items-center justify-end text-base xl:text-lg text-primary dark:text-on_background_dark mt-4 transition-all duration-300 hover:gap-3">
            {{ $t('read_more') }}
            <PhCaretLeft :class="lang == 'en' ? 'rotate-180' : ''" class="fill-primary dark:fill-on_background_dark" />
          </a>
        </div>
      </div>
    </swiper-slide>
  </swiper>

  <!-- Mobile Swiper -->
  <swiper class="max-w-[20rem] xl:hidden" :modules="modules" :slides-per-view="1" :space-between="30" :autoplay="{
    delay: 3000,
    disableOnInteraction: false,
  }" :pagination="{ clickable: true }">
    <swiper-slide class="pb-12" v-for="item in news" :key="item.id">
      <!-- Post -->
      <div
        class="relative z-20 rounded-3xl shadow-md bg-background dark:bg-background_dark dark:border dark:border-background transition-all duration-300">
        <!-- Image -->
        <img class="rounded-t-3xl h-48 object-cover w-full" :src="item.photo" alt="" />

        <!-- Details -->
        <div class="flex flex-col px-6 pt-6 pb-8">
          <h4 class="text-lg xl:text-xl font-bold text-primary dark:text-on_background_dark">
            {{ item.title }}
          </h4>
          <p class="text-sm xl:text-base text-on_background_variant dark:text-primary_container mt-4">
            {{ item.shortInfo }}
          </p>
          <span class="flex gap-2 items-center mt-4 text-on_background_variant dark:text-primary_container">
            <PhCalendar class="fill-on_background_variant dark:fill-primary_container w-6 h-6" />
            {{ dayjs(item.createdAt).format('ddd, DD MMM YYYY') }}
          </span>
          <a :href="'/news-post?id=' + item.id"
            class="flex gap-2 items-center justify-end text-base xl:text-lg text-primary dark:text-on_background_dark mt-4 transition-all duration-300 hover:gap-3">
            {{ $t('read_more') }}
            <PhCaretLeft class="fill-primary dark:fill-on_background_dark" />
          </a>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>
