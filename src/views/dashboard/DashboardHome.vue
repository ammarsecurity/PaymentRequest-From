<script setup>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { axiosInstance } from '@/api/axiosInstance.js';
import { ref } from 'vue';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

/* -------------------- Vee Validate -------------------- */
const validationSchema = ref({
  FullName: yup.string().required('هذا الحقل مطلوب'),
  Password: yup.string().required('هذا الحقل مطلوب'),

});
const validationSchemaEdit = ref({
  FullName: yup.string().required('هذا الحقل مطلوب'),
});
/* ------------------------ Axios ----------------------- */

const isError = ref(false);
const isLoading = ref(false);
const isAddSuccess = ref(false);
const isEditSuccess = ref(false);

// POST




const submit = async (value) => {
  isLoading.value = true;
  isError.value = false;

  const formData = new FormData();
  formData.append('CompanyLogo', createUserForm.value.CompanyLogo);
  formData.append('FullName', createUserForm.value.Email);
  formData.append('UserRole', createUserForm.value.UserRole);
  formData.append('Email', createUserForm.value.Email);
  formData.append('CompanyName', createUserForm.value.CompanyName);
  formData.append('Password', createUserForm.value.Password);
  axiosInstance
    .post('Main/AddUser', formData)
    .then(({ data }) => {

      isLoading.value = false;
      isAddModalOpen.value = false;
      isAddSuccess.value = true;
      setTimeout(() => {
        isAddSuccess.value = false;
      }, 4000);
      createUserForm.value = {
        FullName: '',
        UserRole: '',
        Email: '',
        Password: '',
        CompanyName: '',
        CompanyLogo: ''
      };
      getUsers();
    })
    .catch((error) => {

      console.log(error)
    });

  return;
};

const createUserForm = ref({
  FullName: '',
  UserRole: '',
  Email: '',
  Password: '',
  CompanyName: '',
  CompanyLogo: ''
});

const editUser = ref({
  id: '',
  FullName: '',
  UserRole: '',
  Email: '',
  Password: '',
  CompanyName: '',
  CompanyLogo: ''
});

const editSubmit = async (value) => {
  isLoading.value = true;
  isError.value = false;

  const formData = new FormData();
  formData.append('CompanyLogo', editUser.value.CompanyLogo);
  formData.append('FullName', editUser.value.Email);
  formData.append('UserRole', editUser.value.UserRole);
  formData.append('Email', editUser.value.Email);
  formData.append('CompanyName', editUser.value.CompanyName);
  formData.append('Password', editUser.value.Password);
  axiosInstance
    .post('Main/EditUser?id=' + editUser.value.id, formData)
    .then(({ data }) => {

      isLoading.value = false;
      isEditModalOpen.value = false;
      isEditSuccess.value = true;
      setTimeout(() => {
        isEditSuccess.value = false;
      }, 4000);

      getUsers();
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
const users = ref([]);
const totalRecords = ref('');
const pageSize = ref(10);
const pageNumber = ref(1);
const companyName = ref('');
const userFullName = ref('');
const getUsers = () => {
  isLoading.value = true;
  axiosInstance.get(`Main/GetUser?PageNumber=${pageNumber.value}&PageSize=${pageSize.value}&companyName=${companyName.value}&userFullName=${userFullName.value}`)
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
  editUser.value.Password = info.password;
  editUser.value.CompanyName = info.companyName;
  editUser.value.id = info.id
};

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

  isUser = false;

} else if (role == 'CFO') {
  showAddOrder = false;
  isUser = false;
}


const deleteUser = async (value) => {
  Swal.fire({
    title: 'هل انت متأكد من مسح الحساب',
    text: 'بعد المسح ﻻ يمكن استرجاع الحساب',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#213263',
    confirmButtonText: 'نعم، امسح',
    cancelButtonText: 'الغاء',
  }).then((result) => {
    if (result.isConfirmed) {
      isLoading.value = true;
      isError.value = false;
      axiosInstance
        .post('Main/DeleteUser?id=' + value)
        .then(({ data }) => {
          Swal.fire({
            title: 'تم مسح الحساب بنجاح',
            icon: 'success',
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonColor: '#d33',
            cancelButtonText: 'اغلاق',
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
</script>
<template>
  <!-- Post -->
  <StateModal v-if="isAddSuccess" type="success" @close="isAddSuccess = false" title="تم اضافة الحساب  بنجاح" />
  <!-- Edit -->
  <StateModal v-if="isEditSuccess" @close="isEditSuccess = false" title="تم تعديل الحساب بنجاح" />
  <MainLoader v-if="isLoading" />

  <!-- Modals -->
  <!-- Add Modal -->
  <MainModal text="اضافة حساب جديد" v-if="isAddModalOpen" @close="isAddModalOpen = false">
    <Form class="flex flex-col gap-4" dir="rtl" :validationSchema="validationSchema" @submit="submit">
      <!-- Photo -->
      <div class="flex flex-col gap-2" v-if="(isUser == false)">
        <label class="text-xl text-primary">الصورة او الشعار</label>
        <Field
          class="border border-on_background_variant rounded-2xl px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="photo" v-model="createUserForm.CompanyLogo" @change="uploadPhoto('add')" type="file">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="CompanyLogo" component="div"></ErrorMessage>
      </div>

      <!-- Title -->
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">الاسم الكامل</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="FullName" v-model="createUserForm.FullName" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="FullName" component="div"></ErrorMessage>
      </div>


      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">البريد الالكتروني</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="Email" v-model="createUserForm.Email" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="Email" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">الرمز السري</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="Password" v-model="createUserForm.Password" type="password">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="Password" component="div"></ErrorMessage>
      </div>


      <div class="flex flex-col gap-2" v-if="(isUser == false)">
        <label class="text-xl text-primary">الفئة</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="category" v-model="createUserForm.UserRole" type="select" as="select">
          <option value="1">محاسب</option>
          <option value="4">CFO</option>
          <option value="2">شركة</option>

        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="UserRole" component="div"></ErrorMessage>
      </div>
      <div class="flex flex-col gap-2" v-if="(isUser == false)">
        <label class="text-xl text-primary">اسم الشركة</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="CompanyName" v-model="createUserForm.CompanyName" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="CompanyName" component="div"></ErrorMessage>
      </div>

      <MainButton text="اضافة" type="submit" />
    </Form>
  </MainModal>

  <!-- Edit Modal -->
  <MainModal text="تعديل الحساب" v-if="isEditModalOpen" @close="isEditModalOpen = false">

    <Form class="flex flex-col gap-4" dir="rtl" :validationSchema="validationSchemaEdit" @submit="editSubmit">
      <!-- Photo -->
      <div class="flex flex-col gap-2" v-if="(isUser == false)">
        <label class="text-xl text-primary">الصورة او الشعار</label>
        <Field
          class="border border-on_background_variant rounded-2xl px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="photo" v-model="editUser.CompanyLogo" @change="uploadPhoto('add')" type="file">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="CompanyLogo" component="div"></ErrorMessage>
      </div>

      <!-- Title -->
      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">الاسم الكامل</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="FullName" v-model="editUser.FullName" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="FullName" component="div"></ErrorMessage>
      </div>


      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">البريد الالكتروني</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="Email" v-model="editUser.Email" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="Email" component="div"></ErrorMessage>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xl text-primary">الرمز السري</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="Password" v-model="editUser.Password" type="password">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="Password" component="div"></ErrorMessage>
      </div>


      <div class="flex flex-col gap-2" v-if="(isUser == false)">
        <label class="text-xl text-primary">الفئة</label>
        <Field
          class="border border-on_background_variant bg-background rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="category" v-model="editUser.UserRole" type="select" as="select">
          <option value="1">محاسب</option>
          <option value="4">CFO</option>
          <option value="2">شركة</option>

        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="UserRole" component="div"></ErrorMessage>
      </div>
      <div class="flex flex-col gap-2" v-if="(isUser == false)">
        <label class="text-xl text-primary">اسم الشركة</label>
        <Field
          class="border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 xl:w-[30rem]"
          name="CompanyName" v-model="editUser.CompanyName" type="text">
        </Field>
        <ErrorMessage class="text-red-600 text-lg" name="CompanyName" component="div"></ErrorMessage>
      </div>

      <MainButton text="تعديل" type="submit" />
    </Form>

  </MainModal>

  <div class="flex xl:overflow-hidden xl:h-screen relative z-20" v-motion-fade>
    <DashboardSidebar class="hidden xl:block" />
    <div class="flex flex-col w-full">
      <DashboardNavBar path="الحسابات" />
      <div class="flex flex-col px-4 xl:px-8 mt-32 xl:mt-8 gap-4">
        <MainButton @click="isAddModalOpen = true" text="اضافة حساب جديد">
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
                  البريد الالكتروني
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  اسم الشركة
                </th>
                <th scope="col" class="xl:py-3 xl:px-6 py-2 px-4">
                  الفئة
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
              <tr class="bg-white border-b odd:bg-gray-200 even:bg-background text-sm" v-for="(item, index) in users"
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
                  {{ item.email }}
                </td>

                <td class="xl:py-3 xl:px-6 py-2 px-4  flex justify-center align-middle h-[70px] items-center">
                  <h1
                    class="text-center xl:text-start bg-primary_container text-background max-w-max rounded-2xl px-2 py-2">
                    {{ item.companyName }}
                  </h1>
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="(item.userRole == 1)">
                  محاسب
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="(item.userRole == 2)">
                  شركة
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="(item.userRole == 4)">
                  CFO
                </td>
                <td class="xl:py-3 xl:px-6 py-2 px-4 max-w-[50ch]" v-if="(item.userRole == 3)">
                  حساب فرعي
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
            <span class="text-on_background">من</span>
            <span class="font-bold text-sm text-background">{{
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
