<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { axiosInstance } from '@/api/axiosInstance.js';
import { ref, isProxy, toRaw } from 'vue';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

/* -------------------- Vee Validate -------------------- */
const validationSchema = ref({
  FullName: yup.string().required('This field is required'),
  Password: yup.string().required('This field is required'),
  PhoneNumber: yup.string().required('This field is required'),
});
const validationSchemaEdit = ref({
  FullName: yup.string().required('This field is required'),
  PhoneNumber: yup.string().required('This field is required'),
});
/* ------------------------ Axios ----------------------- */

const isError = ref(false);
const isLoading = ref(false);

// POST

const submit = async (value) => {
  isLoading.value = true;
  isError.value = false;
  const formData = new FormData();
  formData.append('Photo', createUserForm.value.Photo);
  formData.append('FullName', createUserForm.value.FullName);
  formData.append('UserRole', createUserForm.value.UserRole);
  formData.append('Email', createUserForm.value.Email);
  formData.append('PhoneNumber', createUserForm.value.PhoneNumber);
  formData.append('Password', createUserForm.value.Password);
  formData.append('CompanyId', createUserForm.value.CompanyId);

  axiosInstance
    .post('Main/AddUser', formData)
    .then(({ data }) => {
      isLoading.value = false;
      isAddModalOpen.value = false;
      Swal.fire({
        title: 'The account has been Added successfully',
        icon: 'success',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Close',
      }),
        (createUserForm.value = {
          FullName: '',
          UserRole: '',
          Email: '',
          Password: '',
          CompanyName: '',
          Photo: '',
          PhoneNumber: '',
          CompanyId: '',
        });
      getUsers();
    })
    .catch((error) => {
      isLoading.value = true;
      console.log(error);
    });

  return;
};

const createUserForm = ref({
  FullName: '',
  UserRole: '',
  Email: '',
  Password: '',
  CompanyName: '',
  Photo: '',
  PhoneNumber: '',
  CompanyId: '',
});

const editUser = ref({
  id: '',
  FullName: '',
  UserRole: '',
  Email: '',
  Password: '',
  CompanyName: '',
  Photo: '',
  PhoneNumber: '',
  CompanyId: '',
});

const editSubmit = async (value) => {
  isLoading.value = true;
  isError.value = false;

  const formData = new FormData();
  formData.append('Photo', editUser.value.Photo);
  formData.append('FullName', editUser.value.FullName);
  formData.append('UserRole', editUser.value.UserRole);
  formData.append('Email', editUser.value.Email);
  formData.append('PhoneNumber', editUser.value.PhoneNumber);
  formData.append('CompanyId', editUser.value.CompanyId);
  formData.append('Password', editUser.value.Password);
  axiosInstance
    .post('Main/EditUser?id=' + editUser.value.id, formData)
    .then(({ data }) => {
      isLoading.value = false;
      isEditModalOpen.value = false;
      Swal.fire({
        title: 'The account has been updated successfully',
        icon: 'success',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Close',
      }),
        getUsers();
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
const paginationIndex = ref(0);
const userListCompaies = ref({});
const userid = ref('');
const users = ref([]);
const companies = ref([]);
const totalRecords = ref('');
const pageSize = ref(10);
const pageNumber = ref(1);
const companyName = ref('');
const userFullName = ref('');

const getUsers = () => {
  isLoading.value = true;
  axiosInstance
    .get(
      `Main/GetUser?PageNumber=${pageNumber.value}&PageSize=${pageSize.value}&companyName=${companyName.value}&userFullName=${userFullName.value}`
    )
    .then(({ data }) => {
      users.value = data.data;
      pageNumber.value = data.pageNumber;
      pageSize.value = data.pageSize;
      totalRecords.value = data.totalRecords;
      isLoading.value = false;
    })
    .catch((error) => { });
};
getUsers();

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

const getUserid = (index) => {
  const info = users.value[index];
  userListCompaies.value = info.companies;
  userid.value = info.id;
}
const addCompany = (event) => {
  const companyinfo = event.target.value;
  const companyid = companyinfo.split('_')[0];
  const companyName = companyinfo.split('_')[1];
  userListCompaies.value = ({
    companyId: companyid,
    companyName: companyName,
    uesrId: userid,
  });

  console.log(userListCompaies.value);

}

const addCompanies = () => {
  axiosInstance
    .post('Main/AddCompaniesToUser', userListCompaies.value)
    .then(({ data }) => {
      isLoading.value = false;
      isCompanyAddModalOpen.value = false;
      Swal.fire({
        title: 'The user has been updated successfully',
        icon: 'success',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Close',
      }),
        getUsers();
    })
    .catch((err) => {
      isLoading.value = false;
      Swal.fire({
        title: 'Error',
        text: 'This company has been already exists',
        icon: 'error',
        showCancelButton: true,
        cancelButtonColor: '#213263',
        cancelButtonText: 'Close',
      });
    });
  return;
};

const nextPage = () => {
  pageNumber.value++, (paginationIndex.value += 10), getUsers();
};
const previousPage = () => {
  pageNumber.value--, (paginationIndex.value -= 10), getUsers();
};

const editUserInfo = (index) => {
  const info = users.value[index];
  editUser.value.FullName = info.fullName;
  editUser.value.UserRole = info.userRole;
  editUser.value.Email = info.email;
  editUser.value.PhoneNumber = info.phoneNumber;
  editUser.value.Password = info.password;
  editUser.value.CompanyName = info.companyName;
  editUser.value.CompanyId = info.companyId;
  editUser.value.id = info.id;
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

  isUser = false;
} else if (role == 'CFO') {
  showAddOrder = false;
  isUser = false;
}

const deleteUser = async (value) => {
  Swal.fire({
    title: 'Are you sure to delete the account?',
    text: 'After deletion, the account cannot be recovered',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#213263',
    confirmButtonText: 'yas، Deleted',
    cancelButtonText: 'Close',
  }).then((result) => {
    if (result.isConfirmed) {
      isLoading.value = true;
      isError.value = false;
      axiosInstance
        .post('Main/DeleteUser?id=' + value)
        .then(({ data }) => {
          Swal.fire({
            title: 'The account has been deleted successfully',
            icon: 'success',
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonColor: '#d33',
            cancelButtonText: 'Close',
          }),
            (isLoading.value = false);
          getUsers();
        })
        .catch((error) => { });
    }
  });
  return;
};

/* ------------------------ Index ----------------------- */
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isCompanyAddModalOpen = ref(false);
</script>
<template>
  <!-- Post -->

  <!-- Edit -->
  <MainLoader v-if="isLoading" />

  <!-- Modals -->
  <MainModal text="Add company to user" v-if="isCompanyAddModalOpen" @close="isCompanyAddModalOpen = false">
    <div class="flex flex-col gap-2">
      <label class="text-xl text-primary">Company</label>
      <Field
        class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
        name="companies" type="select" as="select" @change="addCompany($event)">
        <option v-for="item in companies" :value="item.id + '_' + item.companyName">
          {{ item.companyName }}
        </option>
      </Field>
    </div>
    <div class="my-5 flex">
      <span v-for="items in userListCompaies"
        class="flex items-center gap-2 text-center xl:text-start bg-primary_container text-background max-w-max rounded-2xl px-2 py-2 m-1">
        {{ items.companyName }}
        <PhTrash class="fill-on_primary" />
      </span>
    </div>

    <MainButton text="Add" @click="addCompanies()" />
  </MainModal>

  <!-- Add Modal -->
  <MainModal text="Add a new account" v-if="isAddModalOpen" @close="isAddModalOpen = false">
    <Form class="flex flex-col gap-4" :validationSchema="validationSchema" @submit="submit">
      <!-- Photo -->
      <!-- <div class="flex flex-col gap-2" v-if="isUser == false">
        <label class="text-xl text-primary">Picture or logo</label>
        <Field
          class="border border-on_background_variant rounded-2xl px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="photo" v-model="createUserForm.Photo" @change="uploadPhoto('add')" type="file">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="Photo" component="div"></ErrorMessage>
      </div> -->

      <!-- Title -->
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Full Name</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="FullName" v-model="createUserForm.FullName" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="FullName" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Email</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="Email" v-model="createUserForm.Email" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="Email" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Phone Number</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="PhoneNumber" v-model="createUserForm.PhoneNumber" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="PhoneNumber" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Password</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="Password" v-model="createUserForm.Password" type="password">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="Password" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2" v-if="isUser == false">
        <label class="text-xl text-primary">Title</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="UserRole" v-model="createUserForm.UserRole" type="select" as="select">
          <option value="6">HOD</option>
          <option value="5">HOP</option>
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="UserRole" component="div"></ErrorMessage>
      </div>
      <div class="flex flex-col gap-2" v-if="isUser == true">
        <label class="text-xl text-primary">Company</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="companies" v-model="createUserForm.CompanyId" type="select" as="select">
          <option v-for="item in companies" :value="item.id">
            {{ item.companyName }}
          </option>
        </Field>
      </div>

      <MainButton text="Add" type="submit" />
    </Form>
  </MainModal>

  <!-- Edit Modal -->
  <MainModal text="UpdateUser" v-if="isEditModalOpen" @close="isEditModalOpen = false">
    <Form class="flex flex-col gap-4" :validationSchema="validationSchemaEdit" @submit="editSubmit">
      <!-- Photo -->
      <!-- <div class="flex flex-col gap-2" v-if="isUser == false">
        <label class="text-xl text-primary">Picture or logo</label>
        <Field
          class="border border-on_background_variant rounded-2xl px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="photo" v-model="editUser.Photo" @change="uploadPhoto('add')" type="file">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="Photo" component="div"></ErrorMessage>
      </div> -->

      <!-- Title -->
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Full Name</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="FullName" v-model="editUser.FullName" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="FullName" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Email</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="Email" v-model="editUser.Email" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="Email" component="div"></ErrorMessage>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Phone Number</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="PhoneNumber" v-model="editUser.PhoneNumber" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="PhoneNumber" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">Password</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="Password" v-model="editUser.Password" type="password">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="Password" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2" v-if="isUser == false">
        <label class="text-xl text-primary">Title</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="UserRole" v-model="editUser.UserRole" type="select" as="select">
          <option value="6">HOD</option>
          <option value="5">HOP</option>
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="UserRole" component="div"></ErrorMessage>
      </div>
      <div class="flex flex-col gap-2" v-if="isUser == true">
        <label class="text-xl text-primary">Company</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="companies" v-model="editUser.CompanyId" type="select" as="select">
          <option value="" selected>Select</option>
          <option v-for="item in companies" :value="item.id">
            {{ item.companyName }}
          </option>
        </Field>
      </div>

      <MainButton text="Update" type="submit" />
    </Form>
  </MainModal>

  <div class="flex xl:overflow-hidden xl:h-screen relative z-20" v-motion-fade>
    <DashboardSidebar class="hidden xl:block" />
    <div class="flex flex-col w-full">
      <DashboardNavBar path="Users" />
      <div class="flex flex-col px-4 xl:px-8 mt-32 xl:mt-8 gap-4">
        <MainButton @click="isAddModalOpen = true" text="Add a new account">
        </MainButton>

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
                  Email
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  Phone Number
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4" v-if="isUser == true">
                  Company
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4" v-if="isUser == false">
                  Companies
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  Title
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
              <tr class="bg-white border-b odd:bg-gray-200 even:bg-background text-sm" v-for="(item, index) in users"
                :key="item.id">
                <td class="xl:py-3 xl:px-6 py-2 px-4 font-bold text-primary">
                  {{ index + 1 + paginationIndex }}
                </td>
                <!-- <th scope="row" class="whitespace-nowrap">
                  <img class="h-16 w-16 object-cover rounded-[50px] my-1" :src="item.photo" alt="" />
                </th> -->
                <td class="xl:py-3 xl:px-6 py-2 px-4 font-bold">
                  {{ item.fullName }}
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]">
                  {{ item.email }}
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]">
                  {{ item.phoneNumber }}
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 flex justify-center align-middle h-[70px] items-center">
                  <h1 v-if="isUser == true"
                    class="text-center xl:text-start bg-primary_container text-background max-w-max rounded-2xl px-2 py-2">
                    {{ item.companyName }}
                  </h1>
                  <h1 v-else>
                    <PhBuildings class="w-6 h-6 fill-primary hover:scale-105 transition-all duration-300 cursor-pointer"
                      @click="
                        getUserid(index), (isCompanyAddModalOpen = true)
                      " />
                  </h1>
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.userRole == 1">
                  Accountant
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.userRole == 2">
                  Company
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.userRole == 4">
                  CFO
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.userRole == 3">
                  Subuser
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.userRole == 6">
                  HOD
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="item.userRole == 5">
                  HOP
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4">
                  {{ dayjs(item.created).format('ddd, DD MMM YYYY') }}
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4">
                  <div class="flex items-center gap-2">
                    <PhTrash class="w-6 h-6 fill-red-500 hover:scale-105 transition-all duration-300 cursor-pointer"
                      @click="deleteUser(item.id)" />
                    <PhPencil class="w-6 h-6 fill-primary hover:scale-105 transition-all duration-300 cursor-pointer"
                      @click="editUserInfo(index), (isEditModalOpen = true)" />

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
