package com.sigopadroniza.desktop.application.exporting;

import com.sigopadroniza.desktop.domain.Aluno;

import java.util.List;

/**
 * Exporta alunos para layout fixo de 525 colunas compatível com o legado.
 */
public final class AlunoFixedWidthExporter {

    public static final int TOTAL_LENGTH = 525;

    public String exportLine(Aluno aluno) {
        StringBuilder line = new StringBuilder(" ".repeat(TOTAL_LENGTH));

        write(line, 4, 14, aluno.codigoEscola(), true);      // codigoEscola
        write(line, 14, 24, aluno.matricula(), false);       // matricula
        write(line, 34, 124, aluno.nome(), false);           // nome
        write(line, 124, 125, aluno.sexo(), false);          // sexo
        write(line, 125, 135, aluno.dataNascimento(), false);// dataNascimento
        write(line, 135, 195, aluno.nomeMae(), false);       // nomeMae
        write(line, 255, 269, aluno.rg(), false);            // rg
        write(line, 269, 275, aluno.orgaoExpedidor(), false);// orgaoExpedidor
        write(line, 275, 285, aluno.dataEmissaoRg(), false); // dataEmissaoRg
        write(line, 285, 296, aluno.cpf(), true);            // cpf
        write(line, 296, 303, aluno.certidao(), true);       // certidao
        write(line, 312, 362, aluno.endereco(), false);      // endereco
        write(line, 362, 372, aluno.numero(), false);        // numero
        write(line, 402, 432, aluno.bairro(), false);        // bairro
        write(line, 520, 521, aluno.grau(), false);          // grau
        write(line, 521, 523, aluno.turma(), false);         // serie (mapeada para turma)
        write(line, 523, 524, aluno.turno(), false);         // turno
        write(line, 524, 525, aluno.flag(), false);          // flag

        return line.toString();
    }

    public String exportFile(List<Aluno> alunos) {
        return alunos.stream().map(this::exportLine).reduce((a, b) -> a + "\n" + b).orElse("");
    }

    private static void write(StringBuilder sb, int start, int end, String value, boolean digitsOnly) {
        String content = value == null ? "" : value.trim();
        if (digitsOnly) {
            content = content.replaceAll("\\D", "");
        }

        int length = end - start;
        String normalized = content.length() > length ? content.substring(0, length) : content;

        for (int i = 0; i < normalized.length(); i++) {
            sb.setCharAt(start + i, normalized.charAt(i));
        }
    }
}
