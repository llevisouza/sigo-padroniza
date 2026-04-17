# SIGO Padroniza Desktop (JavaFX)

Scaffold inicial da versão desktop com foco em qualidade de código e base de domínio.

## Stack
- Java 21
- JavaFX 21
- Gradle
- JUnit 5 + JaCoCo

## Estrutura inicial
- `com.sigopadroniza.desktop`: bootstrap da aplicação (`DesktopLauncher`, `SigoDesktopApp`)
- `com.sigopadroniza.desktop.ui`: composição da janela principal
- `com.sigopadroniza.desktop.domain`: entidades e códigos de validação
- `com.sigopadroniza.desktop.application`: serviços de regra de negócio (validação e ajustes)
- `com.sigopadroniza.desktop.application.importing`: parser de layout fixo + pipeline (parse -> ajustes -> validação)
- `com.sigopadroniza.desktop.application.exporting`: exportador de layout fixo (525 colunas)

## Executar localmente
```bash
gradle run
```

## Testes
```bash
gradle test
```

## Cobertura
```bash
gradle jacocoTestReport
```


## Regras já portadas
- Validação de campos obrigatórios
- Regras por idade (RG/certidão)
- Validação de CPF (tamanho + dígitos verificadores)
- Parser de layout fixo com tratamento de linhas fora do padrão

- Ajustes automáticos de padronização (acentuação, máscaras, trim)

- Pipeline de importação consolidado com contagem de bloqueios

- Exportador fixo de 525 colunas para integração com legado
