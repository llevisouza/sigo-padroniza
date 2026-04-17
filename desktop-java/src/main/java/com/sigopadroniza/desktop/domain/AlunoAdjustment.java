package com.sigopadroniza.desktop.domain;

public record AlunoAdjustment(
    AlunoField field,
    String before,
    String after,
    String reason
) {
}
