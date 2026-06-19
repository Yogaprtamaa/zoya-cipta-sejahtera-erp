# Zoya Cipta ERP - Project Instructions

## Overview
Zoya Cipta ERP is a comprehensive ERP system prototype built with Next.js. It features a single-shell architecture (`ZoyaErpShell`) that manages multiple modules (Agent, Admin, Director, Maklon, etc.) within a unified interface.

## Architecture
- **Framework**: Next.js 15 (App Router)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data Access**: Repository Pattern (Contracts in `src/repositories/contracts`, implementations in `http` and `mock`).

## Directory Structure
- `src/app`: Next.js routing. Most routes are handled by the `[...slug]` catch-all which renders the `ZoyaErpShell`.
- `src/features`: Modular functionality. `zoya-erp` contains the main shell logic.
- `src/repositories`: Abstraction layer for data fetching.
- `src/stores`: Zustand stores for global state (e.g., `demo-control-store.ts`).
- `src/types`: TypeScript definitions for domain entities.
- `src/mocks`: Fixtures and scenario data for the prototype.

## Development Guidelines
- **Shell-First**: Most UI changes should be made within `src/features/zoya-erp/zoya-erp-shell.tsx` or its sub-components.
- **Mock-Driven**: During prototype phase, prefer updating `src/repositories/mock` and `src/mocks/fixtures`.
- **Type Safety**: Always define domain types in `src/types/domain.ts` before implementation.
- **RTK Integration**: This project uses the `rtk` tool for workflow management. A Gemini CLI hook is installed via `rtk init -g --gemini`.

## Common Commands
- `npm run dev`: Start development server.
- `rtk`: Use for project-specific workflow commands (if any).
