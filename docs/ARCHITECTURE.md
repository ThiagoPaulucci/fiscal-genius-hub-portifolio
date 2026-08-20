# Architecture

This public repository is a sanitized portfolio snapshot of a larger private application.

## Layers

- **React + TypeScript** for the client application and role-specific dashboards.
- **Supabase Auth** for session management, OAuth, magic links and password flows.
- **PostgreSQL + RLS** for tenant-aware data access and authorization rules.
- **Edge Functions** for server-side integrations and operations that must not run in the browser.
- **OCR / QR processing** for fiscal-document ingestion and validation.
- **Reporting and exports** for accountant, company and administrative workflows.

## Public-repository policy

Production environment values, service-role credentials, payment-provider secrets, deployed endpoint configuration and private operational data are intentionally excluded. The Supabase client in this repository reads its public configuration from local environment variables rather than embedding a project URL or key in source code.

The private production repository remains separate from this portfolio snapshot.
