package com.sigopadroniza.desktop.application.importing;

import com.sigopadroniza.desktop.domain.Aluno;

import java.util.ArrayList;
import java.util.List;

/**
 * Parser de layout fixo inspirado no layout do sistema web.
 */
public final class AlunoFixedWidthParser {

    static final int TOTAL_LENGTH = 525;
    private static final int MINIMUM_STUDENT_LINE = 100;

    private static final int MATRICULA_START = 14;
    private static final int MATRICULA_END = 24;
    private static final int NOME_START = 34;
    private static final int NOME_END = 124;
    private static final int SERIE_START = 521;
    private static final int SERIE_END = 523;

    public AlunoParseResult parseArquivo(String content) {
        String[] lines = content.split("\\R", -1);
        List<Aluno> alunos = new ArrayList<>();
        List<AlunoParseIssue> issues = new ArrayList<>();

        for (int i = 0; i < lines.length; i++) {
            String originalLine = lines[i];
            if (originalLine.isEmpty()) {
                continue;
            }

            String normalizedLine = normalizeLine(i + 1, originalLine, issues);
            if (normalizedLine == null) {
                continue;
            }

            alunos.add(parseLinha(normalizedLine));
        }

        return new AlunoParseResult(alunos, issues);
    }

    Aluno parseLinha(String line) {
        String matricula = slice(line, MATRICULA_START, MATRICULA_END);
        String nome = slice(line, NOME_START, NOME_END);
        String turma = slice(line, SERIE_START, SERIE_END);
        return new Aluno(nome, matricula, turma);
    }

    private static String normalizeLine(int lineNumber, String line, List<AlunoParseIssue> issues) {
        if (line.length() < MINIMUM_STUDENT_LINE) {
            return null;
        }

        if (line.length() < TOTAL_LENGTH) {
            issues.add(new AlunoParseIssue(
                lineNumber,
                "Linha com tamanho menor que layout oficial; preenchida com espaços para parsing"
            ));
            return String.format("%-" + TOTAL_LENGTH + "s", line);
        }

        if (line.length() > 600) {
            issues.add(new AlunoParseIssue(
                lineNumber,
                "Linha com tamanho muito acima do layout; truncada para 525 colunas"
            ));
        }

        return line.substring(0, TOTAL_LENGTH);
    }

    private static String slice(String line, int start, int end) {
        return line.substring(start, end).trim();
    }
}
