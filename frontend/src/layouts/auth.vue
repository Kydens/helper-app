<template>
  <div>
    <Head>
      <Title>Helper App</Title>
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta name="description" content="Helper App - Membantu Anda" />
      <!-- Tambahkan meta atau link lain di sini kalau perlu -->
    </Head>

    <main>
      <slot />
    </main>

    <!-- Tambahkan skrip global atau komponen footer jika ada -->
  </div>
</template>

<script setup>
// Bisa tambahkan global setup jika dibutuhkan
</script>

<style scoped>
/* Tidak ada styling, ini layout polos */
</style>
