# Fiscal Genius Hub

Plataforma web para organização e processamento inteligente de documentos fiscais, com experiências específicas para usuários, empresas, contadores, lojistas, afiliados e administração.

> Projeto de portfólio com foco em engenharia de software, automação fiscal e processamento de documentos. Credenciais, segredos e configurações de produção não fazem parte deste repositório público.

## Visão geral

O Fiscal Genius Hub reúne diferentes fluxos de uma aplicação fiscal em uma única experiência: autenticação, leitura de documentos, dashboards por perfil, relatórios, administração, cashback e recursos voltados a contadores e lojistas.

A aplicação foi estruturada para separar responsabilidades entre interface, autenticação, dados e serviços de backend, mantendo regras de acesso adequadas aos diferentes perfis do sistema.

## Principais funcionalidades

- Autenticação de usuários e gerenciamento de sessão
- Login por e-mail, Magic Link e OAuth
- Leitura e processamento de documentos fiscais
- Scanner de QR Code
- Extração de informações de imagens e documentos
- Dashboards para pessoa jurídica e contador
- Área financeira e geração de relatórios
- Painel administrativo
- Gestão de usuários, notas, pagamentos e lojas
- Área de afiliados e comissões
- Painel dedicado a lojistas
- Configuração e acompanhamento de cashback
- Relatórios e acompanhamento de clientes
- Fluxos de onboarding e notificações

## Stack

### Front-end

- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui / Radix UI
- React Hook Form
- Zod
- Zustand

### Dados e backend

- Supabase
- PostgreSQL
- Row Level Security (RLS)
- Supabase Edge Functions
- Autenticação e controle de acesso por perfil

### Documentos e processamento

- Tesseract.js
- PDF.js
- jsPDF
- JSZip
- QR Code / barcode scanning

### Visualização

- Recharts
- html2canvas

## Arquitetura

```text
Usuário
  │
  ▼
React + TypeScript
  │
  ├── Autenticação e controle de sessão
  ├── Dashboards e interfaces por perfil
  ├── Scanner / processamento de documentos
  │
  ▼
Supabase
  ├── PostgreSQL
  ├── Row Level Security
  ├── Storage
  ├── Auth
  └── Edge Functions
```

O front-end utiliza TanStack Query para gerenciamento de dados assíncronos e React Router para os diferentes fluxos da aplicação. O backend utiliza os serviços do Supabase e funções server-side para operações que não devem ser executadas diretamente no navegador.

## Perfis e áreas da aplicação

- **Usuário:** autenticação, leitura de documentos, resultados e cashback.
- **Pessoa Jurídica:** dashboard e acompanhamento de informações fiscais.
- **Contador:** dashboard financeiro, clientes, relatórios, afiliados e comissões.
- **Lojista:** notas fiscais, cashback, relatórios e relacionamento com clientes.
- **Administrador:** usuários, documentos, pagamentos, lojas e indicadores financeiros.

## Segurança

O projeto utiliza mecanismos como Row Level Security (RLS), controle de acesso por perfil, proteção de operações sensíveis no backend, gerenciamento de sessão e tokens e variáveis de ambiente para configurações locais.

Arquivos `.env` são ignorados pelo Git. O arquivo `.env.example` contém somente os nomes e formatos esperados das variáveis, sem credenciais reais.

## Executando localmente

### Pré-requisitos

- Node.js
- npm
- projeto Supabase próprio para desenvolvimento

```bash
git clone <repository-url>
cd fiscal-genius-hub-portifolio
npm install
cp .env.example .env
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Estrutura do projeto

```text
src/
├── components/
├── contexts/
├── hooks/
├── pages/
│   ├── admin/
│   ├── contador/
│   └── lojista/
└── ...

supabase/
├── functions/
└── migrations/
```

## Objetivo do projeto

Este repositório demonstra a construção de uma aplicação full stack com múltiplos perfis, autenticação, banco relacional, processamento de documentos e integrações server-side. O foco do portfólio é apresentar decisões de arquitetura e implementação sem expor credenciais ou configurações privadas de produção.

## Autor

**Thiago Paulucci**  
Software & AI Engineering

---

Este projeto é apresentado para fins de portfólio e demonstração técnica.
