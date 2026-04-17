package com.sigopadroniza.desktop.application;

import com.sigopadroniza.desktop.domain.Aluno;
import com.sigopadroniza.desktop.domain.AlunoValidationIssue;
import com.sigopadroniza.desktop.domain.ValidationError;
import com.sigopadroniza.desktop.domain.ValidationSeverity;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Serviço de aplicação responsável por validar regras de negócio do aluno.
 */
public final class AlunoValidationService {

    private static final DateTimeFormatter BR_DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/uuuu");
    private static final Set<String> GRAUS_VALIDOS = Set.of("1", "2", "3");
    private static final Set<String> TURNOS_VALIDOS = Set.of("1", "2", "3", "4", "5", "6", "7");
    private static final Set<String> FLAGS_VALIDAS = Set.of("I", "A", "E");

    public List<AlunoValidationIssue> validate(Aluno aluno) {
        List<AlunoValidationIssue> issues = new ArrayList<>();

        requireNotBlank(aluno.nome(), "nome", ValidationError.NOME_OBRIGATORIO, "Nome é obrigatório", issues);
        requireNotBlank(aluno.matricula(), "matricula", ValidationError.MATRICULA_OBRIGATORIA, "Matrícula é obrigatória", issues);
        requireNotBlank(aluno.codigoEscola(), "codigoEscola", ValidationError.CODIGO_ESCOLA_OBRIGATORIO, "Código da escola é obrigatório", issues);

        if (!"M".equals(aluno.sexo()) && !"F".equals(aluno.sexo())) {
            issues.add(issue("sexo", ValidationError.SEXO_INVALIDO, "Sexo deve ser M ou F"));
        }

        LocalDate nascimento = parseDate(aluno.dataNascimento());
        if (nascimento == null) {
            issues.add(issue("dataNascimento", ValidationError.DATA_NASCIMENTO_INVALIDA, "Data de nascimento inválida (dd/MM/yyyy)"));
        }

        requireNotBlank(aluno.nomeMae(), "nomeMae", ValidationError.NOME_MAE_OBRIGATORIO, "Nome da mãe é obrigatório", issues);
        requireNotBlank(aluno.endereco(), "endereco", ValidationError.ENDERECO_OBRIGATORIO, "Endereço é obrigatório", issues);
        requireNotBlank(aluno.numero(), "numero", ValidationError.NUMERO_OBRIGATORIO, "Número é obrigatório", issues);
        requireNotBlank(aluno.bairro(), "bairro", ValidationError.BAIRRO_OBRIGATORIO, "Bairro é obrigatório", issues);

        validateAgeDocumentRules(aluno, nascimento, issues);
        validateCpf(aluno.cpf(), issues);

        if (!GRAUS_VALIDOS.contains(aluno.grau())) {
            issues.add(issue("grau", ValidationError.GRAU_INVALIDO, "Grau inválido (1, 2 ou 3)"));
        }

        if (!TURNOS_VALIDOS.contains(aluno.turno())) {
            issues.add(issue("turno", ValidationError.TURNO_INVALIDO, "Turno inválido (1 a 7)"));
        }

        if (!FLAGS_VALIDAS.contains(aluno.flag())) {
            issues.add(issue("flag", ValidationError.FLAG_INVALIDA, "Flag inválida (I, A ou E)"));
        }

        return List.copyOf(issues);
    }

    private static void validateAgeDocumentRules(Aluno aluno, LocalDate nascimento, List<AlunoValidationIssue> issues) {
        if (nascimento == null) {
            return;
        }

        int idade = Period.between(nascimento, LocalDate.now()).getYears();
        boolean hasRg = !aluno.rg().isBlank();
        boolean hasCertidao = !aluno.certidao().isBlank();

        if (idade >= 10) {
            if (!hasRg) {
                issues.add(issue("rg", ValidationError.RG_OBRIGATORIO_MAIOR_10, "RG é obrigatório para alunos com 10+ anos"));
                return;
            }

            if (aluno.orgaoExpedidor().isBlank()) {
                issues.add(issue("orgaoExpedidor", ValidationError.ORGAO_EXPEDIDOR_OBRIGATORIO, "Órgão expedidor é obrigatório quando RG informado"));
            }

            if (parseDate(aluno.dataEmissaoRg()) == null) {
                issues.add(issue("dataEmissaoRg", ValidationError.DATA_EMISSAO_RG_INVALIDA, "Data de emissão do RG inválida (dd/MM/yyyy)"));
            }
            return;
        }

        if (!hasRg && !hasCertidao) {
            issues.add(issue("certidao", ValidationError.CERTIDAO_OU_RG_OBRIGATORIO_MENOR_10, "Para menores de 10 anos, informe RG ou certidão"));
        }
    }

    private static void validateCpf(String cpf, List<AlunoValidationIssue> issues) {
        String digits = cpf.replaceAll("\\D", "");
        if (digits.isEmpty()) {
            return;
        }

        if (digits.length() != 11) {
            issues.add(issue("cpf", ValidationError.CPF_TAMANHO_INVALIDO, "CPF deve ter 11 dígitos"));
            return;
        }

        if (!isValidCpf(digits)) {
            issues.add(issue("cpf", ValidationError.CPF_INVALIDO, "CPF inválido"));
        }
    }

    private static boolean isValidCpf(String digits) {
        if (digits.chars().distinct().count() == 1) {
            return false;
        }

        int d1 = calculateDigit(digits, 9, 10);
        int d2 = calculateDigit(digits, 10, 11);
        return d1 == Character.getNumericValue(digits.charAt(9))
            && d2 == Character.getNumericValue(digits.charAt(10));
    }

    private static int calculateDigit(String cpf, int length, int weightStart) {
        int sum = 0;
        int weight = weightStart;
        for (int i = 0; i < length; i++) {
            sum += Character.getNumericValue(cpf.charAt(i)) * weight;
            weight--;
        }
        int mod = 11 - (sum % 11);
        return mod >= 10 ? 0 : mod;
    }

    private static LocalDate parseDate(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        try {
            return LocalDate.parse(value, BR_DATE_FORMAT);
        } catch (DateTimeException ex) {
            return null;
        }
    }

    private static void requireNotBlank(
        String value,
        String field,
        ValidationError code,
        String message,
        List<AlunoValidationIssue> issues
    ) {
        if (value == null || value.isBlank()) {
            issues.add(issue(field, code, message));
        }
    }

    private static AlunoValidationIssue issue(String field, ValidationError code, String message) {
        return new AlunoValidationIssue(field, code, ValidationSeverity.ERROR, message);
    }
}
