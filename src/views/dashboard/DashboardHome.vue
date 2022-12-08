<script setup>
// import { Form, Field, ErrorMessage } from 'vee-validate';
// import * as yup from 'yup';
// import { axiosInstance } from '@/api/axiosInstance.js';
import { onMounted, reactive, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { axiosInstance } from '@/api/axiosInstance';
import VueJsCounter from 'vue-js-counter';


const isLoading = ref(false);
const lineChart = ref({
  labels: ['January', 'February', 'March'],
  datasets: [{ data: [40, 20, 12] }]
});
const chartOptions = ref({
  responsive: true
});

const chartData = reactive({
  series: [],
  chartOptions: {
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: [],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  },
})

const chartData1 = reactive({
  series: [{
    name: 'PRODUCT A',
    data: [44, 55, 41, 67, 22, 43]
  }, {
    name: 'PRODUCT B',
    data: [13, 23, 20, 8, 13, 27]
  }, {
    name: 'PRODUCT C',
    data: [11, 17, 15, 15, 21, 14]
  }, {
    name: 'PRODUCT D',
    data: [21, 7, 25, 13, 22, 8]
  }],
  chartOptions: {
    chart: {
      type: 'bar',
      height: 350,
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: [],
    },
    fill: {
      opacity: 1
    },
  }
})

const counts = ref({

})
onMounted(async () => {
  const { data } = await axiosInstance.get("Main/GetReportForCharts?from=2022-12-02T18%3A28%3A32.039Z&to=2022-12-07T18%3A28%3A32.039Z")
  const res2 = await axiosInstance.get("Main/GetCounts")
  console.log(res2);
  // chart 1
  chartData.chartOptions.labels = data.byStatus.map(e => e.name)
  chartData.series = data.byStatus.map(e => e.count)

  chartData1.series = data.byDate.map(e => (
    {
      name: e.name,
      data: e.days.map(e2 => e2.count)
    }
  ))
  chartData1.chartOptions.xaxis.categories = data.days.map(e => e.date)
  counts.value = res2.data
})

</script>
<template>

  <MainLoader v-if="isLoading" />

  <div class="flex xl:overflow-hidden xl:h-screen relative z-20" v-motion-fade>
    <DashboardSidebar class="hidden xl:block" />
    <div class="flex flex-col w-full">
      <DashboardNavBar path="Home" />
      <div class="flex flex-col px-4 xl:px-8 mt-32 xl:mt-8 gap-4 overflow-x-auto">
        <div v-motion-fade
          class="lg:py-8 py-2 grid lg:grid-cols-4 grid-cols-1 w-full lg:gap-8 gap-4 pb-7 justify-self-end self-end [&>*]:gap-7">
          <!-- Total Courses -->
          <div class="flex flex-col courses p-6 rounded-2xl shadow-xl cursor-pointer">
            <h2 class="text-white font-bold text-2xl">
              All
            </h2>
            <div class="flex mt-6 justify-center items-center mt-auto">
              <PhFiles class="[&>*]:fill-white w-12 h-12" />
              <span class="text-4xl font-bold text-white mr-auto">

                <VueJsCounter v-if="counts?.all !== undefined" :end="counts.all" decimal="," duration="2000" start="0"
                  thousand="."></VueJsCounter>
              </span>
            </div>
          </div>
          <!-- Total Users -->
          <div class="flex flex-col users p-6 rounded-2xl shadow-xl cursor-pointer">
            <h2 class="text-white font-bold text-2xl">Complete</h2>
            <div class="flex mt-6 justify-center items-center mt-auto">
              <PhFiles class="[&>*]:fill-white w-12 h-12" />
              <span class="text-4xl font-bold text-white mr-auto">
                <VueJsCounter v-if="counts?.complete !== undefined" :end="counts.complete" decimal="," duration="2000"
                  start="0" thousand="."></VueJsCounter>
              </span>
            </div>
          </div>
          <!-- Total Ministries -->
          <div class="flex flex-col ministries p-6 rounded-2xl shadow-xl cursor-pointer">
            <h2 class="text-white font-bold text-2xl">Rejacted</h2>
            <div class="flex mt-6 justify-center items-center mt-auto">
              <PhFiles class="[&>*]:fill-white w-12 h-12" />
              <span class="text-4xl font-bold text-white mr-auto">
                <VueJsCounter v-if="counts?.rejacted !== undefined" :end="counts.rejacted" decimal="," duration="2000"
                  start="0" thousand="."></VueJsCounter>
              </span>
            </div>
          </div>
          <!-- Current Livestreams -->
          <div class="flex flex-col livestreams p-6 rounded-2xl shadow-xl cursor-pointer">
            <h2 class="text-white font-bold text-2xl">Wait for edit</h2>
            <div class="flex mt-6 justify-center items-center mt-auto">
              <PhFiles class="[&>*]:fill-white w-12 h-12" />
              <span class="text-4xl font-bold text-white mr-auto">
                <VueJsCounter v-if="counts?.waitforedit !== undefined" :end="counts.waitforedit" decimal=","
                  duration="2000" start="0" thousand="."></VueJsCounter>
              </span>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 bg-white p-5 border rounded shadow">
          <div>
            <div class="text-center mb-5 text-3xl">
              All request by status
            </div>
            <VueApexCharts :key="chartData.series.length" width="100%" type="pie" :options="chartData.chartOptions"
              :series="chartData.series">
            </VueApexCharts>
          </div>
          <div>
            <div class="text-center mb-5 text-3xl">
              All request status by day
            </div>
            <VueApexCharts :key="chartData1.series.length" width="100%" type="bar" :options="chartData1.chartOptions"
              :series="chartData1.series">
            </VueApexCharts>
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
<style scoped>
::-webkit-scrollbar-thumb {
  background: rgb(182, 182, 182);
}

::-webkit-scrollbar {
  width: 1.5vmin;
}

.courses {
  background: rgb(0, 101, 227);
  background: linear-gradient(321deg,
      rgba(0, 101, 227, 1) 0%,
      rgba(0, 70, 134, 1) 100%);
}

.users {
  background: rgb(0, 135, 235);
  background: linear-gradient(321deg,
      rgba(0, 135, 235, 1) 17%,
      rgba(0, 210, 255, 1) 100%);
}

.ministries {
  background: rgb(134, 157, 255);
  background: linear-gradient(321deg,
      rgba(134, 157, 255, 1) 0%,
      rgba(52, 74, 175, 1) 100%);
}

.livestreams {
  background: rgb(66, 123, 150);
  background: linear-gradient(321deg,
      rgba(66, 123, 150, 1) 0%,
      rgba(69, 90, 100, 1) 100%);
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
