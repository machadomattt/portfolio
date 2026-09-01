<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <span class="mono">Matheus Machado — QA Pleno</span>
    <span class="mono">© {{ year }} · build passing</span>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 20px;
  margin-top: 8px;
  border-top: 1px solid var(--border-soft);
  font-size: 11px;
  color: var(--text-faint);
}
</style>
