<script setup>
import { ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { axiosInstance } from '@/api/axiosInstance.js';

/* -------------------- Vee Validate -------------------- */
const validationSchema = ref({
  username: yup.string().required('This field is required'),
  password: yup.string().required('This field is required'),
});

const email = ref('');
const password = ref('');
const isError = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

const login = () => {
  isLoading.value = true;
  isError.value = false;
  axiosInstance
    .post('Auth/Login', {
      email: email.value,
      password: password.value,
    })
    .then(({ data }) => {
      isLoading.value = false;
      window.localStorage.setItem('token', data.data.token);
      window.localStorage.setItem('role', data.data.role);
      window.localStorage.setItem('fullName', data.data.fullName);
      window.localStorage.setItem('email', data.data.email);
      window.localStorage.setItem('userId', data.data.userId);


      window.location.href = '/dashboard/home';
      // email.value = '';
      // password.value = '';
    })
    .catch((error) => {
      isLoading.value = false;
      isError.value = true;
      errorMessage.value = "Error login information";
    });
};
</script>
<template>
  <MainLoader v-if="isLoading" />
  <div class="relative z-20 flex flex-col items-center min-h-screen">

    <div class="flex flex-col items-center justify-center gap-4 my-32">
      <a class="flex items-center justify-center" href="/">
        <img class="w-[300px]" src="/images/logos/logo.png" alt="" />
      </a>
      <h1 class="text-primary dark:text-primary_dark text-3xl max-w-[50ch] leading-[1.5em] text-center font-bold">
        Login to the payment automation system
      </h1>
      <Form class="flex flex-col item gap-4" dir="rtl" :validationSchema="validationSchema" @submit="login">
        <!-- Username -->
        <div class="flex flex-col gap-2 text-left">
          <label class="text-xl text-primary dark:text-primary_dark">Email</label>
          <Field
            class="text-left border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 w-[30rem]"
            name="username" v-model="email" type="text">
          </Field>
          <ErrorMessage class="text-red-600 text-lg" name="username" component="div"></ErrorMessage>
        </div>

        <!-- Password -->
        <div class="flex flex-col gap-2 text-left">
          <label class="text-xl text-primary dark:text-primary_dark">Password</label>
          <Field
            class="text-left border border-on_background_variant rounded-full px-4 py-2 focus:outline-primary focus:outline-2 transition-all duration-300 w-[30rem]"
            name="password" v-model="password" type="password">
          </Field>
          <ErrorMessage class="text-red-600 text-lg" name="password" component="div"></ErrorMessage>
        </div>
        <p class="text-red-500" v-if="isError">
          {{ errorMessage }}
        </p>

        <MainButton class="mt-2" text="Login" type="submit" />
      </Form>
    </div>
  </div>
</template>
