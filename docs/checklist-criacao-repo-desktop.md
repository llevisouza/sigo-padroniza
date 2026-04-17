# Checklist rápido (10 minutos) — criar repo desktop Java

Objetivo: criar o repositório `sigo-padroniza-desktop-java` sem impactar o site atual.

Repositório oficial: https://github.com/llevisouza/sigo-padroniza-desktop-java

## 1) Pré-requisitos (1 min)
- Ter acesso ao GitHub (usuário ou organização).
- Ter `git` instalado.
- Opcional: `gh` autenticado (`gh auth login`).

## 2) Criar repositório no GitHub (2 min)
### Opção A — via interface web
1. Acesse: https://github.com/new
2. Nome: `sigo-padroniza-desktop-java`
3. Visibilidade: **Private** (recomendado no início)
4. Não marcar README/gitignore/license (vamos versionar localmente)
5. Clique em **Create repository**.

### Opção B — via CLI
```bash
gh repo create llevisouza/sigo-padroniza-desktop-java --private --description "Versão desktop Java do SIGO"
```

## 3) Inicializar estrutura local (3 min)
```bash
mkdir sigo-padroniza-desktop-java
cd sigo-padroniza-desktop-java
git init -b main
mkdir -p src/main/java src/main/resources src/test/java docs
cat > README.md <<'MD'
# SIGO Padroniza Desktop (Java)
Aplicação desktop Java para processamento, validação, ajustes e exportação.
MD
```

## 4) Conectar remoto e publicar (2 min)
```bash
git remote add origin git@github.com:llevisouza/sigo-padroniza-desktop-java.git
git add .
git commit -m "chore: bootstrap do projeto desktop Java"
git push -u origin main
```

## 5) Proteções mínimas (1 min)
- Ativar branch protection em `main`:
  - Require pull request before merging.
  - Require status checks to pass.
- Ativar Dependabot security updates.

## 6) Próximo passo imediato (1 min)
Abrir a primeira issue: **"Scaffold JavaFX + Gradle + CI"**, contendo:
- Java 21
- JavaFX
- Gradle wrapper
- JUnit 5
- Pipeline CI (build + test)

---

## Comandos de validação
```bash
git remote -v
git branch --show-current
git log --oneline -n 1
```
