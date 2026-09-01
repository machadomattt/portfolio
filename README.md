# Matheus Machado — Portfólio

Site pessoal construído com Vue 3 + TypeScript, refletindo o stack real do currículo. A seção "Testes" do site é o destaque: mostra os resultados reais da suíte Playwright que valida esta página e permite **rodar essa suíte de verdade, ao vivo**, direto do navegador — não é uma simulação.

Por causa disso, este não é mais um site puramente estático: precisa de um backend Node (`server/index.mjs`) que executa `playwright test` sob demanda.

## Rodando localmente (front-end apenas, sem o botão "ao vivo")

```bash
npm install
npm run dev
```

O botão "Rodar testes ao vivo" vai mostrar erro de conexão nesse modo, porque não há backend rodando — comportamento esperado.

## Rodando localmente com o backend (execução ao vivo funcionando)

Em dois terminais:

```bash
# terminal 1 — backend na porta 3001
npm run build
npm run server

# terminal 2 — front-end com hot reload, proxy de /api já configurado no vite.config.ts
npm run dev
```

Ou, para simular o ambiente de produção real (um único processo servindo tudo):

```bash
npm run build
npm start
# abre http://localhost:3001 (ou a porta em $PORT)
```

## Testes E2E (Playwright)

```bash
npx playwright install chromium
npm run test:e2e
```

A lista paginada da seção "Testes" mostra um retrato fixo (gravado) dessa suíte. Para atualizar esse retrato depois de alterar os testes:

```bash
npm run build
npm run test:report
npm run build
```

`test:report` roda a suíte contra o build de produção e regrava `src/data/testRuns.ts` — por isso é preciso buildar antes (para testar o código atual) e depois (para embutir os dados novos no bundle). Já o botão "Rodar testes ao vivo" não usa esse arquivo: ele dispara uma execução real via `server/index.mjs`, com uma trava (uma execução por vez) e um intervalo mínimo entre execuções para evitar abuso.

## Docker

A imagem de runtime usa a base oficial do Playwright (já traz Chromium e as dependências de sistema necessárias para rodar os testes dentro do container):

```bash
docker build -t portifolio .
docker run -p 8080:8080 portifolio
```

## Deploy

Como o site agora precisa de um processo Node persistente que possa disparar um navegador real (não só arquivos estáticos), há duas formas de hospedar:

### Opção A — tudo num só lugar (mais simples)

Render, Railway ou Fly.io, rodando a imagem Docker deste repo (`npm start` por baixo). O botão "ao vivo" funciona sem configuração extra, porque front-end e backend são o mesmo processo/origem.

### Opção B — front-end na Vercel + backend no Render

A Vercel é serverless (funções de vida curta, sem processo persistente, sem Chromium instalável) — não dá pra rodar `npx playwright test` nela. Por isso o site é dividido em dois deploys que conversam via CORS:

1. **Backend no Render** (Web Service → "Docker", apontando pro `Dockerfile` deste repo):
   - `ALLOWED_ORIGIN` = URL do front na Vercel (ex.: `https://seu-projeto.vercel.app`) — sem isso, o CORS bloqueia o front por padrão.
   - `PUBLIC_SITE_URL` = a mesma URL da Vercel — é o que garante que "rodar ao vivo" testa o site público de verdade, não o backend sozinho.
   - Anote a URL pública que o Render gerar pro backend (ex.: `https://seu-backend.onrender.com`).

2. **Front-end na Vercel** (importar o repo normalmente — `vercel.json` já define build/output):
   - `VITE_API_BASE_URL` = a URL do backend no Render (do passo anterior).

Sem esse par de variáveis configurado nos dois lados, o botão "Rodar testes ao vivo" cai no estado de erro de conexão tratado — o resto do site funciona normalmente de qualquer forma. Hospedagem só-estática sem esse backend (GitHub Pages, Netlify sem functions, Vercel sozinha) tem o mesmo efeito: tudo funciona, exceto a execução ao vivo.

## Stack

Vue 3 · TypeScript · Vite · Express · Playwright · Docker · GitHub Actions
