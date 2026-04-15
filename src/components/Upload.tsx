import React, { useRef } from "react";
import { Upload as UploadIcon } from "lucide-react";
import { parseArquivoFromBuffer } from "../utils/parser";
import { Aluno } from "../types/Aluno";

interface UploadProps {
  onUpload: (alunos: Aluno[], errors: string[]) => void;
  onError: (message: string) => void;
}

export const Upload: React.FC<UploadProps> = ({ onUpload, onError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const allAlunos: Aluno[] = [];
    const allErrors: string[] = [];

    const processFile = async (file: File): Promise<void> => {
      if (!file.name.toLowerCase().endsWith(".txt")) {
        allErrors.push(`Arquivo ${file.name}: formato invalido (apenas .txt).`);
        return;
      }

      try {
        const buffer = await file.arrayBuffer();
        const { alunos, errors } = parseArquivoFromBuffer(buffer);

        for (const aluno of alunos) {
          allAlunos.push(aluno);
        }

        if (errors.length > 0) {
          allErrors.push(`Arquivo ${file.name}: ${errors.length} aviso(s) de layout.`);
        }

        if (alunos.length === 0) {
          allErrors.push(`Arquivo ${file.name}: nenhum registro foi reconhecido pelo parser.`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "erro desconhecido ao processar";
        allErrors.push(`Arquivo ${file.name}: ${message}.`);
      }
    };

    for (const file of Array.from(files)) {
      await processFile(file);
    }

    if (allAlunos.length === 0) {
      const detail = allErrors.slice(0, 3).join(" ");
      onError(
        detail
          ? `Nenhum registro valido encontrado nos arquivos selecionados. ${detail}`
          : "Nenhum registro valido encontrado nos arquivos selecionados."
      );
    } else {
      onUpload(allAlunos, allErrors);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <label className="group flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-center transition-all duration-150 hover:border-blue-300 hover:bg-white hover:shadow-sm">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-transform duration-150 group-hover:scale-105">
          <UploadIcon className="h-6 w-6" />
        </div>

        <p className="mb-1 text-[13px] font-medium text-slate-900">
          <span className="text-blue-600">Clique para upload</span> ou arraste os arquivos
        </p>
        <p className="text-[11px] leading-5 text-slate-500">Apenas arquivos .txt no layout SalvadorCARD</p>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".txt"
          multiple
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
