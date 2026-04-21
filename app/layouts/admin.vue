<template>
  <UApp>
    <div class="min-h-screen flex flex-col bg-blue">
      <Navbar />
      <div class="flex flex-1 min-h-0">
        <AdminSidebar />
        <main class="flex-1 p-6 overflow-auto">
          <NuxtPage />
        </main>
      </div>
    </div>
  </UApp>
</template>
