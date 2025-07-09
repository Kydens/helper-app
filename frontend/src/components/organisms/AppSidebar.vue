<template>
  <Sidebar class="bg-sidebar text-sidebar-foreground border-r min-h-screen">
    <SidebarContent class="flex flex-col h-full">
      <SidebarGroup class="flex flex-col h-full">
        <SidebarHeader class="px-4 py-4">
          <h1 class="text-xl font-bold tracking-wide">Helper App</h1>
        </SidebarHeader>
        <SidebarGroupContent class="flex-1 overflow-auto">
          <SidebarMenu class="flex flex-col gap-1">
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <NuxtLink
                :to="item.url"
                :class="[
                  'flex items-center gap-2 px-3 py-4 rounded-md text-sm font-medium',
                  route.path === item.url
                    ? 'bg-sidebar-accent-foreground text-sidebar-accent'
                    : 'hover:bg-muted hover:text-foreground',
                ]"
              >
                <Icon :name="item.icon" class="w-5 h-5" />
                <span>{{ item.title }}</span>
              </NuxtLink>
            </SidebarMenuItem>

            <!-- admin -->
            <template v-if="role === 'ADMIN'">
              <SidebarMenuItem>
                <div class="w-full">
                  <SidebarMenuButton
                    @click="toggleMasterOpen"
                    class="w-full flex items-center justify-between px-3 py-6 rounded-md text-sm font-medium hover:bg-muted hover:text-foreground hover:cursor-pointer"
                  >
                    <div class="flex justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <Icon
                          name="material-symbols:database"
                          class="w-5 h-5"
                        />
                        <span>Master Data</span>
                      </div>
                      <Icon
                        :key="masterOpen"
                        :name="
                          masterOpen
                            ? 'material-symbols:arrow-drop-down-rounded'
                            : 'material-symbols:arrow-drop-up-rounded'
                        "
                        class="w-6 h-6"
                      />
                    </div>
                  </SidebarMenuButton>
                  <Transition name="fade-slide">
                    <div v-if="masterOpen" class="flex flex-col gap-1">
                      <NuxtLink
                        v-for="item in adminItems"
                        :key="item.title"
                        :to="item.url"
                        class="flex items-center gap-2 pl-6 pr-2 py-4 text-sm font-medium rounded-md"
                        :class="[
                          route.path === item.url
                            ? 'bg-sidebar-accent-foreground text-sidebar-accent'
                            : 'hover:bg-muted hover:text-foreground',
                        ]"
                      >
                        <Icon :name="item.icon" class="w-4 h-4" />
                        <span>{{ item.title }}</span>
                      </NuxtLink>
                    </div>
                  </Transition>
                </div>
              </SidebarMenuItem>
            </template>
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarFooter class="py-6 px-4 flex flex-col gap-6">
          <SidebarMenuItem>
            <Button
              type="submit"
              class="mt-2 w-full transition-all duration-300 bg-blue-500 text-white hover:bg-destructive hover:cursor-pointer"
              @click="handleLogout"
            >
              Logout
            </Button>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Badge
              variant="outline"
              class="w-full px-6 py-3 flex justify-between transition-all duration-300 hover:bg-secondary"
            >
              <NuxtLink :to="`/user/${userId}`" class="block">
                <div class="flex gap-2 items-center">
                  <Avatar>
                    <AvatarImage
                      src="https://ui-avatars.com/api/?name=admin"
                      alt="avatar-user"
                    />
                  </Avatar>
                  <span>{{ username }}</span>
                </div>
              </NuxtLink>
              <NuxtLink :to="`/user/settings/${userId}`" class="block">
                <div class="flex items-center pl-4 border-l-2">
                  <Icon name="material-symbols:settings" class="w-5 h-5" />
                </div>
              </NuxtLink>
            </Badge>
          </SidebarMenuItem>
        </SidebarFooter>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>

<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useUser } from '@/composables/useUser';
import { useRole } from '@/composables/useRole';
import { Home, ListTodo } from 'lucide-vue-next';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

const masterOpen = ref(false);

const route = useRoute();
const { $swal } = useNuxtApp();
const { userId, username } = useUser();
const { role } = useRole();
const { logout } = useAuth();

const toggleMasterOpen = () => {
  masterOpen.value = !masterOpen.value;
};

onMounted(() => {
  if (route.path.startsWith('/masterData')) {
    masterOpen.value = true;
  }
});

const items = [
  {
    title: 'Dashboard',
    url: '/',
    icon: 'material-symbols:home',
  },
  {
    title: 'Todolist',
    url: '/todolist',
    icon: 'material-symbols:checklist',
  },
];

const adminItems = [
  {
    title: 'Data User',
    url: '/masterData/usersData',
    icon: 'material-symbols:person',
  },
  {
    title: 'Data Role',
    url: '/masterData/rolesData',
    icon: 'material-symbols:assignment-ind',
  },
];

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
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
