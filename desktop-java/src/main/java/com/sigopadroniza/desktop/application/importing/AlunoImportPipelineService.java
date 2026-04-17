package com.sigopadroniza.desktop.application.importing;

import com.sigopadroniza.desktop.application.AlunoAdjustmentService;
import com.sigopadroniza.desktop.application.AlunoValidationService;
import com.sigopadroniza.desktop.domain.Aluno;

import java.util.ArrayList;
import java.util.List;

/**
 * Encadeia parsing -> ajustes -> validação em um único serviço de aplicação.
 */
public final class AlunoImportPipelineService {

    private final AlunoFixedWidthParser parser;
    private final AlunoAdjustmentService adjustmentService;
    private final AlunoValidationService validationService;

    public AlunoImportPipelineService() {
        this(new AlunoFixedWidthParser(), new AlunoAdjustmentService(), new AlunoValidationService());
    }

    public AlunoImportPipelineService(
        AlunoFixedWidthParser parser,
        AlunoAdjustmentService adjustmentService,
        AlunoValidationService validationService
    ) {
        this.parser = parser;
        this.adjustmentService = adjustmentService;
        this.validationService = validationService;
    }

    public AlunoImportPipelineResult process(String content) {
        AlunoParseResult parseResult = parser.parseArquivo(content);
        List<AlunoProcessingResult> processed = new ArrayList<>();

        for (Aluno aluno : parseResult.alunos()) {
            var adjustments = adjustmentService.getAdjustments(aluno);
            Aluno adjusted = adjustmentService.applyAdjustments(aluno, adjustments);
            var issues = validationService.validate(adjusted);

            processed.add(new AlunoProcessingResult(aluno, adjusted, adjustments, issues));
        }

        return new AlunoImportPipelineResult(processed, parseResult.issues());
    }
}
