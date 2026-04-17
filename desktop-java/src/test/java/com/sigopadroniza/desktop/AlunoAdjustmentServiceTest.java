package com.sigopadroniza.desktop;

import com.sigopadroniza.desktop.application.AlunoAdjustmentService;
import com.sigopadroniza.desktop.domain.Aluno;
import com.sigopadroniza.desktop.domain.AlunoAdjustment;
import com.sigopadroniza.desktop.domain.AlunoField;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AlunoAdjustmentServiceTest {

    private final AlunoAdjustmentService service = new AlunoAdjustmentService();

    @Test
    void shouldSuggestAdjustmentsForMaskedAndAccentedFields() {
        Aluno aluno = new Aluno(
            "José da Silva",
            "  MAT-001  ",
            "3A",
            "12.345.678/0001",
            "M",
            " 01/01/2012 ",
            "Márcia",
            "Rua São João",
            " 100 ",
            "Bairro Céu Azul",
            "12345",
            "SSP",
            " 02/02/2020 ",
            "12.345-67",
            "123.456.789-09",
            "1",
            "2",
            "I"
        );

        List<AlunoAdjustment> adjustments = service.getAdjustments(aluno);

        assertTrue(adjustments.stream().anyMatch(a -> a.field() == AlunoField.NOME && a.after().equals("JOSE DA SILVA")));
        assertTrue(adjustments.stream().anyMatch(a -> a.field() == AlunoField.CODIGO_ESCOLA && a.after().equals("123456780001")));
        assertTrue(adjustments.stream().anyMatch(a -> a.field() == AlunoField.CPF && a.after().equals("12345678909")));
    }

    @Test
    void shouldApplyAdjustmentsImmutably() {
        Aluno aluno = new Aluno("José", " MAT-1 ", "1A");
        List<AlunoAdjustment> adjustments = List.of(
            new AlunoAdjustment(AlunoField.NOME, "José", "JOSE", "Padronização"),
            new AlunoAdjustment(AlunoField.MATRICULA, " MAT-1 ", "MAT-1", "Trim")
        );

        Aluno adjusted = service.applyAdjustments(aluno, adjustments);

        assertEquals("JOSE", adjusted.nome());
        assertEquals("MAT-1", adjusted.matricula());
        assertEquals("José", aluno.nome());
    }
}
