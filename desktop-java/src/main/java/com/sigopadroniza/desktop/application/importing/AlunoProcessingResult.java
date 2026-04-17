package com.sigopadroniza.desktop.application.importing;

import com.sigopadroniza.desktop.domain.Aluno;
import com.sigopadroniza.desktop.domain.AlunoAdjustment;
import com.sigopadroniza.desktop.domain.AlunoValidationIssue;
import com.sigopadroniza.desktop.domain.ValidationSeverity;

import java.util.List;

/**
 * Resultado de processamento de um aluno no pipeline de importação.
 */
public record AlunoProcessingResult(
    Aluno original,
    Aluno adjusted,
    List<AlunoAdjustment> adjustments,
    List<AlunoValidationIssue> validationIssues
) {

    public AlunoProcessingResult {
        adjustments = List.copyOf(adjustments);
        validationIssues = List.copyOf(validationIssues);
    }

    public boolean hasBlockingErrors() {
        return validationIssues.stream().anyMatch(issue -> issue.severity() == ValidationSeverity.ERROR);
    }
}
