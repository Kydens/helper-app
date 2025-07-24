<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Pesan dari API:</h1>
    <p class="mt-2 text-gray-700">{{ apiMessage }}</p>
    <button
      type="submit"
      class="mt-2 w-fit bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      @click="handleLogout"
    >
      Logout
    </button>
  </div>
</template>

<script setup>
import { useRuntimeConfig } from '#app';
import { ref, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';

const { $swal } = useNuxtApp();
const { logout } = useAuth();

const handleLogout = async () => {
  try {
    await $swal
      .fire({
        title: 'Anda ingin logout?',
        text: 'Anda akan keluar dari akun ini.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Logout',
      })
      .then((result) => {
        if (result.isConfirmed) {
          $swal.fire({
            title: 'Logout',
            text: 'Anda berhasil logout!',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            allowOusideCLick: false,
          });

          logout();
          return navigateTo('/login');
        }
      });
  } catch (e) {
    await $swal.fire({
      icon: 'error',
      title: 'Terjadi Kesalahan!',
      text: e?.data?.message || e.message || 'Tidak dapat login.',
    });
  }
};

const config = useRuntimeConfig();
const apiMessage = ref('Memuat...');

onMounted(async () => {
  try {
    const data = await $fetch(`${config.public.apiBase}`);
    apiMessage.value = data.message;
  } catch (err) {
    apiMessage.value = 'Gagal mengambil data dari API.';
  }
});
</script>

<style scoped></style>
