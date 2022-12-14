<template>
  <MainLoader v-if="isLoading" />

  <div
    class="flex xl:overflow-hidden xl:h-screen relative z-20"
    v-motion-fade>
    <DashboardSidebar class="hidden xl:block" />
    <div class="flex flex-col w-full">
      <DashboardNavBar path="Home" />
      <div
        class="flex flex-col px-4 xl:px-8 mt-32 xl:mt-8 gap-4 overflow-x-auto">
        <div
          v-motion-fade
          class="lg:py-8 py-2 grid lg:grid-cols-4 grid-cols-1 w-full lg:gap-8 gap-4 pb-7 justify-self-end self-end [&>*]:gap-7">
          <!-- Total Courses -->
          <div
            class="flex flex-col courses p-6 rounded-2xl shadow-xl cursor-pointer">
            <h2 class="text-white font-bold text-2xl">All</h2>
            <div class="flex mt-6 justify-center items-center mt-auto">
              <PhFiles class="[&>*]:fill-white w-12 h-12" />
              <span class="text-4xl font-bold text-white mr-auto">
                <VueJsCounter
                  v-if="counts?.all !== undefined"
                  :end="counts.all"
                  decimal=","
                  duration="2000"
                  start="0"
                  thousand="."
                  >{{ counts.all }}</VueJsCounter
                >
              </span>
            </div>
          </div>
          <!-- Total Users -->
          <div
            class="flex flex-col users p-6 rounded-2xl shadow-xl cursor-pointer">
            <h2 class="text-white font-bold text-2xl">Complete</h2>
            <div class="flex mt-6 justify-center items-center mt-auto">
              <PhFiles class="[&>*]:fill-white w-12 h-12" />
              <span class="text-4xl font-bold text-white mr-auto">
                <VueJsCounter
                  v-if="counts?.complete !== undefined"
                  :end="counts.complete"
                  decimal=","
                  duration="2000"
                  start="0"
                  thousand="."
                  >{{ counts.complete }}</VueJsCounter
                >
              </span>
            </div>
          </div>
          <!-- Total Ministries -->
          <div
            class="flex flex-col ministries p-6 rounded-2xl shadow-xl cursor-pointer">
            <h2 class="text-white font-bold text-2xl">Rejacted</h2>
            <div class="flex mt-6 justify-center items-center mt-auto">
              <PhFiles class="[&>*]:fill-white w-12 h-12" />
              <span class="text-4xl font-bold text-white mr-auto">
                <VueJsCounter
                  v-if="counts?.rejacted !== undefined"
                  :end="counts.rejacted"
                  decimal=","
                  duration="2000"
                  start="0"
                  thousand="."
                  >{{ counts.rejacted }}</VueJsCounter
                >
              </span>
            </div>
          </div>
          <!-- Current Livestreams -->
          <div
            class="flex flex-col livestreams p-6 rounded-2xl shadow-xl cursor-pointer">
            <h2 class="text-white font-bold text-2xl">Wait for edit</h2>
            <div class="flex mt-6 justify-center items-center mt-auto">
              <PhFiles class="[&>*]:fill-white w-12 h-12" />
              <span class="text-4xl font-bold text-white mr-auto">
                <VueJsCounter
                  v-if="counts?.waitforedit !== undefined"
                  :end="counts.waitforedit"
                  decimal=","
                  duration="2000"
                  start="0"
                  thousand="."
                  >{{ counts.waitforedit }}</VueJsCounter
                >
              </span>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 bg-white p-5 border rounded shadow">
          <div>
            <div
              id="main2"
              style="
                width: 100%;
                height: 400px;
                background: #fff;
                margin-top: 9px;
                padding: 11px;
              "></div>
          </div>

          <div>
            <div class="text-center mb-5 text-3xl"></div>
          </div>
          <!-- <Bar id="my-chart-id" :options="chartOptions" :data="lineChart" /> -->
        </div>
        <!-- <div class="flex flex-col xl:flex-row w-full xl:justify-between xl:items-center">
          <Pie id="my-chart-id" :data="pieChart" />
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { axiosInstance } from '@/api/axiosInstance';
import VueJsCounter from 'vue-js-counter';
export default {
  name: 'home',
  data() {
    return {
      options: {
        labels: [],
        series: [],
      },
      counts: {
        waitforedit: 0,
        rejacted: 0,
        complete: 0,
        all: 0,
      },
    };
  },
  mounted() {
    this.gecount();
    this.getchartline();
  },
  methods: {
    gecount() {
      axiosInstance
        .get('Main/GetCounts')
        .then(({ data }) => {
          this.counts = data;
        })
        .catch((error) => {});
    },
    getchartline() {
      axiosInstance
        .get('Main/GetReportForCharts')
        .then(({ data }) => {
          var myChart2 = echarts.init(document.getElementById('main2'));
          var chartDom = document.getElementById('main');

          var option = {
            title: {
              text: 'All request by status',
              subtext: '',
              left: 'center',
            },
            tooltip: {
              trigger: 'item',
            },
            legend: {
              orient: 'vertical',
              left: 'left',
            },
            series: [
              {
                with: '600px',
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: data.byStatus,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                  },
                },
              },
            ],
          };
          myChart2.setOption(option);
        })
        .catch((error) => {});
    },
  },
};
</script>
<style scoped>
::-webkit-scrollbar-thumb {
  background: rgb(182, 182, 182);
}

::-webkit-scrollbar {
  width: 1.5vmin;
}

.courses {
  background: rgb(0, 101, 227);
  background: linear-gradient(
    321deg,
    rgba(0, 101, 227, 1) 0%,
    rgba(0, 70, 134, 1) 100%
  );
}

.users {
  background: rgb(0, 135, 235);
  background: linear-gradient(
    321deg,
    rgba(0, 135, 235, 1) 17%,
    rgba(0, 210, 255, 1) 100%
  );
}

.ministries {
  background: rgb(134, 157, 255);
  background: linear-gradient(
    321deg,
    rgba(134, 157, 255, 1) 0%,
    rgba(52, 74, 175, 1) 100%
  );
}

.livestreams {
  background: rgb(66, 123, 150);
  background: linear-gradient(
    321deg,
    rgba(66, 123, 150, 1) 0%,
    rgba(69, 90, 100, 1) 100%
  );
}

.scrollable::-webkit-scrollbar {
  width: 0.5vmin;
}

.scrollable::-webkit-scrollbar-track {
  background: var(--lgray);
}

.scrollable::-webkit-scrollbar-thumb {
  border-radius: 25px;
}
</style>
