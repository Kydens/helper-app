<template>
  <Head>
    <Title>Helper App</Title>
    <Meta name="viewport" content="width=device-width, initial-scale=1" />
    <Meta name="description" content="Helper App - Membantu Anda" />
    <!-- Tambahkan meta atau link lain di sini kalau perlu -->
  </Head>

  <SidebarProvider>
    <div class="flex min-h-screen w-full">
      <!-- Sidebar -->
      <AppSidebar />

      <!-- main section -->
      <div class="flex-1 flex flex-col">
        <SidebarTrigger class="m-2" />
        <main class="flex-1 p-1">
          <slot />
        </main>

        <!-- Footer -->
        <footer
          class="w-full text-center text-sm text-muted-foreground py-2 border-t"
        >
          © 2025 Eddy Nathansyah. All rights reserved.
        </footer>
      </div>
    </div>
  </SidebarProvider>

  <!-- Tambahkan skrip global atau komponen footer jika ada -->
</template>

<script setup>
// Bisa tambahkan global setup jika dibutuhkan
import AppSidebar from '~/components/organisms/AppSidebar.vue';
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
</script>

<style scoped>
/* Tidak ada styling, ini layout polos */
</style>
