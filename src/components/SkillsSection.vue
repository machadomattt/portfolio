<script setup lang="ts">
import { computed } from 'vue'
import { skillGroups } from '../data/resume'

const colors = ['green', 'amber', 'blue', 'violet'] as const
const maxCount = Math.max(...skillGroups.map((g) => g.skills.length))

const groups = computed(() =>
  skillGroups.map((g, i) => ({
    ...g,
    color: colors[i % colors.length],
    pct: Math.round((g.skills.length / maxCount) * 100),
  })),
)
</script>

<template>
  <section id="skills" class="section">
    <div class="section-head" v-reveal>
      <div>
        <p class="eyebrow">competencias.yml</p>
        <h2 class="section-title">Cobertura de competências técnicas</h2>
        <p class="section-sub">Organizadas por domínio de responsabilidade, com a densidade de itens verificados por área.</p>
      </div>
    </div>

    <div class="skills-grid">
      <div v-for="(group, i) in groups" :key="group.title" class="card skill-card" :class="`c-${group.color}`" v-reveal="i * 80">
        <div class="skill-head">
          <h3>{{ group.title }}</h3>
          <span class="skill-count mono">{{ group.skills.length }} itens</span>
        </div>

        <div class="coverage-track">
          <div class="coverage-fill" :style="{ width: `${group.pct}%` }" />
        </div>

        <div class="skill-chips">
          <span v-for="skill in group.skills" :key="skill" class="tag">{{ skill }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.skill-card {
  padding: 20px 22px 22px;
  border-top: 2px solid var(--border);
}

.c-green { border-top-color: var(--green); }
.c-amber { border-top-color: var(--amber); }
.c-blue { border-top-color: var(--blue); }
.c-violet { border-top-color: var(--violet); }

.skill-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.skill-head h3 {
  font-size: 15.5px;
}

.skill-count {
  font-size: 11px;
  color: var(--text-faint);
}

.coverage-track {
  height: 6px;
  border-radius: 999px;
  background: var(--surface-2);
  margin-top: 14px;
  overflow: hidden;
}

.coverage-fill {
  height: 100%;
  border-radius: 999px;
}

.c-green .coverage-fill { background: var(--green); }
.c-amber .coverage-fill { background: var(--amber); }
.c-blue .coverage-fill { background: var(--blue); }
.c-violet .coverage-fill { background: var(--violet); }

.skill-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 16px;
}

@media (max-width: 860px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
