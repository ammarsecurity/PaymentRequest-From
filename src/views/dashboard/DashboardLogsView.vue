<template>
  <div class="flex xl:overflow-hidden xl:h-screen relative z-20">
    <DashboardSidebar class="hidden xl:block" />
    <div class="flex flex-col w-full">
      <DashboardNavBar path="Logs" />
      <div
        class="flex flex-col px-4 xl:px-8 mt-32 xl:mt-8 gap-4 overflow-y-auto">
        <div class="flex gap-2 items-center">
          <div class="flex flex-col">
            <label class="text-primary">Request Number</label>
            <input
              class="border border-on_background_variant rounded-full px-4 mt-2 focus:outline-primary focus:outline-2 transition-all duration-300 h-10 w-48"
              name="Password"
              v-model="requestNumber"
              type="text" />
            <ErrorMessage
              class="text-red-600 text-lg"
              name="Password"
              component="div"></ErrorMessage>
          </div>
          <div
            class="bg-primary rounded-full p-2 max-w-max self-end"
            @click="getLogs()">
            <PhMagnifyingGlass class="h-6 w-6 fill-on_primary" />
          </div>
        </div>
        <div class="border-primary border rounded-2xl bg-background px-8 py-6">
          <ol class="relative border-l border-blue-200">
            <li
              class="mb-10 ml-10"
              v-for="item in logs"
              :key="item.id">
              <span
                class="flex absolute -left-5 justify-center items-center w-10 h-10 bg-blue-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                <svg
                  v-if="item.isFinished"
                  aria-hidden="true"
                  class="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"></path>
                </svg>
                <svg
                  v-if="!item.isFinished && !item.isStart"
                  aria-hidden="true"
                  class="w-6 h-6 text-black-600 dark:text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"></path>
                </svg>
                <svg
                  v-if="item.isStart"
                  aria-hidden="true"
                  class="w-6 h-6 text-green-600 dark:text-green-800"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"></path>
                </svg>
              </span>
              <h3
                class="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                {{ item.fullName }}
              </h3>
              <h3
                class="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                Form -
                {{ getRoleName(item.fromLoction) }} / To -
                {{ getRoleName(item.loction) }} &nbsp
                <span class="text-red-600"> (Current Location)</span>
              </h3>
              <time
                class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"></time>
              {{ dates(item.date) }}
              <p
                class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                {{ item.lastInfo }}
              </p>
              <a
                v-if="item.isFinished"
                @click="print(item.requestId)"
                class="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                ><svg
                  class="mr-2 w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                    clip-rule="evenodd"></path>
                </svg>
                Print</a
              >
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { axiosInstance, baseURL } from '@/api/axiosInstance.js';

import dayjs from 'dayjs';
import printJS from 'print-js';
export default {
  name: 'Logs',
  component: [dayjs],
  data() {
    return {
      logs: [],
      requestNumber: '',
    };
  },
  methods: {
    getRoleName(item) {
      //  Accounter = 1 ,
      //   User = 2 ,
      //   SupUser = 3 ,
      //   CFO = 4 ,
      //   HOP = 5 ,
      //   HOD = 6 ,
      //   BDM = 7 ,
      if (item == 2) {
        return 'Comapny Manager';
      } else if (item == 1) {
        return 'Finance';
      } else if (item == 3) {
        return 'Requester';
      } else if (item == 4) {
        return 'CFO';
      } else if (item == 5) {
        return 'HOP';
      } else if (item == 6) {
        return 'HOD';
      } else if (item == 7) {
        return 'BDM';
      }
    },
    dates(x) {
      return dayjs(x).format('DD MMM YYYY - hh:mm');
    },
    getLogs() {
      axiosInstance
        .get('Main/GetLog?requestNumber=' + this.requestNumber)
        .then(({ data }) => {
          this.logs = data.data;
        })
        .catch((error) => {});
    },

    print(id) {
      printJS({
        printable: `${baseURL}Main/GetReport?id=${id}`,
        type: 'pdf',
        modalMessage: 'Preparing for printing ...',
        showModal: true,
      });
    },
  },
};
</script>
