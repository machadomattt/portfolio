<script setup lang="ts">
import { currentExperience, pastRoles, education } from '../data/resume'
import Icon from './Icon.vue'

const stages = ['Estagiário de QA', 'Júnior I', 'Júnior II', 'Pleno']
</script>

<template>
  <section id="experiencia" class="section">
    <div class="section-head" v-reveal>
      <div>
        <p class="eyebrow">trajetoria.log</p>
        <h2 class="section-title">Histórico de progressão</h2>
        <p class="section-sub">Pedbot, Marília/SP — três promoções internas desde fevereiro de 2023.</p>
      </div>
    </div>

    <div class="stage-row" v-reveal>
      <div v-for="(stage, i) in stages" :key="stage" class="stage-card card" :class="{ current: i === stages.length - 1 }">
        <span class="stage-bar" />
        <span class="stage-label">{{ stage }}</span>
        <span class="pill" :class="i === stages.length - 1 ? 'pill-violet' : 'pill-green'">
          {{ i === stages.length - 1 ? 'atual' : 'aprovado' }}
        </span>
      </div>
    </div>

    <article class="card run-entry" v-reveal="80">
      <div class="run-head">
        <span class="pill pill-green">em andamento</span>
        <span class="run-period mono">{{ currentExperience.period }}</span>
      </div>
      <h3 class="run-title">{{ currentExperience.company }}</h3>
      <p class="run-role">{{ currentExperience.title }} · {{ currentExperience.location }} · {{ currentExperience.modality }}</p>
      <p class="run-progression mono">{{ currentExperience.progression }}</p>

      <ul class="run-log">
        <li v-for="bullet in currentExperience.bullets" :key="bullet">
          <Icon name="check" />
          <span>{{ bullet }}</span>
        </li>
      </ul>
    </article>

    <div class="run-rows">
      <div v-for="role in pastRoles" :key="role.company" class="run-row card" v-reveal="140">
        <span class="pill pill-amber">arquivado</span>
        <div class="run-row-body">
          <span class="run-row-title">{{ role.title }}</span>
          <span class="run-row-company">{{ role.company }}</span>
        </div>
        <span class="run-row-meta mono">{{ role.location }}</span>
        <span class="run-row-meta mono">{{ role.period }}</span>
      </div>

      <div class="run-row card" v-reveal="180">
        <span class="pill pill-green">{{ education.status.toLowerCase() }}</span>
        <div class="run-row-body">
          <span class="run-row-title">{{ education.degree }}</span>
          <span class="run-row-company">{{ education.institution }}</span>
        </div>
        <span class="run-row-meta mono">{{ education.period }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stage-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stage-card {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 2px solid var(--green);
}

.stage-card.current {
  border-top-color: var(--violet);
}

.stage-label {
  font-size: 13px;
  font-weight: 500;
}

.run-entry {
  padding: 24px 26px;
  margin-bottom: 16px;
}

.run-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.run-period {
  font-size: 11.5px;
  color: var(--text-faint);
}

.run-title {
  font-size: 19px;
  margin-top: 14px;
}

.run-role {
  color: var(--violet);
  font-size: 13px;
  margin-top: 6px;
}

.run-progression {
  color: var(--text-faint);
  font-size: 11.5px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--border-soft);
}

.run-log {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.run-log li {
  display: flex;
  gap: 11px;
  font-size: 14px;
  color: var(--text-dim);
  line-height: 1.6;
}

.run-log svg {
  width: 16px;
  height: 16px;
  color: var(--green);
  flex-shrink: 0;
  margin-top: 3px;
}

.run-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.run-row {
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 18px;
}

.run-row-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
}

.run-row-title {
  font-size: 13.5px;
  font-weight: 600;
}

.run-row-company {
  font-size: 12px;
  color: var(--text-dim);
}

.run-row-meta {
  font-size: 11px;
  color: var(--text-faint);
  white-space: nowrap;
}

@media (max-width: 760px) {
  .stage-row {
    grid-template-columns: 1fr 1fr;
  }

  .run-row {
    flex-wrap: wrap;
    gap: 8px 18px;
  }
}
</style>
