<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { axiosInstance } from '@/api/axiosInstance.js';
import { ref } from 'vue';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

/* -------------------- Vee Validate -------------------- */

const validationSchemaEdit = ref({
  requestedAmount: yup.string().required('This field is required'),
  amountCurrency: yup.string().required('This field is required'),
  purposeOfPaymentAndDetails: yup.string().required('This field is required'),
});
/* ------------------------ Axios ----------------------- */

const isError = ref(false);
const isLoading = ref(false);
const isAddSuccess = ref(false);
const isEditSuccess = ref(false);

const props = defineProps({
  foo: String
})

// POST
const createRequestForm = ref({
  requestedAmount: '',
  amountCurrency: '',
  purposeOfPaymentAndDetails: '',
  otherInfo: '',
});
var showAddOrder = false;
var isUser = false;
const role = localStorage.getItem('role');
if (role == 'Accounter') {
  showAddOrder = false;
  isUser = false;
} else if (role == 'User') {
  showAddOrder = true;
  isUser = true;

} else if (role == 'SupUser') {
  showAddOrder = true;
  isUser = true;

} else if (role == 'CFO') {
  showAddOrder = false;
  isUser = false;
}

const submit = async (value) => {
  isLoading.value = true;
  isError.value = false;

  axiosInstance
    .post('Main/AddRequset', createRequestForm.value)
    .then(({ data }) => {

      isLoading.value = false;
      isAddModalOpen.value = false;
      isAddSuccess.value = true;
      setTimeout(() => {
        isAddSuccess.value = false;
      }, 4000);
      createRequestForm.value = {
        requestedAmount: '',
        amountCurrency: '',
        purposeOfPaymentAndDetails: '',
        otherInfo: '',
      };
      getRequest();
    })
    .catch((error) => {

      console.log(error)
    });

  return;
};



const editRequest = ref({
  id: '',
  requestedAmount: '',
  amountCurrency: '',
  purposeOfPaymentAndDetails: '',
  otherInfo: '',
});

const lastInfo = ref('');
const requestId = ref('');
const requeststatus = ref('');

const editStatusRequest = async (value) => {
  isLoading.value = true;
  isError.value = false;
  axiosInstance
    .post('Main/editRequest?id=' + editRequest.value.id, formData)
    .then(({ data }) => {

      isLoading.value = false;
      isEditModalOpen.value = false;
      isEditSuccess.value = true;
      setTimeout(() => {
        isEditSuccess.value = false;
      }, 4000);

      getRequest();
    })
    .catch((error) => {
      isLoading.value = false;
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while creating the account',
        icon: 'error',
        showCancelButton: true,
        cancelButtonColor: '#213263',
        cancelButtonText: 'Close',
      });
    });
  return;
};


const editSubmit = async (value) => {
  isLoading.value = true;
  isError.value = false;

  const formData = new FormData();
  formData.append('CompanyLogo', editRequest.value.CompanyLogo);
  formData.append('FullName', editRequest.value.Email);
  formData.append('UserRole', editRequest.value.UserRole);
  formData.append('Email', editRequest.value.Email);
  formData.append('CompanyName', editRequest.value.CompanyName);
  formData.append('Password', editRequest.value.Password);
  axiosInstance
    .post('Main/editRequest?id=' + editRequest.value.id, formData)
    .then(({ data }) => {

      isLoading.value = false;
      isEditModalOpen.value = false;
      isEditSuccess.value = true;
      setTimeout(() => {
        isEditSuccess.value = false;
      }, 4000);

      getRequest();
    })
    .catch((error) => {
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while creating the account',
        icon: 'error',
        showCancelButton: true,
        cancelButtonColor: '#213263',
        cancelButtonText: 'Close',
      });
    });
  return;
};


// GET
const paginationIndex = ref(0);
const list = ref([]);
const totalRecords = ref('');
const pageSize = ref(10);
const pageNumber = ref(1);
const date = ref('');
const companyName = ref('');



const getRequest = () => {
  isLoading.value = true;
  axiosInstance.get(`Main/GetRequset?userRequest=${isUser}&PageNumber=${pageNumber.value}&PageSize=${pageSize.value}&date=${date.value}&companyName=${companyName.value}`)
    .then(({ data }) => {
      list.value = data.data;
      pageNumber.value = data.pageNumber;
      pageSize.value = data.pageSize;
      totalRecords.value = data.totalRecords;
      isLoading.value = false;
    })
    .catch((error) => { });
};
getRequest();

const nextPage = () => {
  pageNumber.value++, (paginationIndex.value += 10), getRequest();
};
const previousPage = () => {
  pageNumber.value--, (paginationIndex.value -= 10), getRequest();
};

const editRequestInfo = (index) => {
  const info = list.value[index];
  editRequest.value.requestedAmount = info.requestedAmount;
  editRequest.value.purposeOfPaymentAndDetails = info.requestedAmount;
  editRequest.value.otherInfo = info.otherInfo;
  editRequest.value.amountCurrency = info.amountCurrency;
  editRequest.value.id = info.id
};

const requestInfo = ref({
  purposeOfPaymentAndDetails: '',
  otherInfo: '',
  lastInfo: '',
  invoiceDate: '',
  beneficaryName: '',
  dueDate: '',
  paymentBudget: '',
  requestLoction: ''

});

const showRequestInfo = (index, status, id) => {
  requestId.value = id;
  requeststatus.value = status;
  const info = list.value[index];

  requestInfo.value.beneficaryName = info.beneficaryName,
    requestInfo.value.otherInfo = info.otherInfo,
    requestInfo.value.invoiceDate = info.invoiceDate,
    requestInfo.value.dueDate = info.dueDate,
    requestInfo.value.paymentBudget = info.paymentBudget,
    requestInfo.value.purposeOfPaymentAndDetails = info.purposeOfPaymentAndDetails,
    requestInfo.value.requestLoction = info.requestLoction,
    requestInfo.value.paymentBudgetIfFalseJustification = info.paymentBudgetIfFalseJustification
  requestInfo.value.lastInfo = info.lastInfo

}




/* ------------------------ Index ----------------------- */
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isInfoModalOpen = ref(false);
</script>
<template>
  <!-- Post -->

  <!-- Edit -->

  <MainLoader v-if="isLoading" />

  <!-- Modals -->
  <!-- Add Modal -->
  <MainModal text="Add a new request" v-if="isAddModalOpen" @close="isAddModalOpen = false">
    <Form class="flex flex-col gap-4" dir="rtl" :validationSchema="validationSchema" @submit="submit">


      <!-- Title -->
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Amount</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="FullName" v-model="createRequestForm.requestedAmount" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="FullName" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Currency</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="amountCurrency" v-model="createRequestForm.amountCurrency" type="select" as="select">
          <option value="IQD">USD</option>
          <option value="$">IQD</option>


        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="amountCurrency" component="div"></ErrorMessage>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Purpose of payment and details</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="purposeOfPaymentAndDetails" v-model="createRequestForm.purposeOfPaymentAndDetails" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="purposeOfPaymentAndDetails" component="div"></ErrorMessage>
      </div>


      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Other details</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="otherInfo" v-model="createRequestForm.otherInfo" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="otherInfo" component="div"></ErrorMessage>
      </div>

      <MainButton text="Add" type="submit" />
    </Form>
  </MainModal>

  <!-- Edit Modal -->
  <MainModal text="Update Order" v-if="isEditModalOpen" @close="isEditModalOpen = false">

    <Form class="flex flex-col gap-4" dir="rtl" :validationSchema="validationSchemaEdit" @submit="editSubmit">
      <!-- Photo -->
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">الPicture or logo</label>
        <Field
          class="border border-on_background_variant rounded-2xl px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="photo" v-model="editRequest.CompanyLogo" @change="uploadPhoto('add')" type="file">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="CompanyLogo" component="div"></ErrorMessage>
      </div>

      <!-- Title -->
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Full Name</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="FullName" v-model="editRequest.FullName" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="FullName" component="div"></ErrorMessage>
      </div>


      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Email</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="Email" v-model="editRequest.Email" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="Email" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">الرمز السري</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="Password" v-model="editRequest.Password" type="password">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="Password" component="div"></ErrorMessage>
      </div>


      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Type</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="UserRole" v-model="editRequest.UserRole" type="select" as="select">
          <option value="1">Accountant</option>
          <option value="4">CFO</option>
          <option value="2">Company</option>

        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="UserRole" component="div"></ErrorMessage>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Company Name</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="CompanyName" v-model="editRequest.CompanyName" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="CompanyName" component="div"></ErrorMessage>
      </div>

      <MainButton text="Update" type="submit" />
    </Form>

  </MainModal>

  <MainModal styles="w-[40vw] h-[70vh]" text="Order details" v-if="isInfoModalOpen" @close="isInfoModalOpen = false">
    <div class="grid grid-cols-2 flex-col gap-5" dir="rtl">
      <div class="flex flex-col col-span-2 gap-4" v-if="role !== 'SupUser'">
        <div class="flex flex-col  gap-2" v-if="(role == 'User' && requeststatus != 'Wait')">
          <label class="text-xl text-primary">Note</label>
          <Field
            class="border border-on_background_variant bg-background rounded-2xl px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 "
            name="lastInfo" v-model="lastInfo" type="textarea" as="textarea">
          </Field>
          <ErrorMessage class="text-red-600 text-lg" name="lastInfo" component="div"></ErrorMessage>
        </div>
        <div class=" flex gap-4  w-full col-span-2">
          <MainButton v-if="role == 'Accounter'" @click="editStatusRequest(3)" class="bg-green-600 border-none"
            text="Approval"></MainButton>
          <MainButton v-if="(role == 'User' && requeststatus != 'Wait')" @click="editStatusRequest(0)"
            class="bg-green-600 border-none" text="Approval"></MainButton>
          <MainButton v-if="role == 'CFO'" @click="editStatusRequest(6)" class="bg-green-600 border-none"
            text="Approval"></MainButton>

          <MainButton v-if="role == 'Accounter'" @click="editStatusRequest(1)" class="bg-orange-600 border-none"
            text="Return for modification"></MainButton>
          <MainButton class="bg-red-600 border-none" v-if="(role == 'User' && requeststatus != 'Wait')"
            @click="editStatusRequest(5)" text="Reject"></MainButton>
        </div>
      </div>


      <div class="flex flex-col gap-2  text-red-600" v-if="(requestInfo.paymentBudget == false)">
        <label class="text-xl text-primary  text-red-600">Note</label>
        <p class="text-xl text-primary  text-red-600">{{ requestInfo.lastInfo }}</p>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Purpose of payment and details</label>
        <p>{{ requestInfo.purposeOfPaymentAndDetails }}</p>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Other details</label>
        <p>{{ requestInfo.otherInfo }}</p>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Due date
        </label>
        <p>{{ dayjs(requestInfo.dueDate).format('ddd, DD MMM YYYY') }} </p>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Invoice Date</label>
        <p>{{ dayjs(requestInfo.dueDate).format('ddd, DD MMM YYYY') }} </p>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Beneficary Name</label>
        <p>{{ requestInfo.beneficaryName }}</p>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Payment Budget</label>
        <p v-if="(requestInfo.paymentBudget == false)">لا</p>
      </div>
      <div class="flex flex-col gap-2" v-if="(requestInfo.paymentBudget == false)">
        <label class="text-xl text-primary">Reason</label>
        <p>{{ requestInfo.paymentBudgetIfFalseJustification }}</p>
      </div>

    </div>

  </MainModal>

  <div class="flex xl:overflow-hidden xl:h-screen relative z-20" v-motion-fade>
    <DashboardSidebar class="hidden xl:block" />
    <div class="flex flex-col w-full">
      <DashboardNavBar path="Pending Orders" />
      <div class="flex flex-col px-4 xl:px-8 mt-32 xl:mt-8 gap-4">
        <MainButton v-if="showAddOrder" @click="isAddModalOpen = true" text="Add new order">
        </MainButton>

        <!-- Table -->
        <div class="overflow-x-auto xl:overflow-y-auto relative shadow-md rounded-xl h-full xl:h-[71vh] bg-background">
          <table class="w-full text-right text-on_background">
            <thead class="text-base text-on_primary bg-primary">
              <tr>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  #
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  Picture or logo
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  Full Name
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  Company Name
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  Amount
                </th>

                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  Invoice Number
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  Status
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  Added date
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4 rounded-tr-xl">
                  Options
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-background border-b odd:bg-on_background_variant even:bg-background text-sm" :key="item.id">
                <td class="xl:py-3 xl:px-6 py-2 px-4 font-bold text-primary">
                  {{ index + 1 + paginationIndex }}
                </td>
                <th scope="row" class="whitespace-nowrap">
                  <img class="h-16 w-16 object-cover rounded-[50px] my-1" :src="item.companyLogo" alt="" />
                </th>
                <td class="xl:py-3 xl:px-6 py-2 px-4 font-bold">
                  {{ item.fullName }}
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]">
                  {{ item.companyName }}
                </td>

                <td class="xl:py-3 xl:px-6 py-2 px-4  flex justify-center align-middle h-[70px] items-center">
                  <h1
                    class="text-center xl:text-start bg-primary_container text-background max-w-max rounded-2xl px-2 py-2">
                    {{ item.requestedAmount?.toString().match(/.{1,3}/g).join() }} {{ item.amountCurrency }}
                  </h1>
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]">
                  {{ item.invoiceNumber }}
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.status == 'Wait'">
                  Waiting Accounts
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.status == 'WaitForCompanyManger'">
                  Waiting Company Manager
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.status == 'Reject'">
                  Rejected
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.status == 'WaitForEdit'">
                  Waiting Update
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.status == 'ApprovalFromCFO'">
                  CFO Approved
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.status == 'Finished'">
                  Completed
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.status == 'WaitForCFO'">
                  Awaiting CFO approval
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4">
                  {{ dayjs(item.requestDate).format('ddd, DD MMM YYYY') }}
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4">
                  <div class="flex items-center gap-2" v-if="item.status == 'WaitForEdit'">
                    <PhEye class="w-6 h-6 fill-primary hover:scale-105 transition-all duration-300 cursor-pointer"
                      @click="editRequestInfo(index), (isEditModalOpen = true)" />
                  </div>
                  <div class="flex items-center gap-2">
                    <PhEye class="w-6 h-6 fill-primary hover:scale-105 transition-all duration-300 cursor-pointer"
                      @click="showRequestInfo(index, item.status, item.id), (isInfoModalOpen = true)" />
                  </div>

                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!--Pag-->
        <nav aria-label="Table navigation" class="flex justify-between items-center py-4">
          <div class="flex gap-2 items-center bg-primary_container py-2 px-4 rounded-xl">
            <span class="font-bold text-sm text-background">{{
                paginationIndex + 10 >= totalRecords
                  ? totalRecords
                  : paginationIndex + 10
            }}</span>
            <span class="text-on_background">From</span>
            <span class="font-bold text-sm text-background">{{
                totalRecords
            }}</span>
          </div>
          <ul class="flex items-center">
            <button :disabled="paginationIndex <= 1"
              class="flex items-center justify-center gap-2 cursor-pointer xl:text-sm text-base bold border-2 rounded-l-xl xl:px-4 xl:py-3 px-4 py-2 border-none bg-primary text-white shadow-lg transition-all duration-300 hover:opacity-80 disabled:opacity-75 disable:cursor-not-allowed hover:gap-4"
              @click="previousPage">
              Previous
            </button>
            <button :disabled="paginationIndex + 10 >= totalRecords"
              class="flex items-center justify-center gap-2 cursor-pointer xl:text-sm text-base bold border-2 rounded-r-xl xl:px-4 xl:py-3 px-4 py-2 border-none bg-primary text-white shadow-lg transition-all duration-300 hover:opacity-80 disabled:opacity-75 disable:cursor-not-allowed hover:gap-4"
              @click="nextPage">
              Next
            </button>
          </ul>
        </nav>
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
</style>
