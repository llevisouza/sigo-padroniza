# Publicação no GitHub

## Objetivo

Este documento descreve como manter o repositório publicável sem expor dados operacionais de alunos e sem criar ambiguidade sobre o comportamento da aplicação.

## Estado atual do projeto

- Aplicação client-side em React + Vite
- Processamento executado no navegador do usuário
- Sem persistência automática em servidor ou banco de dados
- Publicação estática preparada para GitHub Pages

## Risco principal

O maior risco do projeto não está no código estático em si, mas no material local usado para teste e referência.

Arquivos TXT de operação podem conter:

- matrícula
- nome
- nome da mãe
- RG
- CPF
- endereço
- CEP
- outros dados pessoais

Por isso, material local de referência deve permanecer fora do versionamento.

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

## O que não deve subir

- `archive/`
- `node_modules/`
- `dist/`
- `coverage/`
- `output/`
- `.playwright-cli/`
- arquivos `.env`
- logs e artefatos temporários
- bases reais exportadas por instituições

## GitHub Pages

O deploy atual usa GitHub Actions com publicação em GitHub Pages.

Arquivos relevantes:

- workflow: `.github/workflows/deploy-pages.yml`
- configuração do `base path`: `vite.config.ts`

URL atual:

- `https://llevisouza.github.io/sigo-padroniza/`

## Mensagem obrigatória ao usuário

A interface e a documentação devem deixar claro que:

- o sistema não guarda automaticamente a base do usuário em servidor
- a sessão pode ser perdida ao fechar ou recarregar a página
- o usuário precisa exportar e guardar o arquivo saneado por conta própria

Isso evita expectativa errada de persistência e reduz risco operacional.

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

## Observação

GitHub Pages é adequado para a versão atual porque a aplicação é estática e o processamento ocorre no navegador. Se no futuro houver autenticação, persistência real, trilha de auditoria ou compartilhamento entre instituições, o modelo de hospedagem precisará ser revisto.
