<script setup lang="ts">
import { profile, skillGroups } from '../data/resume'
import Icon from './Icon.vue'
import StatTile from './StatTile.vue'
import DonutChart from './DonutChart.vue'

const skillSegments = [
  { label: 'QA e Testes', value: skillGroups[0].skills.length, color: 'var(--green)' },
  { label: 'Desenvolvimento', value: skillGroups[1].skills.length, color: 'var(--amber)' },
  { label: 'Infra e Dados', value: skillGroups[2].skills.length, color: 'var(--blue)' },
  { label: 'IA Aplicada', value: skillGroups[3].skills.length, color: 'var(--violet)' },
]
</script>

<template>
  <section id="top" class="section hero">
    <div class="hero-top" v-reveal>
      <div>
        <p class="eyebrow">Visão geral · Nº MM/2026</p>
        <h1 class="hero-title">{{ profile.name }}</h1>
        <p class="hero-role">{{ profile.role }}</p>
      </div>
      <div class="hero-actions">
        <a href="#projetos" class="btn btn-primary">
          Ver evidências <Icon name="arrow-right" />
        </a>
        <a href="#contato" class="btn btn-ghost">Contato</a>
      </div>
    </div>

    <div class="stat-row" v-reveal="60">
      <StatTile label="Cargo atual" value="QA Pleno" caption="Analista de Teste/QA na Pedbot" color="violet" />
      <StatTile label="Repositórios" value="4" caption="API, Admin, Backoffice, Application" color="green" />
      <StatTile label="Contribuição" value="2º" caption="maior em commits — claude-skills" color="amber" />
      <StatTile label="Ativo desde" value="2023" caption="progressão interna contínua na Pedbot" color="blue" />
    </div>

    <div class="hero-grid">
      <div class="card summary-card" v-reveal="100">
        <p class="card-label mono">resumo.md</p>
        <p class="summary-text">{{ profile.summary }}</p>
      </div>

      <div class="card donut-card" v-reveal="140">
        <p class="card-label mono">competências por área</p>
        <DonutChart :segments="skillSegments" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.hero-title {
  font-size: clamp(28px, 3.6vw, 38px);
}

.hero-role {
  color: var(--text-dim);
  font-size: 15px;
  margin-top: 8px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 14px;
}

.card-label {
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--text-faint);
  text-transform: uppercase;
}

.summary-card {
  padding: 22px 24px;
}

.summary-text {
  color: var(--text-dim);
  font-size: 14.5px;
  line-height: 1.75;
  margin-top: 14px;
}

.donut-card {
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
}

.donut-card :deep(.donut-wrap) {
  margin-top: 16px;
  flex: 1;
}

@media (max-width: 860px) {
  .stat-row {
    grid-template-columns: 1fr 1fr;
  }

  .hero-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .stat-row {
    grid-template-columns: 1fr;
  }
}
</style>
