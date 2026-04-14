import React, { useRef } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
import { parseArquivoFromBuffer } from '../utils/parser';
import { Aluno } from '../types/Aluno';

interface UploadProps {
  onUpload: (alunos: Aluno[], errors: string[]) => void;
  onError: (message: string) => void;
}

export const Upload: React.FC<UploadProps> = ({ onUpload, onError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const allAlunos: Aluno[] = [];
    const allErrors: string[] = [];

    const processFile = async (file: File): Promise<void> => {
      if (!file.name.toLowerCase().endsWith('.txt')) {
        allErrors.push(`Arquivo ${file.name}: formato invalido (apenas .txt).`);
        return;
      }

      try {
        // Read raw bytes so the parser can decide the correct decoding.
        const buffer = await file.arrayBuffer();
        const { alunos, errors } = parseArquivoFromBuffer(buffer);

        for (const aluno of alunos) {
          allAlunos.push(aluno);
        }

        if (errors.length > 0) {
          allErrors.push(`Arquivo ${file.name}: ${errors.length} avisos de layout.`);
        }

        if (alunos.length === 0) {
          allErrors.push(`Arquivo ${file.name}: nenhum registro foi reconhecido pelo parser.`);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'erro desconhecido ao processar';
        allErrors.push(`Arquivo ${file.name}: ${message}.`);
      }
    };

    // Process files sequentially to reduce peak memory usage on large imports.
    for (const file of Array.from(files)) {
      await processFile(file);
    }

    if (allAlunos.length === 0) {
      const detail = allErrors.slice(0, 3).join(' ');
      onError(detail ? `Nenhum registro valido encontrado nos arquivos selecionados. ${detail}` : 'Nenhum registro valido encontrado nos arquivos selecionados.');
    } else {
      onUpload(allAlunos, allErrors);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <label
        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="p-4 bg-blue-100 rounded-full mb-4 group-hover:scale-110 transition-transform">
            <UploadIcon className="w-8 h-8 text-blue-600" />
          </div>
          <p className="mb-2 text-sm text-slate-700 font-medium">
            <span className="font-bold">Clique para upload</span> ou arraste os arquivos
          </p>
          <p className="text-xs text-slate-500">Apenas arquivos .txt (Layout SalvadorCARD)</p>
        </div>
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
