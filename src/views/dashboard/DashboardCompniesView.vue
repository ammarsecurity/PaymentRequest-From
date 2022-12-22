<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { axiosInstance } from '@/api/axiosInstance.js';
import { ref } from 'vue';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

/* -------------------- Vee Validate -------------------- */
const validationSchema = ref({
  CompanyName: yup.string().required('This field is required'),
  Photo: yup.string().required('This field is required'),
});
const validationSchemaEdit = ref({
  CompanyName: yup.string().required('This field is required'),
});
/* ------------------------ Axios ----------------------- */

const isError = ref(false);
const isLoading = ref(false);

const submit = async (value) => {
  isLoading.value = true;
  isError.value = false;

  const formData = new FormData();
  formData.append('CompanyLogo', createCompanyForm.value.Photo);
  formData.append('CompanyName', createCompanyForm.value.CompanyName);

  axiosInstance
    .post('Main/AddCompany', formData)
    .then(({ data }) => {
      isLoading.value = false;
      isAddModalOpen.value = false;
      Swal.fire({
        title: 'The company has been sdded successfully',
        icon: 'success',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Close',
      }),
        (createCompanyForm.value = {
          CompanyName: '',
          Photo: '',
        });
      getCompany();
    })
    .catch((error) => {
      isLoading.value = true;
      console.log(error);
    });

  return;
};

const createCompanyForm = ref({
  CompanyName: '',
  Photo: '',
});

const editCompany = ref({
  id: '',
  CompanyName: '',
  Photo: '',
});

const editSubmit = async (value) => {
  isLoading.value = true;
  isError.value = false;

  const formData = new FormData();
  formData.append('CompanyLogo', editCompany.value.Photo);
  formData.append('CompanyName', editCompany.value.CompanyName);

  axiosInstance
    .post('Main/EditCompany?id=' + editCompany.value.id, formData)
    .then(({ data }) => {
      isLoading.value = false;
      isEditModalOpen.value = false;
      Swal.fire({
        title: 'The company has been updated successfully',
        icon: 'success',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Close',
      }),
        getCompany();
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

// GET

const companies = ref([]);

const getCompany = () => {
  isLoading.value = true;
  axiosInstance
    .get(`Main/GetCompanies`)
    .then(({ data }) => {
      companies.value = data.data;
      isLoading.value = false;
    })
    .catch((error) => {});
};
getCompany();

const editCompanyInfo = (index) => {
  const info = companies.value[index];
  editCompany.value.CompanyName = info.companyName;
  editCompany.value.id = info.id;
};

const deleteCompany = async (value) => {
  Swal.fire({
    title: 'Are you sure to delete the company?',
    text: 'After deletion, the company cannot be recovered',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#213263',
    confirmButtonText: 'yes، Deleted',
    cancelButtonText: 'Close',
  }).then((result) => {
    if (result.isConfirmed) {
      isLoading.value = true;
      isError.value = false;
      axiosInstance
        .post('Main/DeleteCompany?id=' + value)
        .then(({ data }) => {
          Swal.fire({
            title: 'The company has been deleted successfully',
            icon: 'success',
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonColor: '#d33',
            cancelButtonText: 'Close',
          }),
            (isLoading.value = false);
          getCompany();
        })
        .catch((error) => {});
    }
  });
  return;
};

/* ------------------------ Index ----------------------- */
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
</script>
<template>
  <!-- Post -->

  <!-- Edit -->
  <MainLoader v-if="isLoading" />

  <!-- Modals -->
  <!-- Add Modal -->
  <MainModal
    text="Add a new Company"
    v-if="isAddModalOpen"
    @close="isAddModalOpen = false">
    <Form
      class="flex flex-col gap-4"
      :validationSchema="validationSchema"
      @submit="submit">
      <!-- Photo -->
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Logo</label>
        <Field
          class="border border-on_background_variant rounded-2xl px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="Photo"
          v-model="createCompanyForm.Photo"
          @change="uploadPhoto('add')"
          type="file">
        </Field>
        <ErrorMessage
          class="text-red-600 text-lg"
          name="Photo"
          component="div"></ErrorMessage>
      </div>

      <!-- Title -->
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Company Name</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="CompanyName"
          v-model="createCompanyForm.CompanyName"
          type="text">
        </Field>
        <ErrorMessage
          class="text-red-600 text-lg"
          name="CompanyName"
          component="div"></ErrorMessage>
      </div>
      <MainButton
        text="Add"
        type="submit" />
    </Form>
  </MainModal>

  <!-- Edit Modal -->
  <MainModal
    text="UpdateCompany"
    v-if="isEditModalOpen"
    @close="isEditModalOpen = false">
    <Form
      class="flex flex-col gap-4"
      :validationSchema="validationSchemaEdit"
      @submit="editSubmit">
      <!-- Photo -->
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Logo</label>
        <Field
          class="border border-on_background_variant rounded-2xl px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="photo"
          v-model="editCompany.Photo"
          @change="uploadPhoto('add')"
          type="file">
        </Field>
        <ErrorMessage
          class="text-red-600 text-lg"
          name="Photo"
          component="div"></ErrorMessage>
      </div>

      <!-- Title -->
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Company Name</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="CompanyName"
          v-model="editCompany.CompanyName"
          type="text">
        </Field>
        <ErrorMessage
          class="text-red-600 text-lg"
          name="CompanyName"
          component="div"></ErrorMessage>
      </div>
      <MainButton
        text="Update"
        type="submit" />
    </Form>
  </MainModal>

  <div
    class="flex xl:overflow-hidden xl:h-screen relative z-20"
    v-motion-fade>
    <DashboardSidebar class="hidden xl:block" />
    <div class="flex flex-col w-full">
      <DashboardNavBar path="Users" />
      <div class="flex flex-col px-4 xl:px-8 mt-32 xl:mt-8 gap-4">
        <MainButton
          @click="isAddModalOpen = true"
          text="Add a new Company">
        </MainButton>

        <!-- Table -->
        <div
          class="overflow-x-auto xl:overflow-y-auto relative shadow-md rounded-xl h-full xl:h-[71vh] bg-background">
          <table class="w-full text-right text-on_background">
            <thead class="text-base text-on_primary bg-primary">
              <tr>
                <th
                  scope="col"
                  class="xl:py-3 xl:px-6 py-2 px-4">
                  #
                </th>
                <th
                  scope="col"
                  class="xl:py-3 xl:px-6 py-2 px-4">
                  Logo
                </th>
                <th
                  scope="col"
                  class="xl:py-3 xl:px-6 py-2 px-4">
                  Company Name
                </th>
                <th
                  scope="col"
                  class="xl:py-3 xl:px-6 py-2 px-4 rounded-tr-xl">
                  Options
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="bg-white border-b odd:bg-gray-200 even:bg-background text-sm"
                v-for="(item, index) in companies"
                :key="item.id">
                <td class="xl:py-3 xl:px-6 py-2 px-4 font-bold text-primary">
                  {{ index + 1 }}
                </td>
                <th
                  scope="row"
                  class="whitespace-nowrap">
                  <img
                    class="h-16 w-16 object-cover rounded-[50px] my-1"
                    :src="item.companyLogo"
                    alt="" />
                </th>
                <td class="xl:py-3 xl:px-6 py-2 px-4 font-bold">
                  {{ item.companyName }}
                </td>

                <td class="xl:py-3 xl:px-6 py-2 px-4">
                  <div class="flex items-center gap-2">
                    <PhTrash
                      class="w-6 h-6 fill-red-500 hover:scale-105 transition-all duration-300 cursor-pointer"
                      @click="deleteCompany(item.id)" />
                    <PhPencil
                      class="w-6 h-6 fill-primary hover:scale-105 transition-all duration-300 cursor-pointer"
                      @click="
                        editCompanyInfo(index), (isEditModalOpen = true)
                      " />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
