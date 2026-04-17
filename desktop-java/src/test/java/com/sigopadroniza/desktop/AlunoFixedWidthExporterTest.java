package com.sigopadroniza.desktop;

import com.sigopadroniza.desktop.application.exporting.AlunoFixedWidthExporter;
import com.sigopadroniza.desktop.domain.Aluno;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AlunoFixedWidthExporterTest {

    private final AlunoFixedWidthExporter exporter = new AlunoFixedWidthExporter();

    @Test
    void shouldGenerateFixedLengthLineWithMappedFields() {
        Aluno aluno = new Aluno(
            "MARIA DA SILVA",
            "MAT-001",
            "3A",
            "12.345.678",
            "F",
            "01/01/2012",
            "ANA SILVA",
            "RUA A",
            "100",
            "CENTRO",
            "123456",
            "SSP",
            "02/02/2020",
            "1234567",
            "529.982.247-25",
            "1",
            "2",
            "I"
        );

        String line = exporter.exportLine(aluno);

        assertEquals(AlunoFixedWidthExporter.TOTAL_LENGTH, line.length());
        assertEquals("12345678", line.substring(4, 12));
        assertEquals("MAT-001", line.substring(14, 21).trim());
        assertEquals("MARIA DA SILVA", line.substring(34, 48).trim());
        assertEquals("52998224725", line.substring(285, 296).trim());
        assertEquals("3A", line.substring(521, 523).trim());
    }

    @Test
    void shouldExportMultipleLinesSeparatedByNewline() {
        Aluno a1 = new Aluno("A", "1", "1A");
        Aluno a2 = new Aluno("B", "2", "2A");

        String content = exporter.exportFile(List.of(a1, a2));

        String[] lines = content.split("\\n", -1);
        assertEquals(2, lines.length);
        assertEquals(AlunoFixedWidthExporter.TOTAL_LENGTH, lines[0].length());
        assertEquals(AlunoFixedWidthExporter.TOTAL_LENGTH, lines[1].length());
    }
}
