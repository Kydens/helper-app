import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<String | null>(null);

  const user = ref<{
    userId: String;
    username: String;
    role_alias: String;
  } | null>(null);

  const setAccessToken = (token: String) => {
    accessToken.value = token;
  };

  const setUser = (userId: String, username: String, role_alias: String) => {
    user.value = {
      userId: userId,
      username: username,
      role_alias: role_alias,
    };
  };

  const logout = () => {
    accessToken.value = null;
    user.value = null;
  };

  const isAuth = computed(() => !!accessToken.value);

  return {
    accessToken,
    user,
    setAccessToken,
    setUser,
    logout,
    isAuth,
  };
});
