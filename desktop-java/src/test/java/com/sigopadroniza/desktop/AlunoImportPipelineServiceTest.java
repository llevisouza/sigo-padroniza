package com.sigopadroniza.desktop;

import com.sigopadroniza.desktop.application.importing.AlunoImportPipelineResult;
import com.sigopadroniza.desktop.application.importing.AlunoImportPipelineService;
import com.sigopadroniza.desktop.domain.ValidationError;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AlunoImportPipelineServiceTest {

    private final AlunoImportPipelineService pipeline = new AlunoImportPipelineService();

    @Test
    void shouldRunParseAdjustAndValidationInOrder() {
        String line = buildLine("  MAT-001  ", "José da Silva", "3A");

        AlunoImportPipelineResult result = pipeline.process(line + "\n");

        assertEquals(1, result.processedAlunos().size());
        var processed = result.processedAlunos().getFirst();

        assertEquals("JOSE DA SILVA", processed.adjusted().nome());
        assertEquals("MAT-001", processed.adjusted().matricula());
        assertTrue(processed.adjustments().size() >= 2);
        assertTrue(processed.validationIssues().stream().anyMatch(i -> i.code() == ValidationError.CODIGO_ESCOLA_OBRIGATORIO));
        assertEquals(1L, result.blockingCount());
    }

    @Test
    void shouldKeepParseIssuesFromParser() {
        String shortLine = "x".repeat(200);

        AlunoImportPipelineResult result = pipeline.process(shortLine);

        assertEquals(1, result.parseIssues().size());
    }

    private static String buildLine(String matricula, String nome, String serie) {
        StringBuilder sb = new StringBuilder(" ".repeat(525));
        fill(sb, 14, 24, matricula);
        fill(sb, 34, 124, nome);
        fill(sb, 521, 523, serie);
        return sb.toString();
    }

    private static void fill(StringBuilder sb, int start, int end, String value) {
        int maxLength = end - start;
        String normalized = value.length() > maxLength ? value.substring(0, maxLength) : value;
        for (int i = 0; i < normalized.length(); i++) {
            sb.setCharAt(start + i, normalized.charAt(i));
        }
    }
}
