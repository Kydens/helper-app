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
              <SidebarMenuButton asChild>
                <NuxtLink
                  :to="item.url"
                  :class="[
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium',
                    route.path === item.url
                      ? 'bg-sidebar-accent-foreground text-sidebar-accent'
                      : 'hover:bg-muted hover:text-foreground',
                  ]"
                >
                  <Icon :name="item.icon" class="w-5 h-5" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>

<script setup>
import { Home, ListTodo } from 'lucide-vue-next';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
} from '../ui/sidebar';

const route = useRoute();

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
</script>

<style></style>
