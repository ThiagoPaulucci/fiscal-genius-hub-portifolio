# Fiscal Genius Hub

Snapshot técnico saneado de uma plataforma web para organização e processamento inteligente de documentos fiscais, com arquitetura pensada para usuários, empresas, contadores, lojistas, afiliados e administração.

> **Portfólio público:** este repositório não é um espelho do ambiente de produção. Ele apresenta arquitetura e módulos representativos do projeto, enquanto histórico privado, schema produtivo, credenciais, configurações de deploy, dados operacionais e partes proprietárias permanecem fora do repositório público.

## Visão geral

O projeto privado completo reúne autenticação, leitura de documentos, dashboards por perfil, relatórios, administração, cashback e recursos para contadores e lojistas. Esta versão pública foi separada do histórico original e preparada especificamente para avaliação técnica e portfólio.

## O que este snapshot demonstra

- autenticação e gerenciamento de sessão com Supabase;
- configuração por variáveis de ambiente, sem credenciais embutidas;
- OCR com fallback e detecção de documentos fiscais;
- leitura de texto de PDFs;
- validação inicial de arquivos fiscais;
- regras fiscais de referência;
- organização React + TypeScript com separação entre contexto, serviços e integrações;
- desenho arquitetural para dashboards multi-perfil, RLS e Edge Functions.

## Funcionalidades do produto completo

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

**Front-end:** React 18, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS, shadcn/ui / Radix UI, React Hook Form, Zod e Zustand.

**Dados e backend:** Supabase, PostgreSQL, Row Level Security (RLS), Supabase Auth e Edge Functions.

**Documentos:** Tesseract.js, PDF.js, jsPDF, JSZip e processamento de QR Code.

**Visualização:** Recharts e html2canvas.

## Arquitetura

```text
Usuário
  │
  ▼
React + TypeScript
  │
  ├── Autenticação e controle de sessão
  ├── Dashboards e interfaces por perfil
  ├── Scanner / OCR / processamento de documentos
  │
  ▼
Supabase
  ├── PostgreSQL
  ├── Row Level Security
  ├── Storage
  ├── Auth
  └── Edge Functions
```

Mais detalhes estão em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Segurança e sanitização

O repositório público possui `.env` e variantes bloqueados no `.gitignore`. O `.env.example` contém apenas placeholders. A configuração do cliente Supabase utiliza `import.meta.env` e não contém URL ou chave do projeto original.

O histórico do projeto privado **não foi importado**, justamente para evitar que arquivos de ambiente existentes em commits antigos fossem recuperáveis neste repositório.

Também foram omitidos deliberadamente schema de produção, chaves service-role, configurações de provedores de pagamento, dados reais e parâmetros operacionais de deploy.

## Estrutura pública

```text
src/
├── contexts/
│   └── AuthContext.tsx
├── data/
│   └── fiscalRules.ts
├── integrations/
│   └── supabase/
│       ├── client.ts
│       └── types.ts
└── services/
    └── ocr/
        ├── notaFiscalValidator.ts
        ├── ocrService.ts
        └── pdfText.ts

docs/
└── ARCHITECTURE.md
```

## Executando o snapshot

Crie um projeto Supabase de desenvolvimento próprio e configure as variáveis locais:

```bash
git clone <repository-url>
cd fiscal-genius-hub-portifolio
npm install
cp .env.example .env
npm run dev
```

O schema completo do banco de produção não acompanha este snapshot. Para expandir a demonstração, gere seus próprios tipos e tabelas em um ambiente Supabase de desenvolvimento.

## Autor

**Thiago Paulucci**  
Software & AI Engineering

---

Projeto apresentado para fins de portfólio e demonstração técnica. O produto e o repositório de produção permanecem privados.
