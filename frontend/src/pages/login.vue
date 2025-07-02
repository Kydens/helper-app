<template>
  <div class="login-container">
    <form class="login-box" @submit.prevent="handleLogin">
      <h2 class="text-2xl font-bold">Masuk</h2>

      <label for="account" class="font-bold">Akun</label>
      <input
        type="text"
        id="account"
        v-model="account"
        placeholder="Username atau Email"
        required
      />

      <label for="password" class="font-bold">Kata Sandi</label>
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="Kata Sandi"
        required
      />

      <button type="submit">Masuk</button>

      <p class="signup-text">
        Belum punya akun?
        <NuxtLink to="/signup">Daftar sekarang</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { login } = useAuth();
const { $swal } = useNuxtApp();

const account = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    await login(account.value, password.value);
    await $swal.fire({
      icon: 'success',
      title: 'Login Berhasil!',
      showConfirmButton: false,
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

<style scoped>
.login-container {
  background: #fdfaf6;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  background: #ffffff;
  border: 2px solid #a3b18a;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-box h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #3a3a3a;
}

.login-box label {
  display: block;
  margin-bottom: 0.5rem;
  color: #3a3a3a;
  font-size: 14px;
}

.login-box input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #a3b18a;
  border-radius: 6px;
  font-size: 14px;
}

.login-box input:focus {
  outline: none;
  border-color: #b0c5af;
  box-shadow: 0 0 0 2px rgba(88, 129, 87, 0.2);
}

.login-box button {
  background-color: #588157;
  color: white;
  width: 100%;
  padding: 0.6rem;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.login-box button:hover {
  background-color: #3a5a40;
}

.signup-text {
  margin-top: 1rem;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.signup-text a {
  color: #588157;
  font-weight: bold;
  text-decoration: none;
}

.signup-text a:hover {
  text-decoration: underline;
}
</style>
