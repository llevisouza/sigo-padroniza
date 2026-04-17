package com.sigopadroniza.desktop.application.importing;

import com.sigopadroniza.desktop.domain.Aluno;

import java.util.List;

/**
 * Resultado imutável da importação de alunos.
 */
public record AlunoParseResult(List<Aluno> alunos, List<AlunoParseIssue> issues) {

    public AlunoParseResult {
        alunos = List.copyOf(alunos);
        issues = List.copyOf(issues);
    }
}
