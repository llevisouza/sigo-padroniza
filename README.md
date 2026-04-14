# SIGO Padroniza

Aplicação web para importar, revisar, corrigir e exportar arquivos TXT no leiaute fixo usado pelo fluxo de saneamento do SIGO/SETPS.

## O que o sistema faz

- Importa arquivos `.txt` em lote no leiaute de 525 posições.
- Tenta decodificar corretamente arquivos UTF-8 e legados em ISO-8859-1.
- Valida campos obrigatórios, regras cadastrais e pendências de padronização.
- Permite correções visíveis pelo usuário, com histórico de ajustes e reversão.
- Exporta novamente no mesmo leiaute fixo, sem aplicar correções silenciosas.
- Gera relatório de pendências existentes no momento da exportação.

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
  hooks/        estado principal da aplicação
  types/        contratos de domínio e UI
  utils/        parser, validator, exportação e paginação
scripts/        verificações auxiliares
tests/          testes automatizados
public/         ativos estáticos
```

## Fluxo funcional

1. O usuário importa um ou mais arquivos TXT.
2. O parser reconstrói os registros conforme o leiaute fixo.
3. A validação separa erros bloqueantes, avisos e ajustes sugeridos.
4. O usuário corrige manualmente por registro ou em lote.
5. Cada ajuste manual entra no relatório e pode ser revertido.
6. A exportação gera um novo TXT com 525 colunas por linha.

## Scripts

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
npm run check:roundtrip
```

## Testes atuais

- `parser`: roundtrip e recuperação de CEP mascarado
- `validator`: regras obrigatórias e mensagens de ajuste
- `adjustmentHistory`: histórico, reversão e estatísticas
- `pagination`: paginação do relatório

## Segurança e privacidade

- Este repositório **não deve** subir arquivos reais de alunos.
- O diretório `archive/` está no `.gitignore` por conter material local de referência e potenciais dados sensíveis.
- Logs, builds, caches e arquivos `.env` também ficam fora do versionamento.

## Variáveis de ambiente

Nenhuma variável é obrigatória para rodar a versão atual localmente.

## Publicação

Antes de publicar:

1. Confirme que não há dados reais fora do `.gitignore`.
2. Rode `npm run lint`, `npm test` e `npm run build`.
3. Revise o arquivo [`docs/publicacao-github.md`](docs/publicacao-github.md).

## Licença

Definir conforme a política do projeto antes da publicação pública.
