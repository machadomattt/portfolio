<script setup lang="ts">
import { computed } from 'vue'

interface Segment {
  label: string
  value: number
  color: string
}

const props = defineProps<{ segments: Segment[] }>()

const total = computed(() => props.segments.reduce((sum, s) => sum + s.value, 0))
const radius = 46
const circumference = 2 * Math.PI * radius

const arcs = computed(() => {
  let cumulative = 0
  return props.segments.map((seg) => {
    const length = (seg.value / total.value) * circumference
    const offset = (cumulative / total.value) * circumference
    cumulative += seg.value
    return { ...seg, dasharray: `${length} ${circumference - length}`, dashoffset: -offset }
  })
})
</script>

<template>
  <div class="donut-wrap">
    <svg viewBox="0 0 120 120" class="donut">
      <circle cx="60" cy="60" :r="radius" fill="none" stroke="var(--surface-2)" stroke-width="14" />
      <circle
        v-for="arc in arcs"
        :key="arc.label"
        cx="60"
        cy="60"
        :r="radius"
        fill="none"
        :stroke="arc.color"
        stroke-width="14"
        stroke-linecap="butt"
        :stroke-dasharray="arc.dasharray"
        :stroke-dashoffset="arc.dashoffset"
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="56" text-anchor="middle" font-family="var(--font-display)" font-size="26" font-weight="700" fill="var(--text)">
        {{ total }}
      </text>
      <text x="60" y="74" text-anchor="middle" font-family="var(--font-mono)" font-size="9.5" letter-spacing="1" fill="var(--text-faint)">
        SKILLS
      </text>
    </svg>

    <ul class="donut-legend">
      <li v-for="seg in segments" :key="seg.label">
        <span class="legend-dot" :style="{ background: seg.color }" />
        <span class="legend-label">{{ seg.label }}</span>
        <span class="legend-value mono">{{ seg.value }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.donut-wrap {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.donut {
  width: 130px;
  height: 130px;
  flex-shrink: 0;
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 9px;
  flex: 1;
  min-width: 160px;
}

.donut-legend li {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  color: var(--text-dim);
}

.legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 2px;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
}

.legend-value {
  color: var(--text);
  font-size: 12px;
}
</style>
