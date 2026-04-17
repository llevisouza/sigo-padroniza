package com.sigopadroniza.desktop.application.importing;

import java.util.List;

/**
 * Resultado consolidado do pipeline de importação.
 */
public record AlunoImportPipelineResult(
    List<AlunoProcessingResult> processedAlunos,
    List<AlunoParseIssue> parseIssues
) {

    public AlunoImportPipelineResult {
        processedAlunos = List.copyOf(processedAlunos);
        parseIssues = List.copyOf(parseIssues);
    }

    public long blockingCount() {
        return processedAlunos.stream().filter(AlunoProcessingResult::hasBlockingErrors).count();
    }
}
