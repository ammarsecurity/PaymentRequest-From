<script setup>
/* ----------------------- Imports ---------------------- */
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { axiosInstance } from '@/api/axiosInstance.js';
import { ref, computed } from 'vue';
import i18n from '@/locales/i18n';
/* -------------------- Vee Validate -------------------- */
const { t } = i18n.global;
const validationSchema = ref({
  fullName: yup
    .string()
    .required(t('required'))
    .min(8, t('p_full_name'))
    .max(250, t('w_many')),
  subject: yup
    .string()
    .required(t('required'))
    .min(10, t('w_little'))
    .max(150, t('w_many')),
  from: yup.string().email(t('p_email')).required(t('required')),
  phoneNumber: yup
    .string()
    .required(t('required'))

    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      t('p_phone')
    ),
  content: yup.string().required(t('required')),
});

/* ------------------------ Axios ----------------------- */
const isLoading = ref(false);
const isSuccess = ref(false);
const isError = ref(false);

// Mail
const sendMessage = async (value) => {
  isLoading.value = true;
  axiosInstance
    .post('Mail', value)
    .then(({ data }) => {
      isLoading.value = false;
      isSuccess.value = true;
      setTimeout(() => {
        isSuccess.value = false;
      }, 4000);
    })
    .catch((error) => {
      isError.value = true;
    });
  return;
};

const settings = ref([]);
// Settings
const getSettings = () => {
  isLoading.value = true;
  axiosInstance
    .get(`Settings`)
    .then(({ data }) => {
      settings.value = data.data;
      isLoading.value = false;
    })
    .catch((error) => { });
};
getSettings();

// Language
const lang = computed(() => {
  return i18n.global.locale;
});
</script>
<template>
  <MainLoader v-if="isLoading" />

  <div id="contact" class="w-full flex flex-col p-8 xl:px-48 mt-4 mb-16">
    <!-- Title -->
    <h3 class="text-primary dark:text-primary_dark text-2xl xl:text-4xl font-bold">
      {{ $t('send_us_message') }}
    </h3>

    <!-- Main -->
    <div class="flex flex-col xl:flex-row w-full xl:gap-32 gap-12">
      <Form class="flex flex-col gap-6 mt-8 xl:w-1/2" :validationSchema="validationSchema" @submit="sendMessage">
        <!-- Full Name -->
        <div class="flex flex-col gap-2">
          <label class="text-xl text-primary dark:text-primary_dark">{{
              $t('full_name')
          }}</label>
          <Field
            class="border border-on_background_variant rounded-full px-4 py-3 focus:outline-primary focus:outline-2 transition-all duration-300"
            name="fullName" type="text">
          </Field>
          <ErrorMessage class="text-red-600 text-lg" name="fullName" component="div"></ErrorMessage>
        </div>

        <div class="gap-4">
          <!-- Phone Number -->
          <div class="flex flex-col gap-2 w-full">
            <label class="text-xl text-primary dark:text-primary_dark">{{
                $t('phone_number')
            }}</label>
            <Field
              class="border border-on_background_variant rounded-full px-4 py-3 focus:outline-primary focus:outline-2 transition-all duration-300"
              name="phoneNumber">
            </Field>
            <ErrorMessage class="text-red-600 text-lg" name="phoneNumber" component="div"></ErrorMessage>
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-2 w-full">
            <label class="text-xl text-primary dark:text-primary_dark">{{
                $t('email')
            }}</label>
            <Field
              class="border border-on_background_variant rounded-full px-4 py-3 focus:outline-primary focus:outline-2 transition-all duration-300"
              name="from">
            </Field>
            <ErrorMessage class="text-red-600 text-lg" name="from" component="div"></ErrorMessage>
          </div>
        </div>

        <!-- Subject -->
        <div class="flex flex-col gap-2">
          <label class="text-xl text-primary dark:text-primary_dark">{{
              $t('message_subject')
          }}</label>
          <Field
            class="border border-on_background_variant rounded-full px-4 py-3 focus:outline-primary focus:outline-2 transition-all duration-300"
            name="subject">
          </Field>
          <ErrorMessage class="text-red-600 text-lg" name="subject" component="div"></ErrorMessage>
        </div>

        <!-- Message -->
        <div class="flex flex-col gap-2">
          <label class="text-xl text-primary dark:text-primary_dark">{{
              $t('message')
          }}</label>
          <Field
            class="border border-on_background_variant rounded-2xl px-4 py-3 focus:outline-primary focus:outline-2 transition-all duration-300"
            name="content" as="textarea">
          </Field>
          <ErrorMessage class="text-red-600 text-lg" name="content" component="div"></ErrorMessage>
        </div>

        <MainButton :text="$t('send')" type="submit">
          <PhPaperPlane :class="lang == 'en' ? 'rotate-90' : '-rotate-90'" class="fill-on_primary w-6 h-6" />
        </MainButton>
      </Form>

      <!-- Information -->
      <div class="xl:w-1/2 flex flex-col xl:gap-4 gap-2">
        <h3 class="text-primary dark:text-primary_dark text-2xl xl:text-4xl font-bold">
          {{ $t('contact') }}
        </h3>

        <!-- Location -->
        <div class="flex flex-col gap-4 mt-4">
          <h4 class="text-2xl text-on_background dark:text-on_background_dark">
            {{ $t('our_location') }}
          </h4>
          <div class="flex gap-4 items-center mt-2">
            <PhPhone class="fill-on_primary h-16 w-16 bg-primary dark:bg-primary_dark rounded-full p-4" />
            <div class="flex flex-col gap-2">
              <h5 class="text-lg text-on_background dark:text-on_background_dark">
                {{ $t('baghdad') }}
              </h5>
              <h5 class="text-lg text-on_background dark:text-on_background_dark">
                {{ settings.location }}
              </h5>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="flex flex-col xl:flex-row xl:gap-5">
          <!-- Emails -->
          <div class="flex flex-col gap-4 mt-8">
            <h4 class="text-2xl text-on_background dark:text-on_background_dark">
              {{ $t('email') }}
            </h4>

            <!-- Interior -->
            <div class="flex gap-4 items-center mt-2">
              <PhEnvelopeSimple class="fill-on_primary h-16 w-16 bg-primary dark:bg-primary_dark rounded-full p-4" />
              <div class="flex flex-col gap-2">
                <h5 class="text-lg text-on_background dark:text-on_background_dark">
                  {{ $t('ministry_interior') }}
                </h5>
                <h5 class="text-lg text-primary dark:text-primary_dark">
                  {{ settings.interiorEmail }}
                </h5>
              </div>
            </div>

            <!-- Passports Affairs -->
            <div class="flex gap-4 items-center mt-2">
              <PhEnvelopeSimple class="fill-on_primary h-16 w-16 bg-primary dark:bg-primary_dark rounded-full p-4" />
              <div class="flex flex-col gap-2">
                <h5 class="text-lg text-on_background dark:text-on_background_dark">
                  {{ $t('passport_news') }}
                </h5>
                <h5 class="text-lg text-primary dark:text-primary_dark">
                  {{ settings.passportsAffairsEmail }}
                </h5>
              </div>
            </div>

            <!-- Civil Status -->
            <div class="flex gap-4 items-center mt-2">
              <PhEnvelopeSimple class="fill-on_primary h-16 w-16 bg-primary dark:bg-primary_dark rounded-full p-4" />
              <div class="flex flex-col gap-2">
                <h5 class="text-lg text-on_background dark:text-on_background_dark">
                  {{ $t('local_news') }}
                </h5>
                <h5 class="text-lg text-primary dark:text-primary_dark">
                  {{ settings.civilStatusEmail }}
                </h5>
              </div>
            </div>
          </div>

          <!-- Phone Numbers -->
          <div class="flex flex-col gap-4 mt-8">
            <h4 class="text-2xl text-on_background dark:text-on_background_dark">
              {{ $t('hot_numbers') }}
            </h4>

            <!-- Interior -->
            <div class="flex gap-4 items-center mt-2">
              <PhPhone class="fill-on_primary h-16 w-16 bg-primary dark:bg-primary_dark rounded-full p-4" />
              <div class="flex flex-col gap-2">
                <h5 class="text-lg text-on_background dark:text-on_background_dark">
                  {{ $t('ministry_interior') }}
                </h5>
                <h5 class="text-lg text-primary dark:text-primary_dark">
                  {{ settings.interiorPhone }}
                </h5>
              </div>
            </div>

            <!-- Passports Affairs -->
            <div class="flex gap-4 items-center mt-2">
              <PhPhone class="fill-on_primary h-16 w-16 bg-primary dark:bg-primary_dark rounded-full p-4" />
              <div class="flex flex-col gap-2">
                <h5 class="text-lg text-on_background dark:text-on_background_dark">
                  {{ $t('passport_news') }}
                </h5>
                <h5 class="text-lg text-primary dark:text-primary_dark">
                  {{ settings.passportsAffairsPhone }}
                </h5>
              </div>
            </div>

            <!-- Civil Status -->
            <div class="flex gap-4 items-center mt-2">
              <PhPhone class="fill-on_primary h-16 w-16 bg-primary dark:bg-primary_dark rounded-full p-4" />
              <div class="flex flex-col gap-2">
                <h5 class="text-lg text-on_background dark:text-on_background_dark">
                  {{ $t('local_news') }}
                </h5>
                <h5 class="text-lg text-primary dark:text-primary_dark">
                  {{ settings.civilStatusPhone }}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <StateModal v-if="isSuccess" type="success" title="تم إرسال الرسالة بنجاح" />
  <StateModal v-if="isError" type="error" title="Error في إرسال الرسالة" />
</template>
