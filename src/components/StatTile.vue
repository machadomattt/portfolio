<script setup lang="ts">
defineProps<{
  label: string
  value: string
  caption: string
  color?: 'violet' | 'green' | 'amber' | 'blue'
}>()
</script>

<template>
  <div class="stat-tile card" :class="`c-${color ?? 'violet'}`">
    <span class="stat-label">{{ label }}</span>
    <span class="stat-value">{{ value }}</span>
    <span class="stat-caption">{{ caption }}</span>
  </div>
</template>

<style scoped>
.stat-tile {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 2px solid var(--border);
}

.c-violet { border-top-color: var(--violet); }
.c-green { border-top-color: var(--green); }
.c-amber { border-top-color: var(--amber); }
.c-blue { border-top-color: var(--blue); }

.stat-label {
  font-size: 11.5px;
  color: var(--text-faint);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  line-height: 1.1;
}

.c-violet .stat-value { color: var(--violet); }
.c-green .stat-value { color: var(--green); }
.c-amber .stat-value { color: var(--amber); }
.c-blue .stat-value { color: var(--blue); }

.stat-caption {
  font-size: 12.5px;
  color: var(--text-dim);
  line-height: 1.4;
}
</style>
