package com.sigopadroniza.desktop.domain;

import java.util.Objects;

/**
 * Entidade de domínio do aluno com campos essenciais para validação de paridade.
 */
public record Aluno(
    String nome,
    String matricula,
    String turma,
    String codigoEscola,
    String sexo,
    String dataNascimento,
    String nomeMae,
    String endereco,
    String numero,
    String bairro,
    String rg,
    String orgaoExpedidor,
    String dataEmissaoRg,
    String certidao,
    String cpf,
    String grau,
    String turno,
    String flag
) {

    public Aluno {
        nome = normalize(nome);
        matricula = normalize(matricula);
        turma = normalize(turma);
        codigoEscola = normalize(codigoEscola);
        sexo = normalize(sexo);
        dataNascimento = normalize(dataNascimento);
        nomeMae = normalize(nomeMae);
        endereco = normalize(endereco);
        numero = normalize(numero);
        bairro = normalize(bairro);
        rg = normalize(rg);
        orgaoExpedidor = normalize(orgaoExpedidor);
        dataEmissaoRg = normalize(dataEmissaoRg);
        certidao = normalize(certidao);
        cpf = normalize(cpf);
        grau = normalize(grau);
        turno = normalize(turno);
        flag = normalize(flag);
    }

    public Aluno(String nome, String matricula, String turma) {
        this(
            nome,
            matricula,
            turma,
            "",
            "M",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "1",
            "1",
            "I"
        );
    }



    public Aluno withField(AlunoField field, String value) {
        return switch (field) {
            case NOME -> new Aluno(value, matricula, turma, codigoEscola, sexo, dataNascimento, nomeMae, endereco, numero, bairro, rg, orgaoExpedidor, dataEmissaoRg, certidao, cpf, grau, turno, flag);
            case MATRICULA -> new Aluno(nome, value, turma, codigoEscola, sexo, dataNascimento, nomeMae, endereco, numero, bairro, rg, orgaoExpedidor, dataEmissaoRg, certidao, cpf, grau, turno, flag);
            case TURMA -> new Aluno(nome, matricula, value, codigoEscola, sexo, dataNascimento, nomeMae, endereco, numero, bairro, rg, orgaoExpedidor, dataEmissaoRg, certidao, cpf, grau, turno, flag);
            case CODIGO_ESCOLA -> new Aluno(nome, matricula, turma, value, sexo, dataNascimento, nomeMae, endereco, numero, bairro, rg, orgaoExpedidor, dataEmissaoRg, certidao, cpf, grau, turno, flag);
            case SEXO -> new Aluno(nome, matricula, turma, codigoEscola, value, dataNascimento, nomeMae, endereco, numero, bairro, rg, orgaoExpedidor, dataEmissaoRg, certidao, cpf, grau, turno, flag);
            case DATA_NASCIMENTO -> new Aluno(nome, matricula, turma, codigoEscola, sexo, value, nomeMae, endereco, numero, bairro, rg, orgaoExpedidor, dataEmissaoRg, certidao, cpf, grau, turno, flag);
            case NOME_MAE -> new Aluno(nome, matricula, turma, codigoEscola, sexo, dataNascimento, value, endereco, numero, bairro, rg, orgaoExpedidor, dataEmissaoRg, certidao, cpf, grau, turno, flag);
            case ENDERECO -> new Aluno(nome, matricula, turma, codigoEscola, sexo, dataNascimento, nomeMae, value, numero, bairro, rg, orgaoExpedidor, dataEmissaoRg, certidao, cpf, grau, turno, flag);
            case NUMERO -> new Aluno(nome, matricula, turma, codigoEscola, sexo, dataNascimento, nomeMae, endereco, value, bairro, rg, orgaoExpedidor, dataEmissaoRg, certidao, cpf, grau, turno, flag);
            case BAIRRO -> new Aluno(nome, matricula, turma, codigoEscola, sexo, dataNascimento, nomeMae, endereco, numero, value, rg, orgaoExpedidor, dataEmissaoRg, certidao, cpf, grau, turno, flag);
            case RG -> new Aluno(nome, matricula, turma, codigoEscola, sexo, dataNascimento, nomeMae, endereco, numero, bairro, value, orgaoExpedidor, dataEmissaoRg, certidao, cpf, grau, turno, flag);
            case ORGAO_EXPEDIDOR -> new Aluno(nome, matricula, turma, codigoEscola, sexo, dataNascimento, nomeMae, endereco, numero, bairro, rg, value, dataEmissaoRg, certidao, cpf, grau, turno, flag);
            case DATA_EMISSAO_RG -> new Aluno(nome, matricula, turma, codigoEscola, sexo, dataNascimento, nomeMae, endereco, numero, bairro, rg, orgaoExpedidor, value, certidao, cpf, grau, turno, flag);
            case CERTIDAO -> new Aluno(nome, matricula, turma, codigoEscola, sexo, dataNascimento, nomeMae, endereco, numero, bairro, rg, orgaoExpedidor, dataEmissaoRg, value, cpf, grau, turno, flag);
            case CPF -> new Aluno(nome, matricula, turma, codigoEscola, sexo, dataNascimento, nomeMae, endereco, numero, bairro, rg, orgaoExpedidor, dataEmissaoRg, certidao, value, grau, turno, flag);
            case GRAU -> new Aluno(nome, matricula, turma, codigoEscola, sexo, dataNascimento, nomeMae, endereco, numero, bairro, rg, orgaoExpedidor, dataEmissaoRg, certidao, cpf, value, turno, flag);
            case TURNO -> new Aluno(nome, matricula, turma, codigoEscola, sexo, dataNascimento, nomeMae, endereco, numero, bairro, rg, orgaoExpedidor, dataEmissaoRg, certidao, cpf, grau, value, flag);
            case FLAG -> new Aluno(nome, matricula, turma, codigoEscola, sexo, dataNascimento, nomeMae, endereco, numero, bairro, rg, orgaoExpedidor, dataEmissaoRg, certidao, cpf, grau, turno, value);
        };
    }
    private static String normalize(String value) {
        return Objects.requireNonNullElse(value, "").trim();
    }
}
