<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <form
      @submit.prevent="handleLogin"
      class="bg-white p-6 rounded shadow-md w-full max-w-sm"
    >
      <h2 class="text-xl font-bold mb-4 text-center">Login</h2>

      <input
        v-model="account"
        type="account"
        placeholder="Account"
        class="w-full p-2 border rounded mb-3"
        required
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full p-2 border rounded mb-4"
        required
      />

      <button
        type="submit"
        class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        :disabled="loading"
      >
        {{ loading ? 'Loading...' : 'Login' }}
      </button>

      <p v-if="error" class="mt-3 text-red-500 text-sm text-center">
        {{ error }}
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';

const account = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const { login } = useAuth();

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    const loginUser = await login(account.value, password.value);
    if (!loginUser?.success) {
      error.value = loginUser?.message || 'Login gagal';
    }
  } catch (e) {
    error.value = e?.data?.message || 'Terjadi kesalahan saat login';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
input:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 1px #3182ce;
}
</style>
