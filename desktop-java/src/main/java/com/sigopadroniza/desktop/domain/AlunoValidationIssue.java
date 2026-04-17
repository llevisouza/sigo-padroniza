package com.sigopadroniza.desktop.domain;

public record AlunoValidationIssue(
    String field,
    ValidationError code,
    ValidationSeverity severity,
    String message
) {
}
