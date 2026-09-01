import { createApp } from 'vue'
import { inject } from '@vercel/analytics'
import './style.css'
import App from './App.vue'
import { vReveal } from './directives/reveal'

// No Vue-specific entry point ships in @vercel/analytics (only React/Next/
// Nuxt/Astro/Remix) — this is the framework-agnostic call other frameworks'
// wrappers call internally, done once at app boot.
inject()

const app = createApp(App)
app.directive('reveal', vReveal)
app.mount('#app')
