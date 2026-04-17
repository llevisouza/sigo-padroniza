package com.sigopadroniza.desktop;

import com.sigopadroniza.desktop.application.importing.AlunoFixedWidthParser;
import com.sigopadroniza.desktop.application.importing.AlunoParseResult;
import com.sigopadroniza.desktop.domain.Aluno;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AlunoFixedWidthParserTest {

    private final AlunoFixedWidthParser parser = new AlunoFixedWidthParser();

    @Test
    void shouldParseSingleValidFixedWidthLine() {
        String line = buildLine("1234567890", "MARIA DA SILVA", "3A");

        AlunoParseResult result = parser.parseArquivo(line + "\n");

        assertEquals(1, result.alunos().size());
        Aluno aluno = result.alunos().getFirst();
        assertEquals("MARIA DA SILVA", aluno.nome());
        assertEquals("1234567890", aluno.matricula());
        assertEquals("3A", aluno.turma());
        assertEquals(List.of(), result.issues());
    }

    @Test
    void shouldPadLineAndReportIssueWhenBelowLayoutLength() {
        String shortLine = "x".repeat(200);

        AlunoParseResult result = parser.parseArquivo(shortLine);

        assertEquals(1, result.alunos().size());
        assertEquals(1, result.issues().size());
        assertEquals(1, result.issues().getFirst().lineNumber());
    }

    @Test
    void shouldIgnoreVeryShortLines() {
        String tiny = "abc";

        AlunoParseResult result = parser.parseArquivo(tiny);

        assertEquals(0, result.alunos().size());
        assertEquals(0, result.issues().size());
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
