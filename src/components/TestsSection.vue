<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { testRunMeta, type TestResult, type TestRunMeta } from '../data/testRuns'
import StatTile from './StatTile.vue'
import TestLogReplay from './TestLogReplay.vue'
import Icon from './Icon.vue'

type Filter = 'all' | 'passed' | 'failed' | 'skipped'

// Keep in sync with the CSS: .test-rows min-height assumes this many rows.
const PAGE_SIZE = 5

const filter = ref<Filter>('all')
const search = ref('')
const page = ref(1)
const liveResults = ref<{ meta: TestRunMeta; tests: TestResult[] } | null>(null)

function onCompleted(payload: { code: number; meta: TestRunMeta | null; tests: TestResult[] | null }) {
  if (payload.tests && payload.meta) {
    liveResults.value = { meta: payload.meta, tests: payload.tests }
  }
}

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'passed', label: 'Passou' },
  { id: 'failed', label: 'Falhou' },
  { id: 'skipped', label: 'Pulado' },
]

const successRate = Math.round((testRunMeta.passed / testRunMeta.total) * 100)

const maxDuration = computed(() => {
  const tests = liveResults.value?.tests ?? []
  return Math.max(1, ...tests.map((t) => t.duration))
})

const filtered = computed(() => {
  const tests = liveResults.value?.tests ?? []
  const q = search.value.trim().toLowerCase()
  return tests.filter((t) => {
    const matchesFilter = filter.value === 'all' || t.status === filter.value
    const matchesSearch =
      !q || t.title.toLowerCase().includes(q) || t.describe.toLowerCase().includes(q) || t.file.toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))

const paged = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return filtered.value.slice(start, start + PAGE_SIZE)
})

watch([filter, search], () => {
  page.value = 1
})

watch(totalPages, (max) => {
  if (page.value > max) page.value = max
})

watch(liveResults, () => {
  filter.value = 'all'
  search.value = ''
  page.value = 1
})

// Clamp at the source rather than relying only on the buttons' `disabled`
// attribute, which is a DOM-render-timing guard, not a data-integrity one —
// repeated clicks faster than a render tick could otherwise push `page`
// past `totalPages` (or below 1) and land on a blank page.
function goToPrevPage() {
  if (page.value > 1) page.value -= 1
}

function goToNextPage() {
  if (page.value < totalPages.value) page.value += 1
}

const generatedDate = new Date(testRunMeta.generatedAt).toLocaleDateString('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})
</script>

<template>
  <section id="testes" class="section">
    <div class="section-head" v-reveal>
      <div>
        <p class="eyebrow">e2e.spec.ts</p>
        <h2 class="section-title">A suíte que testa este site</h2>
        <p class="section-sub">
          Resultados reais da suíte Playwright que valida esta página — rodada contra o build de produção em
          {{ generatedDate }}.
        </p>
      </div>
    </div>

    <div class="stat-row" v-reveal="40">
      <StatTile label="Testes" :value="String(testRunMeta.total)" caption="cenários automatizados" color="violet" />
      <StatTile label="Passando" :value="String(testRunMeta.passed)" caption="sem falhas conhecidas" color="green" />
      <StatTile label="Taxa de sucesso" :value="`${successRate}%`" caption="na última execução" color="green" />
      <StatTile label="Duração total" :value="`${(testRunMeta.durationMs / 1000).toFixed(1)}s`" caption="chromium · build de produção" color="blue" />
    </div>

    <div class="console-wrap" v-reveal="70">
      <TestLogReplay @completed="onCompleted" />
    </div>

    <div v-if="liveResults" class="card test-panel" v-reveal>
      <div class="live-banner">
        <span class="pill" :class="liveResults.meta.failed === 0 ? 'pill-green' : 'pill-red'">
          {{ liveResults.meta.failed === 0 ? 'tudo passou' : `${liveResults.meta.failed} falharam` }}
        </span>
        <span class="live-banner-text mono">
          resultados desta execução ao vivo · {{ liveResults.meta.passed }}/{{ liveResults.meta.total }} passaram ·
          {{ (liveResults.meta.durationMs / 1000).toFixed(1) }}s
        </span>
      </div>

      <div class="test-controls">
        <div class="filter-tabs">
          <button
            v-for="f in filters"
            :key="f.id"
            class="filter-tab"
            :class="{ active: filter === f.id }"
            @click="filter = f.id"
          >
            {{ f.label }}
          </button>
        </div>

        <div class="search-box">
          <Icon name="search" />
          <input v-model="search" type="text" placeholder="Buscar teste, describe ou arquivo…" />
          <button v-if="search" class="search-clear" aria-label="Limpar busca" @click="search = ''">
            <Icon name="x" />
          </button>
        </div>
      </div>

      <div class="test-rows">
        <div v-if="filtered.length === 0" class="empty-state">Nenhum teste encontrado para esse filtro.</div>

        <div v-for="test in paged" :key="test.describe + test.title" class="test-row">
          <span class="pill" :class="`pill-${test.status === 'passed' ? 'green' : test.status === 'failed' ? 'red' : 'amber'}`">
            {{ test.status === 'passed' ? 'passou' : test.status === 'failed' ? 'falhou' : 'pulado' }}
          </span>
          <div class="test-row-body">
            <span class="test-title">{{ test.title }}</span>
            <span class="test-describe">{{ test.describe }}</span>
            <span v-if="test.error" class="test-reason test-reason-error">✗ {{ test.error.split('\n')[0] }}</span>
            <span v-else-if="test.skipReason" class="test-reason test-reason-skip">○ {{ test.skipReason }}</span>
          </div>
          <span class="tag test-file-tag mono">{{ test.file }}</span>
          <div class="test-duration">
            <span class="duration-bar-track">
              <span class="duration-bar-fill" :style="{ width: `${(test.duration / maxDuration) * 100}%` }" />
            </span>
            <span class="duration-value mono">{{ test.duration }}ms</span>
          </div>
        </div>
      </div>

      <div v-if="filtered.length > 0" class="pagination">
        <span class="pagination-info mono">
          {{ (page - 1) * PAGE_SIZE + 1 }}–{{ Math.min(page * PAGE_SIZE, filtered.length) }} de {{ filtered.length }}
        </span>
        <div class="pagination-controls">
          <button class="btn btn-ghost pagination-btn" :disabled="page === 1" @click="goToPrevPage">Anterior</button>
          <span class="pagination-page mono">{{ page }} / {{ totalPages }}</span>
          <button class="btn btn-ghost pagination-btn" :disabled="page === totalPages" @click="goToNextPage">Próxima</button>
        </div>
      </div>
    </div>

    <div v-else class="card test-panel-placeholder" v-reveal="100">
      <Icon name="activity" />
      <p>Rode os testes ao vivo acima para ver aqui a lista detalhada, filtrável e pesquisável dos resultados.</p>
    </div>
  </section>
</template>

<style scoped>
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 14px;
}

.console-wrap {
  margin-bottom: 14px;
}

.test-panel-placeholder {
  padding: 30px 24px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--text-faint);
  font-size: 13.5px;
}

.test-panel-placeholder svg {
  width: 20px;
  height: 20px;
  color: var(--violet);
  flex-shrink: 0;
}

.test-panel {
  padding: 20px 22px 18px;
}

.live-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding-bottom: 14px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--border-soft);
}

.live-banner-text {
  font-size: 11px;
  color: var(--text-faint);
}

.test-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding-bottom: 16px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--border-soft);
}

.filter-tabs {
  display: flex;
  gap: 4px;
  background: var(--surface-2);
  padding: 3px;
  border-radius: var(--radius-sm);
}

.filter-tab {
  background: none;
  border: none;
  padding: 6px 13px;
  font-size: 12.5px;
  color: var(--text-dim);
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease;
}

.filter-tab:hover {
  color: var(--text);
}

.filter-tab.active {
  background: var(--surface);
  color: var(--violet);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 7px 10px;
  min-width: 220px;
  flex: 1;
  max-width: 300px;
}

.search-box svg {
  width: 14px;
  height: 14px;
  color: var(--text-faint);
  flex-shrink: 0;
}

.search-box input {
  border: none;
  background: none;
  outline: none;
  color: var(--text);
  font-size: 13px;
  width: 100%;
}

.search-box input::placeholder {
  color: var(--text-faint);
}

.search-clear {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-faint);
  display: flex;
  padding: 0;
}

.search-clear svg {
  width: 13px;
  height: 13px;
}

/* Fixed height for exactly PAGE_SIZE (5) rows, so switching between a full
   page and a shorter last page never resizes the card. */
.test-rows {
  min-height: 310px;
}

.empty-state {
  height: 310px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--text-faint);
  font-size: 13.5px;
}

.test-row {
  min-height: 62px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 4px;
  border-top: 1px solid var(--border-soft);
}

.test-row:first-child {
  border-top: none;
}

.test-row-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.test-title {
  font-size: 13px;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.test-describe {
  font-size: 11px;
  color: var(--text-faint);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.test-reason {
  font-family: var(--font-mono);
  font-size: 11px;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.test-reason-error {
  color: var(--red);
}

.test-reason-skip {
  color: var(--amber);
}

.test-file-tag {
  flex-shrink: 0;
  font-size: 10.5px;
}

.test-duration {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  width: 130px;
}

.duration-bar-track {
  flex: 1;
  height: 4px;
  border-radius: 999px;
  background: var(--surface-2);
  overflow: hidden;
}

.duration-bar-fill {
  display: block;
  height: 100%;
  background: var(--blue);
  border-radius: 999px;
}

.duration-value {
  font-size: 10.5px;
  color: var(--text-faint);
  width: 46px;
  text-align: right;
  flex-shrink: 0;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--border-soft);
}

.pagination-info {
  font-size: 11px;
  color: var(--text-faint);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination-btn {
  padding: 6px 13px;
  font-size: 12.5px;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-page {
  font-size: 12px;
  color: var(--text-dim);
}

@media (max-width: 860px) {
  .stat-row {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .test-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }

  .test-file-tag,
  .test-describe {
    display: none;
  }

  .test-duration {
    width: 80px;
  }
}
</style>
