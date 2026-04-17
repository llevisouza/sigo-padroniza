package com.sigopadroniza.desktop.application;

import com.sigopadroniza.desktop.domain.Aluno;
import com.sigopadroniza.desktop.domain.AlunoAdjustment;
import com.sigopadroniza.desktop.domain.AlunoField;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Serviço para sugerir e aplicar ajustes de padronização no cadastro do aluno.
 */
public final class AlunoAdjustmentService {

    public List<AlunoAdjustment> getAdjustments(Aluno aluno) {
        List<AlunoAdjustment> adjustments = new ArrayList<>();

        register(adjustments, AlunoField.MATRICULA, aluno.matricula(), normalizeText(aluno.matricula()),
            "Padronizar matrícula removendo espaços extras e caracteres inválidos");
        register(adjustments, AlunoField.NOME, aluno.nome(), normalizeText(aluno.nome()),
            "Padronizar nome sem acentos e caracteres especiais");
        register(adjustments, AlunoField.NOME_MAE, aluno.nomeMae(), normalizeText(aluno.nomeMae()),
            "Padronizar nome da mãe sem acentos e caracteres especiais");
        register(adjustments, AlunoField.ENDERECO, aluno.endereco(), normalizeText(aluno.endereco()),
            "Padronizar endereço sem acentos e caracteres especiais");
        register(adjustments, AlunoField.BAIRRO, aluno.bairro(), normalizeText(aluno.bairro()),
            "Padronizar bairro sem acentos e caracteres especiais");
        register(adjustments, AlunoField.NUMERO, aluno.numero(), aluno.numero().trim(),
            "Remover espaços extras do número");
        register(adjustments, AlunoField.CODIGO_ESCOLA, aluno.codigoEscola(), onlyDigitsOrOriginal(aluno.codigoEscola()),
            "Remover máscara do código da escola");
        register(adjustments, AlunoField.CPF, aluno.cpf(), normalizeDigitsIfExact(aluno.cpf(), 11),
            "Remover máscara do CPF");
        register(adjustments, AlunoField.CERTIDAO, aluno.certidao(), normalizeDigitsIfExact(aluno.certidao(), 7),
            "Remover máscara da certidão");
        register(adjustments, AlunoField.DATA_NASCIMENTO, aluno.dataNascimento(), aluno.dataNascimento().trim(),
            "Remover espaços extras da data de nascimento");
        register(adjustments, AlunoField.DATA_EMISSAO_RG, aluno.dataEmissaoRg(), aluno.dataEmissaoRg().trim(),
            "Remover espaços extras da data de emissão do RG");

        return List.copyOf(adjustments);
    }

    public Aluno applyAdjustments(Aluno aluno, List<AlunoAdjustment> adjustments) {
        Aluno next = aluno;
        for (AlunoAdjustment adjustment : adjustments) {
            next = next.withField(adjustment.field(), adjustment.after());
        }
        return next;
    }

    private static void register(
        List<AlunoAdjustment> adjustments,
        AlunoField field,
        String before,
        String after,
        String reason
    ) {
        String left = before == null ? "" : before;
        String right = after == null ? "" : after;
        if (!left.equals(right)) {
            adjustments.add(new AlunoAdjustment(field, left, right, reason));
        }
    }

    private static String normalizeText(String input) {
        String normalized = Normalizer.normalize(input == null ? "" : input, Normalizer.Form.NFD)
            .replaceAll("\\p{M}+", "")
            .replaceAll("[^A-Za-z0-9 /.-]", "")
            .trim();
        return normalized.toUpperCase(Locale.ROOT);
    }

    private static String onlyDigitsOrOriginal(String value) {
        String input = value == null ? "" : value;
        String digits = input.replaceAll("\\D", "");
        return digits.isEmpty() ? input : digits;
    }

    private static String normalizeDigitsIfExact(String value, int expectedLength) {
        String input = value == null ? "" : value;
        String digits = input.replaceAll("\\D", "");
        return digits.length() == expectedLength ? digits : input;
    }
}
