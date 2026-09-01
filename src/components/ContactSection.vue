<script setup lang="ts">
import { ref } from 'vue'
import { profile } from '../data/resume'
import Icon from './Icon.vue'

const copied = ref(false)

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
    copied.value = true
    window.setTimeout(() => (copied.value = false), 1800)
  } catch {
    /* clipboard indisponível — usuário pode copiar manualmente */
  }
}
</script>

<template>
  <section id="contato" class="section">
    <div class="section-head" v-reveal>
      <div>
        <p class="eyebrow">contato.sh</p>
        <h2 class="section-title">Vamos conversar?</h2>
      </div>
    </div>

    <div class="suggestion card" v-reveal>
      <div class="suggestion-text">
        <Icon name="sparkle" />
        <span>Aberto a oportunidades de QA, automação de testes e engenharia com foco em qualidade, CI/CD e infraestrutura.</span>
      </div>
      <a :href="`mailto:${profile.email}`" class="btn btn-primary suggestion-cta">
        Enviar e-mail
      </a>
    </div>

    <div class="contact-actions" v-reveal="60">
      <a :href="`mailto:${profile.email}`" class="btn btn-ghost">
        <Icon name="mail" /> {{ profile.email }}
      </a>
      <a :href="profile.linkedinUrl" target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
        <Icon name="linkedin" /> LinkedIn
      </a>
      <a :href="`tel:${profile.phone.replace(/[^\d+]/g, '')}`" class="btn btn-ghost">
        <Icon name="phone" /> {{ profile.phone }}
      </a>
    </div>

    <button class="copy-row mono" @click="copyEmail">
      <Icon name="copy" />
      {{ copied ? 'e-mail copiado!' : `copiar ${profile.email}` }}
    </button>
  </section>
</template>

<style scoped>
.suggestion {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  border: 1px solid rgba(139, 110, 242, 0.35);
  background: linear-gradient(180deg, var(--violet-soft), var(--surface));
}

.suggestion-text {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--text);
  max-width: 560px;
}

.suggestion-text svg {
  width: 20px;
  height: 20px;
  color: var(--violet);
  flex-shrink: 0;
}

.suggestion-cta {
  flex-shrink: 0;
}

.contact-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.copy-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  background: none;
  border: none;
  color: var(--text-faint);
  font-size: 12.5px;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.copy-row:hover {
  color: var(--violet);
}

.copy-row svg {
  width: 14px;
  height: 14px;
}
</style>
