<script>
import { Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { axiosInstance } from '@/api/axiosInstance.js';
import i18n from '@/locales/i18n';

export default {
  data() {
    return {
      isLoading: false,
      news: [],
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
        .get(`Videos?PageNumber=1&PageSize=100`)
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
  <swiper class="flex w-full h-full pb-16" :modules="modules" :slides-per-view="1" :space-between="30" :autoplay="{
    delay: 5000,
    disableOnInteraction: false,
  }" :pagination="{ clickable: true }">
    <swiper-slide v-for="item in news" :key="item.id">
      <div class="flex flex-col xl:flex-row xl:items-center justify-center h-full">
        <div class="flex flex-col gap-2 xl:gap-6 justify-center xl:w-1/2 py-4 xl:py-12">
          <h3 class="text-on_primary text-2xl xl:text-4xl font-bold">
            {{ item.title_ar }}
          </h3>
          <h4 class="text-on_primary xl:text-xl max-w-[60ch]">
            {{ item.description_ar }}
          </h4>
          <MainButton class="mt-4" :text="$t('apply')" :bordered="true">
            <PhCaretLeft :class="lang == 'en' ? 'rotate-180' : ''"
              class="fill-primary dark:fill-primary_dark w-6 h-6" />
          </MainButton>
        </div>
        <video autoplay muted class="xl:w-1/2 w-full h-full mt-6 lg:mt-0 rounded-xl aspect-video">
          <source :src="item.url" type="video/mp4" />
        </video>
      </div>
    </swiper-slide>
  </swiper>
</template>
