# Frontend — Next.js + Tailwind CSS

## Visão Geral
Aplicação web construída em Next.js (v15.2.4) com foco em:
- **Componentização** atômica e reutilizável  
- **Design System** baseado em Radix UI + Tailwind CSS  
- **Form Handling** robusto com React Hook Form e Zod  
- **Tematização** dinâmica com Next Themes  
- **Visualização de Dados** via Recharts  
- **Acessibilidade** e performance

---

## Estrutura de Pastas

```
frontend/
├── .next/                  # Build e cache do Next.js
├── app/                    # Pastas e arquivos de rotas App Router
├── components/             # Componentes reutilizáveis
├── hooks/                  # Custom Hooks (ex: useTheme, useFetch)
├── lib/                    # Bibliotecas e abstração de dados
├── public/                 # Arquivos estáticos (imagens, ícones)
├── styles/                 # CSS global e arquivos Tailwind
├── .dockerignore
├── .gitignore
├── components.json         # Configurações de componentes ou storybook
├── Dockerfile
├── docker-compose.yaml
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Padrões e Bibliotecas

### Componentização e Design System
- **Radix UI**: primitives acessíveis (Accordion, Dialog, Popover etc.)  
- **Tailwind CSS** + **class-variance-authority**: criação de classes utilitárias e variantes de estilo.  
- **clsx**: composição condicional de classes.

### Tipagem e Validação
- **TypeScript** (v5): tipagem estática em toda a base de código.  
- **Zod**: schemas de validação para formular dados e garantir integridade.

### Form Handling
- **React Hook Form** + **@hookform/resolvers/zod**:  
  - Formulários performáticos e com validação declarativa via Zod.

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../utils/schemas";

const { register, handleSubmit, formState } = useForm({
  resolver: zodResolver(schema),
});
```

### Tematização
- **next-themes**: tema claro/escuro com persistência em localStorage e suporte a SSR.

```tsx
import { ThemeProvider } from "next-themes";

<ThemeProvider attribute="class">
  <Component {...pageProps} />
</ThemeProvider>
```

### Visualização de Dados
- **Recharts**: gráficos interativos (bar, line, pie) diretamente em React.

```tsx
<LineChart data={data}>
  <Line dataKey="value" />
</LineChart>
```

---

## Decisões Técnicas

1. **Isolamento de Lógica**  
   - **`lib/`** e **`services/`** para abstração de chamadas HTTP e lógica de negócio.  
   - **`hooks/`** para reutilização de lógica de estado.

2. **Performance**  
   - Híbrido SSR/SSG do Next.js para SEO e carregamento otimizado.  
   - **Dynamic Imports** para code-splitting.

3. **Estilo**  
   - **Tailwind CSS** customizado (`tailwind.config.ts`) para tema e breakpoints.  
   - **tailwind-merge** para mesclar classes quando necessário.

---

> **Observação**:  
> A quebra de componentes em átomos, moléculas e organismos via Atomic Design está em progresso e pode apresentar inconsistências.

---

## Contato

- Autor: Wellington Rangel  
