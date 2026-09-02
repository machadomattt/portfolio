<script setup lang="ts">
import { ref, onUnmounted, nextTick } from 'vue'
import Icon from './Icon.vue'
import type { TestResult, TestRunMeta } from '../data/testRuns'
import { apiUrl } from '../lib/api'

type Status = 'idle' | 'running' | 'done' | 'cooldown' | 'error'

const emit = defineEmits<{
  completed: [payload: { code: number; meta: TestRunMeta | null; tests: TestResult[] | null }]
}>()

const status = ref<Status>('idle')
const lines = ref<string[]>([])
const doneCode = ref<number | null>(null)
const cooldownSeconds = ref(0)
const errorMessage = ref('')
const logBody = ref<HTMLElement | null>(null)

let source: EventSource | null = null
let cooldownTimer: number | undefined

async function scrollToEnd() {
  await nextTick()
  if (logBody.value) logBody.value.scrollTop = logBody.value.scrollHeight
}

function closeStream() {
  source?.close()
  source = null
}

function openStream() {
  if (source) return
  source = new EventSource(apiUrl('/api/run/stream'))

  source.addEventListener('status', (e) => {
    const data = JSON.parse((e as MessageEvent).data)
    if (data.running) status.value = 'running'
  })

  source.addEventListener('line', (e) => {
    lines.value.push((e as MessageEvent).data)
    scrollToEnd()
  })

  source.addEventListener('done', (e) => {
    const data = JSON.parse((e as MessageEvent).data)
    doneCode.value = data.code
    status.value = 'done'
    closeStream()
    emit('completed', data)
    // The summary paragraph renders after this tick (status just flipped to
    // 'done'), so scrolling on the *previous* line event always left it just
    // past the visible edge — nextTick() inside scrollToEnd waits for that
    // paragraph to actually be in the DOM before measuring scrollHeight.
    scrollToEnd()
  })

  source.onerror = () => {
    if (status.value === 'running') {
      errorMessage.value = 'A conexão com o servidor de execução caiu no meio do processo.'
      status.value = 'error'
    }
    closeStream()
  }
}

function startCooldownCountdown(ms: number) {
  status.value = 'cooldown'
  cooldownSeconds.value = Math.ceil(ms / 1000)
  window.clearInterval(cooldownTimer)
  cooldownTimer = window.setInterval(() => {
    cooldownSeconds.value -= 1
    if (cooldownSeconds.value <= 0) {
      window.clearInterval(cooldownTimer)
      status.value = 'idle'
    }
  }, 1000)
}

async function start() {
  if (status.value === 'running') return

  try {
    const res = await fetch(apiUrl('/api/run/start'), { method: 'POST' })

    if (res.status === 202) {
      lines.value = []
      doneCode.value = null
      status.value = 'running'
      openStream()
      return
    }

    if (res.status === 409) {
      // já tem uma execução em andamento (talvez de outro visitante) — só acompanhar
      status.value = 'running'
      openStream()
      return
    }

    if (res.status === 429) {
      const data = await res.json()
      startCooldownCountdown(data.retryAfterMs ?? 30000)
      return
    }

    throw new Error(`status inesperado: ${res.status}`)
  } catch {
    errorMessage.value = 'Não foi possível conectar ao servidor de execução ao vivo.'
    status.value = 'error'
  }
}

onUnmounted(() => {
  closeStream()
  window.clearInterval(cooldownTimer)
})
</script>

<template>
  <div class="card console-card">
    <div class="console-bar">
      <span class="console-dot" :class="status" />
      <span class="console-cmd mono">playwright test --project=chromium</span>
      <span class="tag console-tag">execução ao vivo · rate limit ativo</span>

      <button v-if="status === 'idle'" class="btn btn-primary console-btn" @click="start">
        <Icon name="activity" /> Rodar testes ao vivo
      </button>
      <button v-else-if="status === 'running'" class="btn btn-ghost console-btn" disabled>
        Rodando ao vivo… ({{ lines.length }} linhas)
      </button>
      <button v-else-if="status === 'cooldown'" class="btn btn-ghost console-btn" disabled>
        Aguarde {{ cooldownSeconds }}s
      </button>
      <button v-else-if="status === 'error'" class="btn btn-ghost console-btn" @click="start">
        <Icon name="activity" /> Tentar novamente
      </button>
      <button v-else class="btn btn-ghost console-btn" @click="start">
        <Icon name="activity" /> Rodar novamente
      </button>
    </div>

    <div ref="logBody" class="console-body mono">
      <p v-if="status === 'idle'" class="console-hint">
        Clique em "Rodar testes ao vivo" para executar de verdade, agora, a suíte Playwright real contra esta
        instância — sem dados pré-gravados. Por segurança, só uma execução roda por vez e há um intervalo mínimo
        entre execuções. Como isso roda num servidor de hospedagem gratuita, pode levar até 1-2 minutos.
      </p>

      <p v-if="status === 'error'" class="console-hint console-error">{{ errorMessage }}</p>

      <p v-for="(line, i) in lines" :key="i" class="console-line">{{ line }}</p>

      <p v-if="status === 'running'" class="console-cursor">█</p>

      <p v-if="status === 'done'" class="console-summary" :class="doneCode === 0 ? 'ok' : 'fail'">
        {{ doneCode === 0 ? '✓ execução concluída com sucesso' : '✗ execução terminou com falhas' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.console-card {
  padding: 0;
  overflow: hidden;
}

.console-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-soft);
  flex-wrap: wrap;
}

.console-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--text-faint);
  flex-shrink: 0;
}

.console-dot.running {
  background: var(--amber);
  animation: pulse 1.1s infinite;
}

.console-dot.done {
  background: var(--green);
}

.console-dot.error {
  background: var(--red);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

.console-cmd {
  font-size: 12.5px;
  color: var(--text-dim);
}

.console-tag {
  font-size: 10px;
  color: var(--text-faint);
}

.console-btn {
  margin-left: auto;
  padding: 7px 14px;
  font-size: 12.5px;
  white-space: nowrap;
}

.console-btn svg {
  width: 13px;
  height: 13px;
}

.console-body {
  padding: 14px 16px;
  height: 220px;
  overflow-y: auto;
  font-size: 11.5px;
  line-height: 1.85;
}

.console-hint {
  color: var(--text-faint);
  line-height: 1.6;
}

.console-error {
  color: var(--red);
}

.console-line {
  color: var(--text-dim);
  white-space: pre-wrap;
  word-break: break-word;
}

.console-cursor {
  color: var(--violet);
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.console-summary {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border-soft);
  font-weight: 600;
}

.console-summary.ok {
  color: var(--green);
}

.console-summary.fail {
  color: var(--red);
}

@media (max-width: 600px) {
  .console-btn {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
}
</style>
