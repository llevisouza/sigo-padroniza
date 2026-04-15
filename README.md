<div align="center">

# SIGO Padroniza

**Ferramenta de saneamento e padronização de bases educacionais no leiaute fixo SIGO/SETPS.**

<br/>

[![React](https://img.shields.io/badge/React-19-087EA4?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Motion](https://img.shields.io/badge/Motion-12-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev/)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white)](https://llevisouza.github.io/sigo-padroniza/)

</div>

<br/>

## 📋 Sobre o Projeto

O **SIGO Padroniza** é uma aplicação web voltada para importação, revisão, correção e exportação de arquivos `.txt` no leiaute fixo de 525 posições utilizado no fluxo educacional do SIGO/SETPS.

Foi projetado para o saneamento operacional de bases grandes, permitindo que operadores identifiquem e corrijam inconsistências de forma rápida e assistida, sem necessidade de infraestrutura de servidor.

<br/>

## ✨ Funcionalidades

| Recurso | Descrição |
|---------|-----------|
| **Importação** | Leitura de arquivos `.txt` com reconstrução automática dos registros |
| **Validação** | Identificação de erros, avisos e ajustes automáticos possíveis |
| **Correção assistida** | Edição manual com sugestões contextuais por campo |
| **Ajuste em lote** | Aplicação de correções automáticas para campos padronizáveis |
| **Histórico de ajustes** | Registro completo com possibilidade de reversão individual |
| **Exportação** | Geração de arquivo `.txt` no padrão do leiaute fixo |
| **Relatório de pendências** | Resumo do que permaneceu pendente no momento da exportação |
| **Busca e filtros** | Localização rápida de registros por campo ou tipo de pendência |

<br/>

## 🔄 Fluxo de Trabalho

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐     ┌───────────────┐
│  Importação  │────▶│   Validação   │────▶│  Correção / Ajuste│────▶│  Exportação   │
│  de arquivo  │     │  automática   │     │  manual ou lote   │     │  TXT final    │
└─────────────┘     └──────────────┘     └──────────────────┘     └───────────────┘
                                                                          │
                                                                          ▼
                                                                  ┌───────────────┐
                                                                  │   Relatório    │
                                                                  │  de pendências │
                                                                  └───────────────┘
```

<br/>

## 🛠️ Stack Técnica

| Camada | Tecnologia | Versão | Finalidade |
|--------|-----------|--------|------------|
| **UI** | React | 19 | Componentes e renderização |
| **Linguagem** | TypeScript | 5.8 | Tipagem estática e contratos |
| **Build** | Vite | 6 | Bundler e servidor de desenvolvimento |
| **Estilos** | Tailwind CSS | 4 | Estilização utilitária |
| **Animações** | Motion | 12 | Transições e micro-animações |
| **Ícones** | Lucide React | — | Iconografia consistente |
| **Testes** | Node Test Runner + TSX | — | Testes automatizados |
| **Deploy** | GitHub Actions + Pages | — | CI/CD e hospedagem estática |

<br/>

## 📁 Estrutura do Projeto

```
sigo-padroniza/
├── src/
│   ├── components/          # Componentes da interface
│   │   ├── AppHeader.tsx            # Cabeçalho com busca e ações
│   │   ├── DashboardSidebar.tsx     # Painel lateral com upload
│   │   ├── FormAluno.tsx            # Formulário de edição de registro
│   │   ├── TabelaAlunos.tsx         # Tabela principal de registros
│   │   ├── WorkspaceView.tsx        # Área central com abas
│   │   ├── ValidationBanner.tsx     # Banner de status da validação
│   │   ├── ExportModal.tsx          # Modal de confirmação de exportação
│   │   └── ...
│   ├── hooks/
│   │   └── useAlunoWorkspace.ts     # Estado central da aplicação
│   ├── types/                       # Contratos de domínio e UI
│   ├── utils/                       # Lógica de negócio
│   │   ├── parser.ts                # Parser do leiaute fixo (525 posições)
│   │   ├── validator.ts             # Regras de validação obrigatória
│   │   ├── generator.ts             # Geração do TXT de saída
│   │   ├── adjustments.ts           # Motor de ajustes automáticos
│   │   ├── adjustmentHistory.ts     # Controle de histórico e reversão
│   │   └── ...
│   ├── App.tsx
│   └── main.tsx
├── tests/                   # Testes automatizados
├── scripts/                 # Scripts de verificação auxiliar
├── docs/                    # Documentação complementar
├── public/                  # Ativos estáticos
└── .github/workflows/       # Pipeline de deploy
```

<br/>

## 🚀 Como Executar

### Pré-requisitos

- **Node.js** 18+
- **npm** 9+

### Instalação

```bash
git clone https://github.com/llevisouza/sigo-padroniza.git
cd sigo-padroniza
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse em `http://localhost:3000`.

### Build de produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

<br/>

## 🧪 Testes e Qualidade

```bash
# Verificação de tipos
npm run lint

# Testes automatizados
npm test

# Verificação de roundtrip (importação → exportação)
npm run check:roundtrip
```

**Cobertura dos testes:**

- Parser e reconstrução de registros no leiaute fixo
- Validação de campos obrigatórios
- Ajustes automáticos e apresentação contextual
- Histórico de ajustes e reversão
- Paginação do relatório de pendências
- Integridade do roundtrip (importar → exportar → reimportar)

<br/>

## 🌐 Deploy

O deploy é feito automaticamente via **GitHub Actions** para o **GitHub Pages**.

| Item | Valor |
|------|-------|
| **Workflow** | `.github/workflows/deploy-pages.yml` |
| **Trigger** | Push na branch principal |
| **URL** | [llevisouza.github.io/sigo-padroniza](https://llevisouza.github.io/sigo-padroniza/) |

> O `base path` é ajustado automaticamente quando o build roda no ambiente do GitHub Actions.

<br/>

## ⚠️ Sobre Armazenamento

> **Importante:** O SIGO Padroniza processa todos os dados **exclusivamente no navegador**.

- Não existe persistência automática em servidor ou banco de dados.
- Fechar ou recarregar a página descarta o trabalho em andamento.
- O usuário **deve exportar** o arquivo `.txt` e manter sua própria cópia saneada.

Esse comportamento é intencional — reduz custos de infraestrutura e elimina a necessidade de autenticação — mas exige disciplina operacional por parte do usuário.

<br/>

## 🔒 Segurança e Privacidade

- **Não suba** arquivos reais de alunos para o repositório.
- O diretório `archive/` está fora do versionamento.
- Logs, artefatos de build, caches e arquivos `.env` são ignorados pelo Git.
- Dados educacionais podem conter informações pessoais sensíveis (matrícula, CPF, RG, nome da mãe) — trate-os com o devido cuidado.

<br/>

## 📌 Boas Práticas de Uso

1. Trabalhe sempre com uma **cópia** do arquivo original.
2. Revise as pendências antes de exportar.
3. Exporte ao final de cada lote relevante de correções.
4. Mantenha controle próprio dos arquivos saneados gerados.
5. Não use a aplicação como repositório permanente de dados.

<br/>

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [`docs/publicacao-github.md`](docs/publicacao-github.md) | Guia de publicação e checklist de segurança |

<br/>

## 🔗 Links

| | |
|---|---|
| **Repositório** | [github.com/llevisouza/sigo-padroniza](https://github.com/llevisouza/sigo-padroniza) |
| **Aplicação** | [llevisouza.github.io/sigo-padroniza](https://llevisouza.github.io/sigo-padroniza/) |

<br/>

## 📄 Licença

A definir conforme a política do projeto antes de distribuição pública.
