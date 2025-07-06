<template>
  <Sidebar class="bg-sidebar text-sidebar-foreground border-r">
    <SidebarContent>
      <SidebarGroup>
        <SidebarHeader class="px-4 py-4">
          <h1 class="text-xl font-bold tracking-wide">Helper App</h1>
        </SidebarHeader>
        <SidebarGroupContent>
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
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>

<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useRole } from '@/composables/useRole';
import { Home, ListTodo } from 'lucide-vue-next';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const masterOpen = ref(false);

const route = useRoute();
const { role } = useRole();

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
