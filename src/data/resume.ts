export interface Profile {
  name: string
  role: string
  location: string
  phone: string
  email: string
  linkedin: string
  linkedinUrl: string
  summary: string
}

export interface ExperienceBullet {
  text: string
}

export interface Experience {
  company: string
  location: string
  modality?: string
  title: string
  period: string
  progression?: string
  bullets: string[]
  current: boolean
}

export interface PastRole {
  company: string
  location: string
  title: string
  period: string
  modality: string
}

export interface Project {
  name: string
  tag: string
  description: string
  highlights: string[]
  stack: string[]
}

export interface SkillGroup {
  title: string
  command: string
  skills: string[]
}

export interface Education {
  degree: string
  institution: string
  period: string
  status: string
}

export const profile: Profile = {
  name: 'Matheus Machado',
  role: 'QA Pleno | Automação de Testes | Desenvolvimento e CI/CD',
  location: 'Marília, SP',
  phone: '(14) 99607-6901',
  email: 'matheeus.machado@gmail.com',
  linkedin: 'linkedin.com/in/machadomatheus1',
  linkedinUrl: 'https://linkedin.com/in/machadomatheus1',
  summary:
    'Profissional de QA Pleno com atuação híbrida entre qualidade, desenvolvimento de automações, CI/CD e infraestrutura. Experiência em investigação de causa raiz, leitura e discussão de código PHP/Laravel, Vue e TypeScript, testes com Playwright e Cypress, APIs, bancos de dados e ambientes multi-tenant. Constrói ferramentas em TypeScript, PostgreSQL e Docker e aplica IA a fluxos de engenharia com governança e aprovação humana. Orientado a transformar falhas recorrentes em gates, processos e soluções reutilizáveis.',
}

export const currentExperience: Experience = {
  company: 'Pedbot',
  location: 'Marília, SP',
  modality: 'Híbrido',
  title: 'Analista de Teste/QA - Pleno',
  period: 'jun 2025 - atual',
  progression: 'Progressão interna: Estagiário de QA -> Júnior I -> Júnior II -> Pleno, desde fev 2023.',
  current: true,
  bullets: [
    'Desenhou e mantém o fluxo de validação pré-beta/produção para quatro repositórios (API, Admin, Backoffice e Application), com sincronização e checkout de branches, plano de testes e execução automatizada com Playwright.',
    'Converteu causas raiz de aprovações e reprovações inconsistentes em gates permanentes: dados reais, integrações externas validadas além de mocks, conferência de diffs e prova multi-tenant. Também exige confirmação no código antes de reprovar por regra presumida.',
    'Atua com APIs, SQL/PostgreSQL, migrations, logs e leitura de código para diferenciar sintoma, regra de negócio, falha ambiental e regressão.',
    'É o segundo maior contribuidor em commits do repositório interno claude-skills; criou e evolui a skill validated-stardust, com gate de aprovação, suporte multi-tenant, estado persistente e testes automáticos de sub-issues.',
    'Diagnosticou problemas de alto custo de investigação, como workers Horizon executando código antigo após troca de branch, divergência UTC/Brasília e hash bcrypt válido gerado a partir de senha vazia.',
    'Cria e administra tenants de teste dedicados em infraestrutura multi-tenant e participa de decisões de segurança relacionadas a ambientes, credenciais e pipelines.',
  ],
}

export const pastRoles: PastRole[] = [
  {
    company: 'UNESP - Universidade Estadual Paulista "Júlio de Mesquita Filho"',
    location: 'Marília, SP',
    title: 'Estagiário',
    period: 'set 2022 - fev 2023',
    modality: 'Presencial',
  },
  {
    company: 'Entrevias Concessionária de Rodovias S.A.',
    location: 'Marília, SP',
    title: 'Jovem Aprendiz - TI',
    period: 'set 2019 - mar 2020',
    modality: 'Presencial',
  },
]

export const projects: Project[] = [
  {
    name: 'CI Failure Intelligence',
    tag: 'Autoria solo',
    description:
      'Framework de investigação estruturada pós-falha de CI para Claude Code e Cursor. Recebe PR, log de CI ou issue do Linear, identifica causa raiz, diferencia falha de código de teste desatualizado, sinaliza ausência de cobertura E2E e recomenda a próxima ação.',
    highlights: [
      'Mais de 70 testes automatizados',
      'Validado em dois pilotos reais',
      'Aprovação humana obrigatória',
      'Allowlist / denylist + kill switch',
      'Rate limit + audit log',
    ],
    stack: ['TypeScript', 'Claude Code', 'Cursor', 'CI/CD'],
  },
  {
    name: 'Alert Data Integrity',
    tag: 'Auditoria e monitoramento de KPIs',
    description:
      'CLI em TypeScript e PostgreSQL que auditou um dump de 8,7 GB do Metabase e encontrou 262 divergências reais em 162 cards analisados, sendo 76 de alto risco, distribuídas em 30 grupos de KPI. Evoluiu para um serviço de monitoramento contínuo.',
    highlights: [
      '8,7 GB analisados',
      '262 divergências encontradas',
      '76 de alto risco',
      '30 grupos de KPI',
      'Alertas contínuos no Slack',
    ],
    stack: ['TypeScript', 'PostgreSQL', 'Docker', 'Slack API'],
  },
  {
    name: 'Automated Tests — CI com Cypress no AWS EKS',
    tag: 'PRs #317 e #318',
    description:
      'Participou da implementação da nova arquitetura de CI. A suíte Cypress, antes restrita ao ambiente local, passou a executar como Job Kubernetes no EKS, com imagem Docker, upload de evidências no S3 e remapeamento de variáveis.',
    highlights: [
      'Migrou execução local -> Job Kubernetes',
      'Evidências versionadas no S3',
      'Classificação de credenciais teste/produção',
      'Incorporado à branch principal',
    ],
    stack: ['Cypress', 'Docker', 'Kubernetes', 'AWS EKS', 'S3'],
  },
]

export const skillGroups: SkillGroup[] = [
  {
    title: 'QA e Testes',
    command: 'qa --list',
    skills: [
      'Playwright',
      'Cypress',
      'Testes E2E',
      'Testes de API',
      'Regressão',
      'Planos de teste',
      'Evidências',
      'Análise de causa raiz',
    ],
  },
  {
    title: 'Desenvolvimento',
    command: 'dev --list',
    skills: ['TypeScript', 'JavaScript', 'PHP', 'Laravel', 'Vue.js', 'SQL', 'PostgreSQL'],
  },
  {
    title: 'Infraestrutura e Dados',
    command: 'infra --list',
    skills: ['Docker', 'Kubernetes', 'AWS EKS', 'S3', 'Linux', 'Redis', 'CI/CD', 'GitHub Actions', 'Slack'],
  },
  {
    title: 'IA Aplicada à Engenharia',
    command: 'ai --list',
    skills: [
      'Claude Code',
      'Cursor',
      'Desenvolvimento de skills',
      'Human-in-the-loop',
      'Audit log',
      'Rate limit',
      'Kill switch',
    ],
  },
]

export const education: Education = {
  degree: 'Tecnologia em Análise e Desenvolvimento de Sistemas',
  institution: 'Universidade de Marília - UNIMAR',
  period: 'jan 2022 - dez 2025',
  status: 'Concluído',
}
