import React from 'react';
import { Aluno } from '../types/Aluno';
import { Trash2, Edit, AlertTriangle, CheckCircle, Wand2 } from 'lucide-react';
import { AlunoInsight } from '../types/AlunoInsight';
import { getAlunoAdjustments } from '../utils/adjustments';
import { validateAluno } from '../utils/validator';

interface TabelaAlunosProps {
  alunos: Aluno[];
  insightsById?: Map<string, AlunoInsight>;
  onDelete: (id: string) => void;
  onEdit: (aluno: Aluno) => void;
  onAdjust: (aluno: Aluno) => void;
}

export const TabelaAlunos: React.FC<TabelaAlunosProps> = ({ alunos, insightsById, onDelete, onEdit, onAdjust }) => {
  if (alunos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-xl border border-slate-200">
        <AlertTriangle className="w-12 h-12 text-slate-300 mb-4" />
        <p className="text-slate-500 font-medium">Nenhum aluno cadastrado.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-sm text-left text-slate-500">
        <thead className="text-xs text-slate-700 uppercase bg-slate-100 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 font-bold">Status</th>
            <th className="px-4 py-3 font-bold">Matricula</th>
            <th className="px-4 py-3 font-bold">Nome</th>
            <th className="px-4 py-3 font-bold">CPF</th>
            <th className="px-4 py-3 font-bold">Serie/Turno</th>
            <th className="px-4 py-3 font-bold">Acoes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {alunos.map((aluno) => {
            const insight = insightsById?.get(aluno.id);
            const errors = insight?.errors ?? validateAluno(aluno);
            const blockingErrors = insight?.blockingErrors ?? errors.filter((error) => error.severity === 'error');
            const warnings = insight?.warnings ?? errors.filter((error) => error.severity === 'warning');
            const adjustments = insight?.adjustments ?? getAlunoAdjustments(aluno);
            const isValid = blockingErrors.length === 0;
            const hasWarnings = warnings.length > 0;

            return (
              <tr key={aluno.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  {isValid && !hasWarnings ? (
                    <div className="flex items-center text-green-600" title="Valido">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  ) : isValid && hasWarnings ? (
                    <div
                      className="flex items-center text-blue-500 cursor-help"
                      title={`Avisos:\n${warnings.map((error) => error.message).join('\n')}`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                      <span className="ml-1 text-[10px] font-bold">{warnings.length}</span>
                    </div>
                  ) : (
                    <div
                      className="flex items-center text-amber-500 cursor-help"
                      title={`Pendencias:\n${blockingErrors.map((error) => error.message).join('\n')}${hasWarnings ? `\n\nAvisos:\n${warnings.map((error) => error.message).join('\n')}` : ''}`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                      <span className="ml-1 text-[10px] font-bold">{blockingErrors.length}</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-slate-900">{aluno.matricula}</td>
                <td className="px-4 py-3 font-medium text-slate-900 truncate max-w-[200px]">{aluno.nome}</td>
                <td className="px-4 py-3 font-mono">{aluno.cpf || '---'}</td>
                <td className="px-4 py-3">
                  {aluno.serie} / {aluno.turno}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onAdjust(aluno)}
                      disabled={adjustments.length === 0}
                      className={`inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
                        adjustments.length > 0
                          ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          : 'text-slate-400 bg-slate-100 cursor-not-allowed'
                      }`}
                      title={
                        adjustments.length > 0
                          ? `${adjustments.length} ajustes sugeridos`
                          : 'Nenhum ajuste sugerido'
                      }
                    >
                      <Wand2 className="w-3.5 h-3.5 mr-1.5" />
                      Ajustar
                    </button>
                    <button
                      onClick={() => onEdit(aluno)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(aluno.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
