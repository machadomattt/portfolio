<script setup lang="ts">
import AppSidebar from './components/AppSidebar.vue'
import HeroSection from './components/HeroSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import TestsSection from './components/TestsSection.vue'
import ContactSection from './components/ContactSection.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <div class="app-shell">
    <AppSidebar />
    <div class="app-main">
      <div class="app-content">
        <HeroSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <TestsSection />
        <ContactSection />
        <SiteFooter />
      </div>
    </div>
  </div>
</template>
