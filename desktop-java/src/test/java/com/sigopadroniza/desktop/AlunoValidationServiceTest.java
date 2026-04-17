package com.sigopadroniza.desktop;

import com.sigopadroniza.desktop.application.AlunoValidationService;
import com.sigopadroniza.desktop.domain.Aluno;
import com.sigopadroniza.desktop.domain.AlunoValidationIssue;
import com.sigopadroniza.desktop.domain.ValidationError;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AlunoValidationServiceTest {

    private final AlunoValidationService service = new AlunoValidationService();

    @Test
    void shouldReturnNoIssuesForValidAluno() {
        Aluno aluno = new Aluno(
            "Maria Silva",
            "123456",
            "3A",
            "1234567890",
            "F",
            "01/01/2010",
            "Ana Silva",
            "Rua A",
            "100",
            "Centro",
            "123456",
            "SSP",
            "01/01/2022",
            "",
            "52998224725",
            "1",
            "2",
            "I"
        );

        List<AlunoValidationIssue> result = service.validate(aluno);

        assertEquals(List.of(), result);
    }

    @Test
    void shouldReturnRequiredFieldIssuesForBlankFields() {
        Aluno aluno = new Aluno("", "", "");

        List<AlunoValidationIssue> result = service.validate(aluno);

        assertTrue(hasCode(result, ValidationError.NOME_OBRIGATORIO));
        assertTrue(hasCode(result, ValidationError.MATRICULA_OBRIGATORIA));
        assertTrue(hasCode(result, ValidationError.CODIGO_ESCOLA_OBRIGATORIO));
        assertTrue(hasCode(result, ValidationError.DATA_NASCIMENTO_INVALIDA));
    }

    @Test
    void shouldRequireRgForStudentsOlderThanTenYears() {
        Aluno aluno = new Aluno(
            "João",
            "111222",
            "2B",
            "123",
            "M",
            "01/01/2012",
            "Mãe",
            "Rua B",
            "50",
            "Bairro",
            "",
            "",
            "",
            "",
            "",
            "1",
            "1",
            "I"
        );

        List<AlunoValidationIssue> result = service.validate(aluno);

        assertTrue(hasCode(result, ValidationError.RG_OBRIGATORIO_MAIOR_10));
    }

    @Test
    void shouldRequireRgOrCertidaoForChildrenUnderTenYears() {
        Aluno aluno = new Aluno(
            "Lia",
            "222333",
            "1A",
            "123",
            "F",
            "01/01/2020",
            "Mãe",
            "Rua C",
            "33",
            "Bairro",
            "",
            "",
            "",
            "",
            "",
            "1",
            "1",
            "I"
        );

        List<AlunoValidationIssue> result = service.validate(aluno);

        assertTrue(hasCode(result, ValidationError.CERTIDAO_OU_RG_OBRIGATORIO_MENOR_10));
    }

    @Test
    void shouldValidateCpfFormatAndDigits() {
        Aluno aluno = new Aluno(
            "Pedro",
            "222333",
            "1A",
            "123",
            "M",
            "01/01/2010",
            "Mãe",
            "Rua D",
            "33",
            "Bairro",
            "999999",
            "SSP",
            "01/01/2020",
            "",
            "12345678900",
            "1",
            "1",
            "I"
        );

        List<AlunoValidationIssue> result = service.validate(aluno);

        assertTrue(hasCode(result, ValidationError.CPF_INVALIDO));
    }

    private static boolean hasCode(List<AlunoValidationIssue> issues, ValidationError code) {
        return issues.stream().anyMatch(issue -> issue.code() == code);
    }
}
