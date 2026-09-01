<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { profile } from '../data/resume'
import Icon from './Icon.vue'

const links = [
  { id: 'top', label: 'Visão geral', icon: 'grid' as const },
  { id: 'experiencia', label: 'Trajetória', icon: 'briefcase' as const },
  { id: 'projetos', label: 'Evidências', icon: 'flask' as const },
  { id: 'skills', label: 'Competências', icon: 'checklist' as const },
  { id: 'testes', label: 'Testes', icon: 'activity' as const },
  { id: 'contato', label: 'Contato', icon: 'mail' as const },
]

const active = ref('top')
const menuOpen = ref(false)

function onScroll() {
  // If the last section is shorter than the viewport, the page can hit its
  // scroll limit before that section's top ever crosses the 140px line
  // below — it would then never win the loop below, no matter how far you
  // scroll or click its link. Treat "scrolled to the bottom" as "on the
  // last section" explicitly instead of relying purely on that threshold.
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
  if (atBottom) {
    active.value = links[links.length - 1].id
    return
  }

  let current = links[0].id
  for (const link of links) {
    const el = document.getElementById(link.id)
    if (el && el.getBoundingClientRect().top <= 140) {
      current = link.id
    }
  }
  active.value = current
}

function closeMenu() {
  menuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="topbar">
    <a href="#top" class="topbar-brand">
      <span class="brand-mark">MM</span>
      <span class="brand-name">Matheus Machado</span>
    </a>
    <button class="menu-burger" :aria-expanded="menuOpen" aria-label="Abrir menu" @click="menuOpen = !menuOpen">
      <span /><span /><span />
    </button>
  </header>

  <div v-if="menuOpen" class="scrim" @click="closeMenu" />

  <aside class="sidebar" :class="{ open: menuOpen }">
    <div class="sidebar-top">
      <span class="brand-mark">MM</span>
      <div class="sidebar-id">
        <span class="sidebar-name">Matheus Machado</span>
        <span class="sidebar-role mono">QA Pleno</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <a
        v-for="link in links"
        :key="link.id"
        :href="`#${link.id}`"
        class="nav-item"
        :class="{ active: active === link.id }"
        @click="closeMenu"
      >
        <Icon :name="link.icon" />
        {{ link.label }}
      </a>
    </nav>

    <div class="sidebar-bottom">
      <span class="pill pill-green">Disponível para oportunidades</span>
      <div class="sidebar-links">
        <a :href="`mailto:${profile.email}`" aria-label="E-mail"><Icon name="mail" /></a>
        <a :href="profile.linkedinUrl" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Icon name="linkedin" /></a>
      </div>
      <span class="sidebar-version mono">build v2026.09 · passing</span>
    </div>
  </aside>
</template>

<style scoped>
.topbar {
  display: none;
}

.brand-mark {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: var(--violet-soft);
  color: var(--violet);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-w);
  background: var(--bg-elevated);
  border-right: 1px solid var(--border-soft);
  display: flex;
  flex-direction: column;
  z-index: 58;
}

.sidebar-top {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 20px;
  border-bottom: 1px solid var(--border-soft);
}

.sidebar-id {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sidebar-name {
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-role {
  font-size: 11px;
  color: var(--text-faint);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px 12px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: 13.5px;
  color: var(--text-dim);
  border-left: 2px solid transparent;
  transition: color 0.15s ease, background 0.15s ease;
}

.nav-item svg {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
}

.nav-item:hover {
  color: var(--text);
  background: var(--surface-2);
}

.nav-item.active {
  color: var(--violet);
  background: var(--violet-soft);
  border-left-color: var(--violet);
}

.sidebar-bottom {
  padding: 16px 20px 20px;
  border-top: 1px solid var(--border-soft);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pill-green {
  align-self: flex-start;
}

.sidebar-links {
  display: flex;
  gap: 10px;
}

.sidebar-links a {
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-dim);
  transition: color 0.15s ease, border-color 0.15s ease;
}

.sidebar-links a:hover {
  color: var(--violet);
  border-color: var(--violet);
}

.sidebar-links svg {
  width: 14px;
  height: 14px;
}

.sidebar-version {
  font-size: 10.5px;
  color: var(--text-faint);
}

@media (max-width: 960px) {
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    padding: 0 18px;
    background: rgba(11, 13, 18, 0.9);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border-soft);
    z-index: 60;
  }

  .topbar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .brand-name {
    font-size: 13.5px;
    font-weight: 600;
  }

  .menu-burger {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
  }

  .menu-burger span {
    width: 20px;
    height: 1.5px;
    background: var(--text);
  }

  .scrim {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 55;
  }

  .sidebar {
    top: 60px;
    transform: translateX(-100%);
    transition: transform 0.2s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-top {
    display: none;
  }
}
</style>
