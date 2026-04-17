# Planejamento de recriação do sistema em Java Desktop

## 1) Objetivo
Recriar o sistema atual (web em React + TypeScript) como uma aplicação desktop Java, preservando:
- fluxo de upload e parsing de dados;
- validação e ajuste de alunos;
- paginação e visualização da tabela;
- histórico de ajustes;
- exportação e preparação de saída.

## 2) Escopo funcional a migrar (mapeamento inicial)
Com base na estrutura atual do projeto:
- **Entrada e parsing**: `Upload.tsx`, `parser.ts`.
- **Validação**: `validator.ts`, `ValidationBanner.tsx`.
- **Edição de dados**: `FormAluno.tsx`, `adjustments.ts`.
- **Histórico de alterações**: `adjustmentHistory.ts`, `adjustmentPresentation.ts`.
- **Tabela e paginação**: `TabelaAlunos.tsx`, `pagination.ts`, `reportPagination.test.ts`.
- **Exportação**: `ExportModal.tsx`, `exportPreparation.ts`, `generator.ts`.
- **Estado da aplicação**: `useAlunoWorkspace.ts`, `App.tsx`.

## 3) Arquitetura proposta (Java Desktop)
### Stack recomendada
- **Java 21 (LTS)**
- **JavaFX** para UI desktop (tabelas, formulários, modais e navegação)
- **Gradle** para build e empacotamento
- **JUnit 5** para testes
- **Jackson** (JSON) e **Apache POI** (se houver necessidade de planilhas)

### Organização de camadas
- `domain`: entidades (`Aluno`, regras de negócio, validações)
- `application`: casos de uso (importar, validar, ajustar, exportar)
- `infrastructure`: parser, geradores de arquivo, persistência local
- `ui`: telas JavaFX e controladores

## 4) Estratégia de migração (evitar retrabalho)
1. **Congelar regras de negócio em testes** no projeto atual (golden tests com entradas/saídas esperadas).
2. **Portar primeiro o core** (sem UI): parser, validação, ajustes, exportação.
3. **Criar UI mínima funcional** (upload + tabela + validação).
4. **Adicionar edição e histórico**.
5. **Completar exportação e refinamentos UX**.
6. **Homologar com usuários-chave** comparando resultados com a versão web.

## 5) Roadmap por fases
### Fase 0 — Descoberta (2 a 4 dias)
- Levantar fluxos críticos e regras implícitas.
- Definir formato oficial de entrada e saída.
- Criar matriz de paridade (Web x Desktop).

### Fase 1 — Núcleo de domínio (1 a 2 semanas)
- Implementar modelos de domínio em Java.
- Portar parser, validações e ajustes.
- Cobrir com testes unitários e de regressão.

### Fase 2 — UI base (1 semana)
- Tela principal com upload e tabela paginada.
- Indicadores de validação e filtros básicos.

### Fase 3 — Edição e histórico (1 semana)
- Formulário de edição de aluno.
- Linha do tempo/histórico de ajustes.

### Fase 4 — Exportação e distribuição (1 semana)
- Geração de saída equivalente à web.
- Empacotar para Windows/macOS/Linux (jpackage).

### Fase 5 — Estabilização (3 a 5 dias)
- Teste de aceitação com dados reais.
- Correções de borda e otimização de performance.

## 6) Backlog técnico inicial
- [ ] Estruturar projeto Gradle multi-módulo (`domain`, `app`, `ui`).
- [ ] Definir contrato de parser (input válido/inválido).
- [ ] Implementar motor de validação com códigos de erro padronizados.
- [ ] Implementar serviço de ajustes com trilha de auditoria.
- [ ] Implementar paginação e ordenação consistente.
- [ ] Implementar exportação determinística (mesma entrada => mesma saída).
- [ ] Criar suíte de testes de paridade com snapshots.
- [ ] Configurar CI para build + testes + artefatos.

## 7) Critérios de aceite (paridade)
- Mesmo arquivo de entrada gera mesma contagem de registros válidos/inválidos.
- Mesmas regras de validação disparam os mesmos códigos/mensagens.
- Ajustes manuais refletem na saída final com rastreabilidade.
- Exportação compatível com o processo atual de consumo.
- Tempo de processamento aceitável para lotes típicos.

## 8) Riscos e mitigação
- **Regras implícitas no front**: mitigar com testes de regressão antes da migração.
- **Diferenças de locale/encoding**: padronizar UTF-8 e normalização de strings.
- **Divergência na exportação**: usar testes de snapshot binário/textual.
- **Adoção pelos usuários**: executar piloto com feedback rápido.

## 9) Entregáveis
- Documento de arquitetura Java Desktop.
- Aplicação desktop instalável.
- Suíte de testes de paridade web x desktop.
- Guia de operação e troubleshooting.

## 10) Próximos passos práticos
1. Criar uma PoC em JavaFX com upload + tabela (2 dias).
2. Portar parser e validação com testes de paridade (3 a 5 dias).
3. Validar PoC com 2 datasets reais e ajustar regras.
4. Aprovar plano final de desenvolvimento por sprint.

## 11) Estratégia de repositório separado (site continua no ar)
Para manter o site atual em produção sem interrupção, o desktop deve nascer em um repositório independente.

### Estrutura recomendada
- Repositório atual (`sigo-padroniza`): continua com o front web e correções de produção.
- Novo repositório (sugestão): `sigo-padroniza-desktop-java`.

### Passo a passo (GitHub)
1. Criar o novo repositório no GitHub (privado inicialmente).
2. Criar projeto Java base (Gradle + JavaFX) no novo repo.
3. Copiar apenas documentação e artefatos de paridade necessários (sem acoplar deploy web).
4. Configurar CI/CD independente para build desktop.
5. Publicar releases desktop por versão (sem impacto no site).

### Comandos sugeridos (quando autenticado com GitHub CLI)
```bash
# 1) criar repo remoto
gh repo create llevisouza/sigo-padroniza-desktop-java --private --description "Versão desktop Java do SIGO" --clone

# 2) entrar no repo local recém-clonado
cd sigo-padroniza-desktop-java

# 3) estrutura inicial
mkdir -p src/main/java src/test/java docs
cat > README.md <<'MD'
# SIGO Padroniza Desktop (Java)
Aplicação desktop Java para processamento, validação, ajustes e exportação de dados.
MD

# 4) primeiro commit
git add .
git commit -m "chore: inicializa repositório Java desktop"
git push -u origin main
```

### Governança entre repos
- Manter uma matriz de paridade funcional entre `web` e `desktop`.
- Versionar regras de negócio com testes de regressão em ambos.
- Definir um calendário de sincronização quinzenal de regras críticas.


> Repositório desktop definido: https://github.com/llevisouza/sigo-padroniza-desktop-java
