# SIGO Padroniza

Aplicacao web para importar, revisar, corrigir e exportar arquivos TXT no leiaute fixo usado no fluxo educacional do SIGO/SETPS.

## Visao geral

O projeto foi desenhado para saneamento operacional de bases grandes, com foco em:

- importacao de arquivos `.txt`
- validacao de campos obrigatorios e pendencias de padronizacao
- correcao manual assistida
- exportacao final no layout fixo
- relatorio de ajustes e pendencias

## Como o sistema funciona

1. O usuario importa um ou mais arquivos TXT.
2. O parser reconstrui os registros no leiaute de 525 posicoes.
3. A validacao identifica erros, avisos e ajustes automaticos possiveis.
4. O usuario revisa e corrige os registros na interface.
5. A exportacao gera um novo TXT no padrao do layout.
6. O relatorio registra o que ainda estava pendente no momento da exportacao.

## Regra importante sobre armazenamento

O sistema atual processa os dados no navegador.

- Nao existe persistencia automatica em servidor ou banco externo.
- Arquivos importados e alteracoes feitas na tela ficam apenas na sessao atual.
- Fechar, recarregar a pagina ou trocar de dispositivo pode descartar o trabalho em andamento.
- Para preservar o resultado, o usuario deve exportar o TXT e guardar sua propria copia saneada.

Esse comportamento e intencional no estado atual do projeto e reduz custo de infraestrutura, mas exige disciplina operacional de exportacao e backup pelo usuario.

## Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- Motion

## Estrutura principal

```text
src/
  components/   interface e fluxos visuais
  hooks/        estado principal da aplicacao
  types/        contratos de dominio e UI
  utils/        parser, validator, exportacao e regras auxiliares
tests/          testes automatizados
scripts/        verificacoes de apoio
public/         ativos estaticos
```

## Scripts

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
npm run check:roundtrip
```

## Qualidade e validacao

O projeto possui verificacoes automatizadas para:

- parser e roundtrip de exportacao
- validator e regras obrigatorias
- historico de ajustes e reversao
- rotulos contextuais de ajuste
- paginação do relatorio

Antes de publicar qualquer mudanca:

```bash
npm run lint
npm test
npm run build
```

## Publicacao atual

O repositório esta preparado para publicacao estatica.

- Build: `npm run build`
- Saida: `dist/`
- Deploy atual: GitHub Pages por GitHub Actions

Quando o build roda no GitHub Pages, o `base path` e ajustado automaticamente para o nome do repositorio.

## Seguranca e privacidade

- Nao suba arquivos reais de alunos para o repositório.
- O diretorio `archive/` esta fora do versionamento.
- Logs, artefatos de build, caches locais e arquivos `.env` tambem ficam fora do Git.
- O uso operacional deve considerar que dados educacionais podem conter informacoes pessoais sensiveis.

## Recomendacoes operacionais

- Trabalhe sempre com copia local do arquivo original.
- Revise as pendencias antes de exportar.
- Exporte ao final de cada lote relevante de correcoes.
- Mantenha controle proprio dos arquivos saneados gerados.
- Nao trate a aplicacao atual como repositorio permanente de dados.

## Repositorio

- GitHub: `https://github.com/llevisouza/sigo-padroniza`
- GitHub Pages: `https://llevisouza.github.io/sigo-padroniza/`

## Licenca

Definir conforme a politica do projeto antes de uma distribuicao publica mais ampla.
