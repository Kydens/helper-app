<template>
  <div class="min-h-screen flex items-center justify-center bg-muted">
    <Card class="w-full max-w-md p-6">
      <form @submit.prevent="handleLogin">
        <CardHeader class="mb-3">
          <CardTitle class="text-2xl font-bold">Masuk</CardTitle>
        </CardHeader>

        <CardContent class="grid gap-4 mb-7">
          <div class="grid gap-1">
            <label for="account" class="font-bold">Akun</label>
            <Input
              type="text"
              id="account"
              v-model="account"
              placeholder="Username atau Email"
              required
            />
          </div>
          <div class="grid gap-1">
            <label for="password" class="font-bold">Kata Sandi</label>
            <Input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              id="password"
              placeholder="Kata Sandi"
              required
            />
            <div class="items-top flex gap-x-2 mt-3">
              <Checkbox
                id="showPassword"
                v-model="showPassword"
                class="transition-all hover:cursor-pointer"
              />
              <div class="grid gap-1.5 leading-none">
                <label
                  for="showPassword"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Lihat Password
                </label>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter class="flex flex-col gap-3 mt-5 mb-4">
          <Button
            type="submit"
            class="w-full transition-all hover:cursor-pointer"
          >
            Masuk
          </Button>

          <p class="text-center text-sm text-muted-foreground">
            Belum punya akun?
            <NuxtLink
              to="/signup"
              class="text-blue-500 transition duration-500 ease-in-out hover:underline hover:duration-500 hover:ease-in-out"
            >
              Daftar sekarang
            </NuxtLink>
          </p>
        </CardFooter>
      </form>

      <p class="w-full text-center text-sm text-muted-foreground pt-3 border-t">
        © 2025 Eddy Nathansyah. All rights reserved.
      </p>
    </Card>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth',
});

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

// component shadcn
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

const router = useRouter();
const { login } = useAuth();
const { $swal } = useNuxtApp();

const account = ref('');
const password = ref('');
const showPassword = ref(false);

console.log(showPassword);

const handleLogin = async () => {
  try {
    await $swal.fire({
      icon: 'loading',
      title: 'Tunggu Sebentar',
      showConfirmButton: false,
      allowOusideCLick: false,
      timer: 1000,
      didOpen: () => {
        $swal.showLoading();
      },
    });

    await login(account.value, password.value);

    await $swal.fire({
      icon: 'success',
      title: 'Login Berhasil!',
      showConfirmButton: false,
      allowOusideCLick: false,
      timer: 1500,
    });

    return router.push('/');
  } catch (e) {
    await $swal.fire({
      icon: 'error',
      title: 'Terjadi Kesalahan!',
      text: e?.data?.message || e.message || 'Tidak dapat login.',
    });
  }
};
</script>

<style scoped></style>
