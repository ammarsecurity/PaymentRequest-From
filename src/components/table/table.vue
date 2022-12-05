<script>
</script>

<template>
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
              <tr class="bg-white border-b odd:bg-gray-100 even:bg-background text-sm" v-for="(item, index) in users"
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
               
                <td class="xl:py-3 xl:px-6 py-2 px-4">
                  <h1
                    class="text-center xl:text-start bg-primary_container text-on_background max-w-max rounded-2xl px-2 py-2">
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
    </template>