package com.sigopadroniza.desktop.application.importing;

/**
 * Representa um aviso/erro gerado durante o parsing de linhas de importação.
 */
public record AlunoParseIssue(int lineNumber, String message) {
}
