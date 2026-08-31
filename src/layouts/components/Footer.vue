<template>
  <div
    class="h-100 d-flex align-center justify-md-space-between justify-center"
  >
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center text-medium-emphasis">
      &copy;
      {{ new Date().getFullYear() }}

      <a
        :href="company_website"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary ms-1"
      >
        {{ company_name }}
      </a>
      &nbsp; All rights Reserved
    </span>

    <!-- 👉 Footer: right content -->
  </div>
</template>
