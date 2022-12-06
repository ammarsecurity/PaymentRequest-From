<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import axiosInstance from '@/api/axiosInstance.js';
import { ref } from 'vue';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

/* -------------------- Vee Validate -------------------- */

const validationSchemaEdit = ref({
  requestedAmount: yup.string().required('هذا الحقل مطلوب'),
  amountCurrency: yup.string().required('هذا الحقل مطلوب'),
  purposeOfPaymentAndDetails: yup.string().required('هذا الحقل مطلوب'),
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
        title: 'خطأ',
        text: 'حدث خطأ اثناء تعديل الحساب',
        icon: 'error',
        showCancelButton: true,
        cancelButtonColor: '#213263',
        cancelButtonText: 'اغلاق',
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
        title: 'خطأ',
        text: 'حدث خطأ اثناء تعديل الحساب',
        icon: 'error',
        showCancelButton: true,
        cancelButtonColor: '#213263',
        cancelButtonText: 'اغلاق',
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
  <StateModal v-if="isAddSuccess" type="success" @close="isAddSuccess = false" title="تم اضافة الحساب  بنجاح" />
  <!-- Edit -->
  <StateModal v-if="isEditSuccess" @close="isEditSuccess = false" title="تم تعديل الحساب بنجاح" />
  <MainLoader v-if="isLoading" />

  <!-- Modals -->
  <!-- Add Modal -->
  <MainModal text="اضافة طلب جديد" v-if="isAddModalOpen" @close="isAddModalOpen = false">
    <Form class="flex flex-col gap-4" dir="rtl" :validationSchema="validationSchema" @submit="submit">


      <!-- Title -->
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">المبلغ</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="FullName" v-model="createRequestForm.requestedAmount" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="FullName" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">العملة</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="category" v-model="createRequestForm.amountCurrency" type="select" as="select">
          <option value="IQD">دولار</option>
          <option value="$">دينار</option>


        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="UserRole" component="div"></ErrorMessage>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">الغرض من الدفع والتفاصيل</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="purposeOfPaymentAndDetails" v-model="createRequestForm.purposeOfPaymentAndDetails" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="purposeOfPaymentAndDetails" component="div"></ErrorMessage>
      </div>


      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">تفاصيل اخرى</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="otherInfo" v-model="createRequestForm.otherInfo" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="otherInfo" component="div"></ErrorMessage>
      </div>

      <MainButton text="اضافة" type="submit" />
    </Form>
  </MainModal>

  <!-- Edit Modal -->
  <MainModal text="تعديل الطلب" v-if="isEditModalOpen" @close="isEditModalOpen = false">

    <Form class="flex flex-col gap-4" dir="rtl" :validationSchema="validationSchemaEdit" @submit="editSubmit">
      <!-- Photo -->
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">الصورة او الشعار</label>
        <Field
          class="border border-on_background_variant rounded-2xl px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="photo" v-model="editRequest.CompanyLogo" @change="uploadPhoto('add')" type="file">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="CompanyLogo" component="div"></ErrorMessage>
      </div>

      <!-- Title -->
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">الاسم الكامل</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="FullName" v-model="editRequest.FullName" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="FullName" component="div"></ErrorMessage>
      </div>


      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">البريد الالكتروني</label>
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
        <label class="text-xl text-primary">الفئة</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="category" v-model="editRequest.UserRole" type="select" as="select">
          <option value="1">محاسب</option>
          <option value="4">CFO</option>
          <option value="2">شركة</option>

        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="UserRole" component="div"></ErrorMessage>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">اسم الشركة</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="CompanyName" v-model="editRequest.CompanyName" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="CompanyName" component="div"></ErrorMessage>
      </div>

      <MainButton text="تعديل" type="submit" />
    </Form>

  </MainModal>

  <MainModal styles="w-[40vw] h-[70vh]" text="تفاصيل الطلب" v-if="isInfoModalOpen" @close="isInfoModalOpen = false">
    <div class="grid grid-cols-2 flex-col gap-16" dir="rtl">
      <div class="flex flex-col col-span-2 gap-4" v-if="role !== 'SupUser'">
        <div class="flex flex-col  gap-2" v-if="(role == 'User' && requeststatus != 'Wait')">
          <label class="text-xl text-primary">الملاحظة</label>
          <Field
            class="border border-on_background_variant bg-background rounded-2xl px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 "
            name="category" v-model="lastInfo" type="textarea" as="textarea">
          </Field>
          <ErrorMessage class="text-red-600 text-lg" name="UserRole" component="div"></ErrorMessage>
        </div>
        <div class=" flex gap-4  w-full col-span-2">
          <MainButton v-if="role == 'Accounter'" @click="editStatusRequest(3)" class="bg-green-600 border-none"
            text="الموافقة"></MainButton>
          <MainButton v-if="(role == 'User' && requeststatus != 'Wait')" @click="editStatusRequest(0)"
            class="bg-green-600 border-none" text="الموافقة"></MainButton>
          <MainButton v-if="role == 'CFO'" @click="editStatusRequest(6)" class="bg-green-600 border-none"
            text="الموافقة"></MainButton>

          <MainButton v-if="role == 'Accounter'" @click="editStatusRequest(1)" class="bg-orange-600 border-none"
            text="ارجاع لغرض التعديل"></MainButton>
          <MainButton class="bg-red-600 border-none" v-if="(role == 'User' && requeststatus != 'Wait')"
            @click="editStatusRequest(5)" text="رفض"></MainButton>
        </div>
      </div>


      <div class="flex flex-col gap-2  text-red-600" v-if="(requestInfo.paymentBudget == false)">
        <label class="text-xl text-primary  text-red-600">الملاحظة</label>
        <p class="text-xl text-primary  text-red-600">{{ requestInfo.lastInfo }}</p>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">الغرض من الدفع والتفاصيل</label>
        <p>{{ requestInfo.purposeOfPaymentAndDetails }}</p>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">تفاصيل اخرى</label>
        <p>{{ requestInfo.otherInfo }}</p>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">تاريخ الاستحقاق</label>
        <p>{{ requestInfo.dueDate }}</p>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">تاريخ الفاتورة</label>
        <p>{{ requestInfo.dueDate }}</p>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">اسم المستفيد</label>
        <p>{{ requestInfo.beneficaryName }}</p>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">دفع الميزانية</label>
        <p v-if="(requestInfo.paymentBudget == false)">لا</p>
      </div>
      <div class="flex flex-col gap-2" v-if="(requestInfo.paymentBudget == false)">
        <label class="text-xl text-primary">السبب</label>
        <p>{{ requestInfo.paymentBudgetIfFalseJustification }}</p>
      </div>

    </div>

  </MainModal>

  <div class="flex xl:overflow-hidden xl:h-screen relative z-20" v-motion-fade>
    <DashboardSidebar class="hidden xl:block" />
    <div class="flex flex-col w-full">
      <DashboardNavBar path="الطلبات قيد الانتظار" />
      <div class="flex flex-col px-4 xl:px-8 mt-32 xl:mt-8 gap-4">
        <MainButton v-if="showAddOrder" @click="isAddModalOpen = true" text="اضافة طلب  جديد">
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
                  صورة او الشعار
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  الاسم الكامل
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  اسم الشركة
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  المبلغ
                </th>

                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  رقم الفاتورة
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  الحالة
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  تاريخ الاضافة
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4 rounded-tl-xl">
                  الاجرائات
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-white border-b odd:bg-gray-100 even:bg-background text-sm" v-for="(item, index) in list"
                :key="item.id">
                <td class="xl:py-3 xl:px-6 py-2 px-4 font-bold text-primary">
                  {{ index + 1 + paginationIndex }}
                </td>
                <th scope="row" class="whitespace-nowrap">
                  <img class="h-16 w-20 object-cover rounded-lg my-1" :src="item.companyLogo" alt="" />
                </th>
                <td class="xl:py-3 xl:px-6 py-2 px-4 font-bold">
                  {{ item.fullName }}
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]">
                  {{ item.companyName }}
                </td>

                <td class="xl:py-3 xl:px-6 py-2 px-4">
                  <h1
                    class="text-center xl:text-start bg-primary_container text-on_background max-w-max rounded-2xl px-2 py-2">
                    {{ item.requestedAmount }} - {{ item.amountCurrency }}
                  </h1>
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]">
                  {{ item.invoiceNumber }}
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.status == 'Wait'">
                  انتظار الحسابات
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.status == 'WaitForCompanyManger'">
                  انتظار مدير الشركة
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.status == 'Reject'">
                  مرفوضة
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.status == 'WaitForEdit'">
                  انتظار التعديل
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.status == 'ApprovalFromCFO'">
                  تمت الموافقة من قبل CFO
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.status == 'Finished'">
                  مكتملة
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.status == 'WaitForCFO'">
                  انتظار موافقة CFO
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
            <span class="font-bold text-sm text-primary">{{
                paginationIndex + 10 >= totalRecords
                  ? totalRecords
                  : paginationIndex + 10
            }}</span>
            <span class="text-on_background">من</span>
            <span class="font-bold text-sm text-primary">{{
                totalRecords
            }}</span>
          </div>
          <ul class="flex items-center">
            <button :disabled="paginationIndex <= 1"
              class="flex items-center justify-center gap-2 cursor-pointer xl:text-sm text-base bold border-2 rounded-r-xl xl:px-4 xl:py-3 px-4 py-2 border-none bg-primary text-white shadow-lg transition-all duration-300 hover:opacity-80 disabled:opacity-75 disable:cursor-not-allowed hover:gap-4"
              @click="previousPage">
              السابق
            </button>
            <button :disabled="paginationIndex + 10 >= totalRecords"
              class="flex items-center justify-center gap-2 cursor-pointer xl:text-sm text-base bold border-2 rounded-l-xl xl:px-4 xl:py-3 px-4 py-2 border-none bg-primary text-white shadow-lg transition-all duration-300 hover:opacity-80 disabled:opacity-75 disable:cursor-not-allowed hover:gap-4"
              @click="nextPage">
              التالي
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
