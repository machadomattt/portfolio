<script setup lang="ts">
import { projects } from '../data/resume'
import Icon from './Icon.vue'
</script>

<template>
  <section id="projetos" class="section">
    <div class="section-head" v-reveal>
      <div>
        <p class="eyebrow">projetos.json</p>
        <h2 class="section-title">Projetos técnicos em destaque</h2>
        <p class="section-sub">Ferramentas e pipelines construídos para resolver problemas reais de qualidade, dados e infraestrutura.</p>
      </div>
    </div>

    <div class="projects-grid">
      <article v-for="(project, i) in projects" :key="project.name" class="card project-card" v-reveal="i * 90">
        <div class="project-head">
          <span class="pill pill-green">passou</span>
          <span class="project-tag mono">{{ project.tag }}</span>
        </div>

        <h3 class="project-name">{{ project.name }}</h3>
        <p class="project-desc">{{ project.description }}</p>

        <ul class="project-highlights">
          <li v-for="h in project.highlights" :key="h">
            <Icon name="check" />
            {{ h }}
          </li>
        </ul>

        <div class="project-stack">
          <span v-for="s in project.stack" :key="s" class="tag">{{ s }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.project-card {
  padding: 22px 22px 24px;
  display: flex;
  flex-direction: column;
  border-top: 2px solid var(--green);
}

.project-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-tag {
  font-size: 11px;
  color: var(--text-faint);
}

.project-name {
  font-size: 16.5px;
  line-height: 1.3;
  margin-top: 14px;
}

.project-desc {
  color: var(--text-dim);
  font-size: 13.2px;
  line-height: 1.6;
  margin-top: 12px;
  flex-grow: 1;
}

.project-highlights {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-soft);
}

.project-highlights li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12.3px;
  color: var(--text-dim);
}

.project-highlights svg {
  width: 13px;
  height: 13px;
  color: var(--green);
  margin-top: 2px;
  flex-shrink: 0;
}

.project-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 18px;
}

@media (max-width: 980px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
