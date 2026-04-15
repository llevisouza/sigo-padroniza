# Publicacao no GitHub

## Objetivo

Este documento descreve como manter o repositório publicavel sem expor dados operacionais de alunos e sem criar ambiguidade sobre o comportamento da aplicacao.

## Estado atual do projeto

- Aplicacao client-side em React + Vite
- Processamento executado no navegador do usuario
- Sem persistencia automatica em servidor ou banco de dados
- Publicacao estatica preparada para GitHub Pages

## Risco principal

O maior risco do projeto nao esta no codigo estatico em si, mas no material local usado para teste e referencia.

Arquivos TXT de operacao podem conter:

- matricula
- nome
- nome da mae
- RG
- CPF
- endereco
- CEP
- outros dados pessoais

Por isso, material local de referencia deve permanecer fora do versionamento.

## O que deve subir

- `src/`
- `public/`
- `tests/`
- `scripts/`
- `index.html`
- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `tsconfig.json`
- `README.md`
- `.gitignore`
- `.github/workflows/`
- `docs/`

## O que nao deve subir

- `archive/`
- `node_modules/`
- `dist/`
- `coverage/`
- `output/`
- `.playwright-cli/`
- arquivos `.env`
- logs e artefatos temporarios
- bases reais exportadas por instituicoes

## GitHub Pages

O deploy atual usa GitHub Actions com publicacao em GitHub Pages.

Arquivos relevantes:

- workflow: `.github/workflows/deploy-pages.yml`
- configuracao do `base path`: `vite.config.ts`

URL atual:

- `https://llevisouza.github.io/sigo-padroniza/`

## Mensagem obrigatoria ao usuario

A interface e a documentacao devem deixar claro que:

- o sistema nao guarda automaticamente a base do usuario em servidor
- a sessao pode ser perdida ao fechar ou recarregar a pagina
- o usuario precisa exportar e guardar o arquivo saneado por conta propria

Isso evita expectativa errada de persistencia e reduz risco operacional.

## Checklist antes de publicar

1. Conferir `git status`.
2. Garantir que nenhum dataset local foi adicionado.
3. Rodar:

```bash
npm run lint
npm test
npm run build
```

4. Revisar o `README.md`.
5. Confirmar que o GitHub Pages continua habilitado no repositório.

## Observacao

GitHub Pages e adequado para a versao atual porque a aplicacao e estatica e o processamento ocorre no navegador. Se no futuro houver autenticacao, persistencia real, trilha de auditoria ou compartilhamento entre instituicoes, o modelo de hospedagem precisara ser revisto.
