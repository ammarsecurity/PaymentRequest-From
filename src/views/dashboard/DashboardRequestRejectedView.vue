<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { axiosInstance, baseURL } from '@/api/axiosInstance.js';
import { ref } from 'vue';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { computed } from '@vue/reactivity';
import printJS from 'print-js';

/* -------------------- Vee Validate -------------------- */

const validationSchemaEdit = ref({
  requestedAmount: yup.number().required('This field is required'),
  amountCurrency: yup.string().required('This field is required'),
  invoiceDate: yup.string().required('This field is required'),
  dueDate: yup.string().required('This field is required'),
});
const validationSchema = ref({
  requestedAmount: yup.number().required('This field is required'),
  amountCurrency: yup.string().required('This field is required'),
  invoiceDate: yup.string().required('This field is required'),
  dueDate: yup.string().required('This field is required'),
  purposeOfPaymentAndDetails: yup.string().required('This field is required'),
});
/* ------------------------ Axios ----------------------- */
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isUploadModalOpen = ref(false);
const isInfoModalOpen = ref(false);
const isError = ref(false);
const isLoading = ref(false);

const nWords = ref('');

var a = [
  '',
  'one ',
  'two ',
  'three ',
  'four ',
  'five ',
  'six ',
  'seven ',
  'eight ',
  'nine ',
  'ten ',
  'eleven ',
  'twelve ',
  'thirteen ',
  'fourteen ',
  'fifteen ',
  'sixteen ',
  'seventeen ',
  'eighteen ',
  'nineteen ',
];
var b = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
];

function inWords(n) {
  var num = n.target.value;
  if ((num = num.toString()).length > 9) return 'overflow';
  n = ('000000000' + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  var str = '';
  str +=
    n[1] != 0
      ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'billion '
      : '';
  str +=
    n[2] != 0
      ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'million '
      : '';
  str +=
    n[3] != 0
      ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand '
      : '';
  str +=
    n[4] != 0
      ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred '
      : '';
  str +=
    n[5] != 0
      ? (str != '' ? 'and ' : '') +
      (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) +
      'only '
      : '';
  nWords.value = str;
  // return str;
}

// POST
const createRequestForm = ref({
  requestedAmount: '',
  amountCurrency: '',
  purposeOfPaymentAndDetails: '',
  otherInfo: '',
  paymentBudget: true,
  paymentBudgetIfFalseJustification: '',
  paymentMethod: '',
  invoiceNumber: '',
  invoiceDate: '',
  dueDate: '',
  beneficaryName: '',
  companyId: '00000000-0000-0000-0000-000000000000',
  requestLoction: '',
});
const AttachmenmtForm = ref({
  File: '',
  RequestId: '',
});

const searchform = ref({
  status: '',
  requestNumber: '',
  companyName: '',
  fullName: '',
  date: '',
});

const search = async (value) => {
  getRequest();
  pageNumber.value = 1;
};

var showAddOrder = false;
var isUser = false;
const role = localStorage.getItem('role');
if (role == 'Accounter') {
  showAddOrder = false;
  isUser = false;
} else if (role == 'HOP' || role == 'HOD') {
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
      Swal.fire({
        title: 'Operation accomplished successfully',
        icon: 'success',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Close',
      }),
        (createRequestForm.value = {
          requestedAmount: '',
          amountCurrency: '',
          purposeOfPaymentAndDetails: '',
          otherInfo: '',
          paymentBudget: '',
          paymentBudgetIfFalseJustification: '',
          paymentMethod: '',
          invoiceNumber: '',
          invoiceDate: '',
          dueDate: '',
          companyId: '',
          requestLoction: '',
        });

      nWords.value == '';
      getRequest();
    })
    .catch((error) => {
      console.log(error);
      isLoading.value = false;
      Swal.fire({
        title: 'Error',
        text: 'An information error has occurred',
        icon: 'error',
        showCancelButton: true,
        cancelButtonColor: '#213263',
        cancelButtonText: 'Close',
      });
    });

  return;
};
const isNumber = async (value) => {
  alert('gfddfg');
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    evt.preventDefault();
  } else {
    return true;
  }
};

const companies = ref([]);
const getCompany = () => {
  isLoading.value = true;
  axiosInstance
    .get(`Main/GetCompanies`)
    .then(({ data }) => {
      companies.value = data.data;
      isLoading.value = false;
    })
    .catch((error) => { });
};

getCompany();

const lastInfo = ref('Nothing');
const requestId = ref('');
const requeststatus = ref('');
const attachmentList = ref([]);
const paymentBudgetReason = computed(() => {
  return createRequestForm.value.paymentBudget;
});

const editStatusRequest = async (value) => {
  isLoading.value = true;
  isError.value = false;
  axiosInstance
    .post(
      'Main/EditRequset?id=' +
      requestId.value +
      '&message=' +
      lastInfo.value +
      '&status=' +
      value
    )
    .then(({ data }) => {
      isLoading.value = false;
      isInfoModalOpen.value = false;
      Swal.fire({
        title: 'Operation accomplished successfully',
        icon: 'success',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Close',
      }),
        getRequest();
    })
    .catch((error) => {
      isLoading.value = false;
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while updating the request',
        icon: 'error',
        showCancelButton: true,
        cancelButtonColor: '#213263',
        cancelButtonText: 'Close',
      });
    });
  return;
};
const uploadAttachment = async (value) => {
  isLoading.value = true;
  isError.value = false;

  const formData = new FormData();
  formData.append('File', AttachmenmtForm.value.File);

  axiosInstance
    .post(
      'Main/AddAttachment?requestId=' + AttachmenmtForm.value.RequestId,
      formData
    )
    .then(({ data }) => {
      isLoading.value = false;
      isInfoModalOpen.value = false;
      Swal.fire({
        title: 'Operation accomplished successfully',
        icon: 'success',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Close',
      }),
        getRequest();
    })
    .catch((error) => {
      isLoading.value = false;
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while updating the request',
        icon: 'error',
        showCancelButton: true,
        cancelButtonColor: '#213263',
        cancelButtonText: 'Close',
      });
    });
  return;
};

const print = async (id) => {
  printJS({
    printable: `${baseURL}Main/GetReport?id=${id}`,
    type: 'pdf',
    modalMessage: 'Preparing for printing ...',
    showModal: true,
  });
};

const editSubmit = async (value) => {
  isLoading.value = true;
  isError.value = false;

  axiosInstance
    .post('Main/editRequestInfo?id=' + editRequest.value.id, editRequest.value)
    .then(({ data }) => {
      isLoading.value = false;
      isEditModalOpen.value = false;
      Swal.fire({
        title: 'Operation accomplished successfully',
        icon: 'success',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Close',
      }),
        getRequest();
    })
    .catch((error) => {
      isLoading.value = false;
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while updating the request',
        icon: 'error',
        showCancelButton: true,
        cancelButtonColor: '#213263',
        cancelButtonText: 'Close',
      });
      return;
    });
  return;
};

// GET
const paginationIndex = ref(0);
const list = ref([]);
const totalRecords = ref('');
const pageSize = ref(10);
const pageNumber = ref(1);

const getRequest = () => {
  isLoading.value = true;
  axiosInstance
    .get(
      `Main/GetRequset?userRequest=${isUser}&PageNumber=${pageNumber.value}&PageSize=${pageSize.value}&date=${searchform.value.date}&companyName=${searchform.value.companyName}&requestNumber=${searchform.value.requestNumber}&status=Reject&fullName=${searchform.value.fullName}&isAll=true`
    )
    .then(({ data }) => {
      list.value = data.data;
      pageNumber.value = data.pageNumber;
      pageSize.value = data.pageSize;
      totalRecords.value = data.totalRecords;
      isLoading.value = false;
    })
    .catch((error) => {
      isLoading.value = false;
      console.log(error);
      isLoading.value = false;
      Swal.fire({
        title: 'Error',
        text: 'An information error has occurred',
        icon: 'error',
        showCancelButton: true,
        cancelButtonColor: '#213263',
        cancelButtonText: 'Close',
      });
    });
};
getRequest();

const nextPage = () => {
  pageNumber.value++, (paginationIndex.value += 10), getRequest();
};
const previousPage = () => {
  pageNumber.value--, (paginationIndex.value -= 10), getRequest();
};

const editRequest = ref({
  id: '',
  requestedAmount: '',
  amountCurrency: '',
  purposeOfPaymentAndDetails: '',
  otherInfo: '',
  paymentBudget: '',
  paymentBudgetIfFalseJustification: '',
  paymentMethod: '',
  invoiceNumber: '',
  invoiceDate: '',
  dueDate: '',
  beneficaryName: '',
  companyId: '',
  requestLoction: '',
});

const editRequestInfo = (index) => {
  const info = list.value[index];
  editRequest.value.id = info.id;
  editRequest.value.requestedAmount = info.requestedAmount;
  editRequest.value.purposeOfPaymentAndDetails =
    info.purposeOfPaymentAndDetails;
  editRequest.value.otherInfo = info.otherInfo;
  editRequest.value.amountCurrency = info.amountCurrency;
  editRequest.value.invoiceNumber = info.invoiceNumber;
  editRequest.value.requestNumber = info.requestNumber;
  editRequest.value.status = info.status;
  editRequest.value.requestDate = info.requestDate;
  editRequest.value.paymentMethod = info.paymentMethod;
  editRequest.value.dueDate = info.dueDate.toString().split('T')[0];
  editRequest.value.paymentBudget = info.paymentBudget;
  editRequest.value.paymentBudgetIfFalseJustification =
    info.paymentBudgetIfFalseJustification;
  editRequest.value.invoiceDate = info.invoiceDate.toString().split('T')[0];
  editRequest.value.beneficaryName = info.beneficaryName;
  editRequest.value.id = info.id;
  editRequest.value.companyId = info.companyId;
  editRequest.value.requestLoction = info.requestLoction;
};

const requestInfo = ref({
  purposeOfPaymentAndDetails: '',
  otherInfo: '',
  lastInfo: '',
  invoiceDate: '',
  beneficaryName: '',
  dueDate: '',
  paymentBudget: '',
  requestLoction: '',
  companyId: '',
});

const RequestisFinished = ref('');
const showRequestInfo = (index, status, id, isFinished) => {
  requestId.value = id;
  requeststatus.value = status;
  RequestisFinished.value = isFinished;
  const info = list.value[index];
  (requestInfo.value.beneficaryName = info.beneficaryName),
    (requestInfo.value.otherInfo = info.otherInfo),
    (requestInfo.value.invoiceDate = info.invoiceDate),
    (requestInfo.value.dueDate = info.dueDate),
    (requestInfo.value.paymentBudget = info.paymentBudget),
    (requestInfo.value.purposeOfPaymentAndDetails =
      info.purposeOfPaymentAndDetails),
    (requestInfo.value.requestLoction = info.requestLoction),
    (requestInfo.value.paymentBudgetIfFalseJustification =
      info.paymentBudgetIfFalseJustification),
    (requestInfo.value.lastInfo = info.lastInfo),
    (requestInfo.value.paymentMethod = info.paymentMethod);
  requestInfo.value.companyId = info.companyId;
};

const attachmentmodel = (index) => {
  const info = list.value[index];
  AttachmenmtForm.value.RequestId = info.id;
  attachmentList.value = info.attachments;
};
</script>
<template>
  <!-- Post -->

  <!-- Edit -->

  <MainLoader v-if="isLoading" />

  <!-- Modals -->
  <!-- Add Modal -->
  <MainModal styles="max-w-max" text="Add a new request" v-if="isAddModalOpen" @close="isAddModalOpen = false">
    <Form class="gap-4 grid grid-cols-2" :validationSchema="validationSchema" @submit="submit">
      <!-- Title -->
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Amount</label>

        <Field @keypress="inWords($event)"
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="requestedAmount" min="0" v-model="createRequestForm.requestedAmount" type="number" />
        <span class="text-red-500">{{ nWords }}</span>
        <ErrorMessage class="text-red-600 text-lg" name="requestedAmount" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Currency</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="amountCurrency" v-model="createRequestForm.amountCurrency" type="select" as="select">
          <option value="IQD">IQD</option>
          <option value="USD">USD</option>
          <option value="ERUO">EURO</option>
          <option value="CHF">CHF</option>
          <option value="GBP">GBP</option>
          <option value="DHS">DHS</option>
          <option value="JD">JD</option>
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="amountCurrency" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Payment method</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="paymentMethod" v-model="createRequestForm.paymentMethod" type="select" as="select">
          <option value="Cash">Cash</option>
          <option value="WireTransfer">Wire Transfer</option>
          <option value="WesternUnion">Western union</option>
          <option value="Cheque">Cheque</option>
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="paymentMethod" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Payment Budget</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="paymentBudget" v-model="createRequestForm.paymentBudget" type="select" as="select">
          <option :value="true">yas</option>
          <option :value="false">No</option>
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="paymentBudget" component="div"></ErrorMessage>
      </div>
      <div class="flex flex-col gap-2" v-if="!paymentBudgetReason">
        <label class="text-xl text-red-500">Please Provide Reasonable justification</label>
        <Field
          class="border border-red-600 rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="paymentBudgetIfFalseJustification" v-model="createRequestForm.paymentBudgetIfFalseJustification"
          type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="paymentBudgetIfFalseJustification" component="div">
        </ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Invoice Number</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="invoiceNumber" v-model="createRequestForm.invoiceNumber" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="invoiceNumber" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Invoice Date</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="invoiceDate" v-model="createRequestForm.invoiceDate" type="date">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="invoiceDate" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Due Date</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="dueDate" v-model="createRequestForm.dueDate" type="date">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="dueDate" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Beneficary Name</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="BeneficaryName" v-model="createRequestForm.beneficaryName" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="BeneficaryName" component="div"></ErrorMessage>
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
        <label class="text-xl text-primary">Request details</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="otherInfo" v-model="createRequestForm.otherInfo" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="otherInfo" component="div"></ErrorMessage>
      </div>
      <div class="flex flex-col gap-2" v-if="role == 'HOP' || role == 'HOD'">
        <label class="text-xl text-primary">Company</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="companies" v-model="createRequestForm.companyId" type="select" as="select">
          <option v-for="item in companies" :value="item.id">
            {{ item.companyName }}
          </option>
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="companies" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">To</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="requestLoction" v-model="createRequestForm.requestLoction" type="select" as="select">
          <option :value="1">Accounter</option>
          <option :value="7">Business department manager (BDM)</option>
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="requestLoction" component="div"></ErrorMessage>
      </div>
      <MainButton class="col-span-2 mt-5" text="Add" type="submit" />
    </Form>
  </MainModal>

  <!-- Edit Modal -->
  <MainModal text="Update Request" v-if="isEditModalOpen" @close="isEditModalOpen = false">
    <Form class="gap-4" :validationSchema="validationSchemaEdit" @submit="editSubmit">
      <!-- Photo -->
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Amount</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="requestedAmount" min="0" v-model="editRequest.requestedAmount" type="number">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="requestedAmount" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Currency</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="amountCurrency" v-model="editRequest.amountCurrency" type="select" as="select">
          <option value="IQD">IQD</option>
          <option value="USD">USD</option>
          <option value="ERUO">EURO</option>
          <option value="CHF">CHF</option>
          <option value="GBP">GBP</option>
          <option value="DHS">DHS</option>
          <option value="JD">JD</option>
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="amountCurrency" component="div"></ErrorMessage>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Payment method</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="paymentMethod" v-model="editRequest.paymentMethod" type="select" as="select">
          <option value="Cash">Cash</option>
          <option value="WireTransfer">Wire Transfer</option>
          <option value="WesternUnion">Western union</option>
          <option value="Cheque">Cheque</option>
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="paymentMethod" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Payment Budget</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="paymentBudget" v-model="editRequest.paymentBudget" type="select" as="select">
          <option :value="true">yas</option>
          <option :value="false">No</option>
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="paymentBudget" component="div"></ErrorMessage>
      </div>
      <div class="flex flex-col gap-2" v-if="editRequest.paymentBudget == false">
        <label class="text-xl text-primary">Please Provide Reasonable justification</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="paymentBudgetIfFalseJustification" v-model="editRequest.paymentBudgetIfFalseJustification" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="paymentBudgetIfFalseJustification" component="div">
        </ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Invoice Number</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="invoiceNumber" v-model="editRequest.invoiceNumber" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="invoiceNumber" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Invoice Date</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="invoiceDate" v-model="editRequest.invoiceDate" type="date">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="invoiceDate" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Due Date</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="dueDate" v-model="editRequest.dueDate" type="date">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="dueDate" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Beneficary Name</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="BeneficaryName" v-model="editRequest.beneficaryName" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="BeneficaryName" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Purpose of payment and details</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="purposeOfPaymentAndDetails" v-model="editRequest.purposeOfPaymentAndDetails" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="purposeOfPaymentAndDetails" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Other details</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="otherInfo" v-model="editRequest.otherInfo" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="otherInfo" component="div"></ErrorMessage>
      </div>
      <div class="flex flex-col gap-2" v-if="role == 'HOP' || role == 'HOD'">
        <label class="text-xl text-primary">Company</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="companies" v-model="editRequest.companyId" type="select" as="select">
          <option v-for="item in companies" :value="item.id">
            {{ item.companyName }}
          </option>
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="companies" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">To</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="requestLoction" v-model="editRequest.requestLoction" type="select" as="select">
          <option :value="1">Accounter</option>
          <option :value="7">Business department manager (BDM)</option>
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="requestLoction" component="div"></ErrorMessage>
      </div>

      <MainButton class="col-span-2 mt-5" text="Add" type="submit" />
    </Form>
  </MainModal>

  <MainModal text="Upload Attachment" v-if="isUploadModalOpen" @close="isUploadModalOpen = false">
    <div class="flex-1 text-center justify-center grid">
      <Form class="gap-4" @submit="uploadAttachment()">
        <!-- Photo -->
        <div class="flex flex-col gap-2">
          <label class="text-xl text-primary">Attachment File</label>
          <span>png , jpg , zip , doc , xlsx , xls</span>
          <Field
            class="border border-on_background_variant rounded-2xl px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
            name="File" v-model="AttachmenmtForm.File" @change="uploadPhoto('add')" type="file">
          </Field>
          <ErrorMessage class="text-red-600 text-lg" name="File" component="div"></ErrorMessage>
        </div>
        <MainButton class="mt-5" text="Add" type="submit" />
      </Form>
    </div>

    <hr />
    <div class="grid grid-cols-2">
      <div v-for="item in attachmentList"
        class="flex justify-center text-center max-w-sm rounded overflow-hidden shadow-lg mt-7">
        <img class="w-28" src="../../../public/images/att.png" alt="Sunset in the mountains" />
        <!-- <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">{{ item.attachmentFile }}</div>
        </div> -->
        <div class="px-6 pt-4 pb-2">
          <span class="inline-block bg-orange-400 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">{{
              item.insertDate.split('T')[0]
          }}</span>
          <span class="inline-block bg-green-500 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">
            {{ item.fullName }}
          </span>
          <span class="inline-block bg-cyan-900 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">
            Download
          </span>
        </div>
      </div>
    </div>
  </MainModal>

  <MainModal styles="w-[40vw] h-[70vh]" text="Request details" v-if="isInfoModalOpen" @close="isInfoModalOpen = false">
    <div class="grid grid-cols-2 flex-col gap-5">
      <div class="flex flex-col col-span-2 gap-4" v-if="RequestisFinished != true">
        <div class="flex flex-col gap-2" v-if="role != 'SupUser' && role != 'HOP' && role != 'HOD'">
          <label class="text-xl text-primary">Note</label>
          <Field
            class="border border-on_background_variant bg-background rounded-2xl px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300"
            name="lastInfo" v-model="lastInfo" type="textarea" as="textarea">
          </Field>
          <ErrorMessage class="text-red-600 text-lg" name="lastInfo" component="div"></ErrorMessage>
        </div>
        <div class="flex gap-4 w-full col-span-2">
          <MainButton v-if="role == 'Accounter'" @click="editStatusRequest('WaitForCFO')"
            class="bg-green-600 border-none" text="Approval"></MainButton>

          <MainButton v-if="role == 'CFO'" @click="editStatusRequest('ApprovalFromCFO')"
            class="bg-green-600 border-none" text="Approval"></MainButton>

          <MainButton v-if="role == 'BDM'" @click="editStatusRequest('Wait')" class="bg-green-600 border-none"
            text="Approval"></MainButton>

          <MainButton v-if="role == 'Accounter'" @click="editStatusRequest('WaitForEdit')"
            class="bg-orange-600 border-none" text="Return for modification"></MainButton>

          <MainButton class="bg-red-600 border-none" v-if="
            (role != 'HOP' || 'HOD') &&
            (role == 'CFO' || role == 'Accounter' || role == 'BDM')
          " @click="editStatusRequest('Reject')" text="Reject"></MainButton>
        </div>
      </div>

      <div class="flex flex-col gap-2 text-red-600 bg-white border roundedshadow-sm p-3">
        <label class="text-xl text-primary text-red-600">Note</label>
        <hr />
        <p class="text-xl text-primary text-red-600">
          {{ requestInfo.lastInfo }}
        </p>
      </div>

      <div class="flex flex-col gap-2 bg-white border roundedshadow-sm p-3">
        <label class="text-xl text-primary">Purpose of payment and details</label>
        <hr />
        <p>{{ requestInfo.purposeOfPaymentAndDetails }}</p>
      </div>

      <div class="flex flex-col gap-2 bg-white border roundedshadow-sm p-3">
        <label class="text-xl text-primary">Request details</label>
        <hr />
        <p>{{ requestInfo.otherInfo }}</p>
      </div>
      <div class="flex flex-col gap-2 bg-white border roundedshadow-sm p-3">
        <label class="text-xl text-primary">Payment method </label>
        <hr />
        <p>{{ requestInfo.paymentMethod }}</p>
      </div>
      <div class="flex flex-col gap-2 bg-white border roundedshadow-sm p-3">
        <label class="text-xl text-primary">Due date</label>
        <hr />
        <p>{{ dayjs(requestInfo.dueDate).format('ddd, DD MMM YYYY') }}</p>
      </div>
      <div class="flex flex-col gap-2 bg-white border roundedshadow-sm p-3">
        <label class="text-xl text-primary">Invoice Date</label>
        <hr />
        <p>{{ dayjs(requestInfo.invoiceDate).format('ddd, DD MMM YYYY') }}</p>
      </div>
      <div class="flex flex-col gap-2 bg-white border roundedshadow-sm p-3">
        <label class="text-xl text-primary">Beneficary Name</label>
        <hr />
        <p>{{ requestInfo.beneficaryName }}</p>
      </div>
      <div class="flex flex-col gap-2 bg-white border roundedshadow-sm p-3">
        <label class="text-xl text-primary">Payment Budget</label>
        <hr />
        <p v-if="requestInfo.paymentBudget == false">No</p>
        <p v-else>yas</p>
      </div>
      <div class="flex flex-col gap-2 bg-white border roundedshadow-sm p-3" v-if="requestInfo.paymentBudget == false">
        <label class="text-xl text-primary">Please Provide Reasonable justification</label>
        <hr />
        <p>{{ requestInfo.paymentBudgetIfFalseJustification }}</p>
      </div>
    </div>
  </MainModal>

  <div class="flex xl:overflow-hidden xl:h-screen relative z-20" v-motion-fade>
    <DashboardSidebar class="hidden xl:block" />
    <div class="flex flex-col w-full">
      <DashboardNavBar path="Pending Orders" />
      <div class="flex flex-col px-4 xl:px-8 mt-32 xl:mt-8 gap-4">
        <div class="flex flex-col xl:flex-row w-full xl:justify-between xl:items-center">
          <div class="grid grid-cols-2 xl:flex xl:flex-row gap-4 items-center">
            <div class="flex flex-col gap-2">
              <label class="text-primary">Full Name</label>
              <Field
                class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 h-10 w-48"
                name="Password" v-model="searchform.fullName" type="text">
              </Field>
              <ErrorMessage class="text-red-600 text-lg" name="Password" component="div"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-primary">Company Name</label>
              <Field
                class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 h-10 w-48"
                name="Password" v-model="searchform.companyName" type="text">
              </Field>
              <ErrorMessage class="text-red-600 text-lg" name="Password" component="div"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-primary">Request Number</label>
              <Field
                class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 h-10 w-48"
                name="Password" v-model="searchform.requestNumber" type="text">
              </Field>
              <ErrorMessage class="text-red-600 text-lg" name="Password" component="div"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-primary">Date</label>
              <Field
                class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 h-10 w-48"
                name="Password" v-model="searchform.date" type="date">
              </Field>
              <ErrorMessage class="text-red-600 text-lg" name="Password" component="div"></ErrorMessage>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-primary">Status</label>
              <Field
                class="border border-on_background_variant bg-background rounded-full focus:outline-primary focus:outline-2 transition-all duration-300 h-10 w-48"
                name="status" v-model="searchform.status" type="select" as="select">
                <option value="">All</option>
                <option value="Wait">Pending at Finance</option>
                <option value="WaitForCompanyManger">
                  Pending at Company Manager
                </option>
                <option value="Reject">Rejected</option>
                <option value="WaitForEdit">Waiting Update</option>
                <option value="WaitForCFO">Pending at CFO</option>
                <option value="Finished">Completed</option>
              </Field>
              <ErrorMessage class="text-red-600 text-lg" name="status" component="div"></ErrorMessage>
            </div>
            <div class="bg-primary rounded-full p-2 self-end max-w-max" @click="search()">
              <PhMagnifyingGlass class="h-6 w-6 fill-on_primary" />
            </div>
          </div>

          <MainButton class="h-12 mt-4 xl:mt-0" v-if="showAddOrder" @click="isAddModalOpen = true"
            text="Add new request">
          </MainButton>
        </div>
        <!-- Table -->

        <div class="overflow-x-auto xl:overflow-y-auto relative shadow-md rounded-xl h-full xl:h-[71vh] bg-background">
          <table class="w-full text-right text-on_background">
            <thead class="text-base text-on_primary bg-primary">
              <tr>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  #
                </th>
                <!-- <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  Picture or logo
                </th> -->
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
                  Request Number
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
              <tr class="bg-white border-b odd:bg-gray-200 even:bg-background text-sm" v-for="(item, index) in list">
                <td class="xl:py-3 xl:px-6 py-2 px-4 font-bold text-primary">
                  {{ index + 1 + paginationIndex }}
                </td>
                <!-- <th scope="row" class="whitespace-nowrap ">
                  <img class="h-16 w-16 object-cover rounded-[50px] my-1" :src="item.companyLogo" alt="" />
                </th> -->
                <td class="xl:py-3 xl:px-6 py-2 px-4 font-bold">
                  {{ item.fullName }}
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]">
                  {{ item.companyName }}
                </td>

                <td class="xl:py-3 xl:px-6 py-2 px-4 flex justify-center align-middle h-[70px] items-center">
                  <h1
                    class="text-center xl:text-start bg-primary_container text-background max-w-max rounded-2xl px-2 py-2">
                    {{
                        item.requestedAmount == ''
                          ? item.requestedAmount
                          : item.requestedAmount
                            ?.toString()
                            .match(/.{1,3}/g)
                            .join()
                    }}
                    {{ item.amountCurrency }}
                  </h1>
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]">
                  {{ item.invoiceNumber }}
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]">
                  {{ item.requestNumber }}
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.status == 'Wait'">
                  Pending at Finance
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.status == 'WaitForCompanyManger'">
                  Pending at Company Manager
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
                  Pending at CFO
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.status == 'WaitForBDM'">
                  Pending at BDM
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4">
                  {{ dayjs(item.requestDate).format('ddd, DD MMM YYYY') }}
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4">
                  <div class="flex items-center gap-2">
                    <PhPencil v-if="item.status == 'WaitForEdit'"
                      class="w-6 h-6 fill-primary hover:scale-105 transition-all duration-300 cursor-pointer" @click="
                        editRequestInfo(index), (isEditModalOpen = true)
                      " />

                    <PhEye class="w-6 h-6 fill-primary hover:scale-105 transition-all duration-300 cursor-pointer"
                      @click="
                        showRequestInfo(
                          index,
                          item.status,
                          item.id,
                          item.isFinished
                        ),
                        (isInfoModalOpen = true)
                      " />
                    <PhPrinterDuotone @click="print(item.id)" v-if="
                      item.isFinished == true &&
                      item.requestLoction == 1 &&
                      role == 'Accounter'
                    " class="w-6 h-6 fill-primary hover:scale-105 transition-all duration-300 cursor-pointer" />
                    <PhFileText @click="
                      attachmentmodel(index), (isUploadModalOpen = true)
                    " class="w-6 h-6 fill-primary hover:scale-105 transition-all duration-300 cursor-pointer" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!--Pag-->
        <nav aria-label="Table navigation" class="flex justify-between items-center py-4">
          <div class="flex gap-2 items-center bg-primary_container rounded-xl py-2 px-4">
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
