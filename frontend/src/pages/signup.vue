<template>
  <div class="min-h-screen flex items-center justify-center bg-muted">
    <Card class="w-full max-w-md p-6">
      <form @submit.prevent="handleSignup">
        <CardHeader class="mb-3">
          <CardTitle class="text-2xl font-bold">Signup</CardTitle>
        </CardHeader>

        <CardContent class="grid gap-4 mb-7">
          <div class="grid gap-1">
            <label for="username" class="font-bold">Username</label>
            <Input
              type="text"
              id="username"
              v-model="username"
              placeholder="Masukkan username anda"
              required
            />
          </div>
          <div class="grid gap-1">
            <label for="email" class="font-bold">Email</label>
            <Input
              type="text"
              id="email"
              v-model="email"
              placeholder="Masukkan email anda"
              required
            />
          </div>
          <div class="grid gap-1">
            <label for="password" class="font-bold">Kata Sandi</label>
            <Input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              id="password"
              placeholder="Masukan kata sandi anda"
              required
            />
          </div>
          <div class="grid gap-1">
            <label for="confirmPassword" class="font-bold">
              Konfirmasi Kata Sandi
            </label>
            <Input
              :type="showPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              id="confirmPassword"
              placeholder="Konfirmasi kata sandi anda"
              required
            />
            <span
              v-if="isPasswordMismatch"
              class="text-red-500 text-sm mt-1 flex items-center gap-1"
            >
              <Icon name="material-symbols:info-outline" />
              Kata sandi tidak cocok
            </span>
          </div>
          <div class="grip gap-1">
            <div class="items-top flex gap-x-2">
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
            Sudan punya akun?
            <NuxtLink
              to="/login"
              class="text-blue-500 transition duration-500 ease-in-out hover:underline hover:duration-500 hover:ease-in-out"
            >
              Login sekarang
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
const { signup } = useAuth();
const { $swal } = useNuxtApp();

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);

const isPasswordMismatch = computed(() => {
  return (
    confirmPassword.value !== '' && password.value !== confirmPassword.value
  );
});

const handleSignup = async () => {
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

    await signup(username.value, email.value, password.value);
    console.log({
      username: username.value,
      email: email.value,
      password: password.value,
    });

    await $swal.fire({
      icon: 'success',
      title: 'Signup Berhasil!',
      showConfirmButton: false,
      allowOusideCLick: false,
      timer: 1500,
    });

    return router.push('/login');
  } catch (e) {
    await $swal.fire({
      icon: 'error',
      title: 'Terjadi Kesalahan!',
      text: e?.data?.errors || e.errors || 'Tidak dapat signup.',
    });
  }
};
</script>

<style scoped></style>
