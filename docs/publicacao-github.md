# Publicação no GitHub

## Diagnóstico do projeto

O repositório está apto para publicação técnica, com estes pontos relevantes:

- A aplicação compila e testa localmente.
- O código está organizado em `components`, `hooks`, `types` e `utils`.
- O `README` agora descreve o produto real, não mais o template original.
- O `.gitignore` foi endurecido para evitar subir artefatos locais.

## Risco principal identificado

O diretório `archive/` contém arquivos TXT grandes usados como referência local.

Pelo domínio do sistema e pela análise do parser, esses arquivos têm alta probabilidade de conter dados reais ou sensíveis de alunos, como matrícula, nome, nome da mãe, CEP e CPF. Por isso, `archive/` foi excluído do versionamento.

## O que deve subir

- `src/`
- `public/`
- `scripts/`
- `tests/`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.ts`
- `index.html`
- `README.md`
- `.gitignore`
- `.env.example` apenas se continuar útil

## O que não deve subir

- `node_modules/`
- `dist/`
- `output/`
- `*.log`
- arquivos `.env`
- datasets e materiais locais em `archive/`

## Checklist antes do push

1. Verificar `git status`.
2. Confirmar que `archive/` está fora do staging.
3. Rodar:

```bash
npm run lint
npm test
npm run build
npm run check:roundtrip
```

4. Revisar se o nome e a descrição do repositório no GitHub estão corretos.
5. Definir a licença do projeto.

## Bloqueio atual para publicação

O GitHub CLI (`gh`) está instalado, mas a autenticação local está inválida. Enquanto isso não for corrigido, o repositório pode ser preparado localmente, mas não pode ser criado/pushado no GitHub.

Comando esperado para corrigir:

```bash
gh auth login -h github.com
```

Depois disso, a publicação pode seguir com:

```bash
git init -b main
git add .
git commit -m "Prepare repository for GitHub"
gh repo create <nome-do-repo> --source . --private --push
```
