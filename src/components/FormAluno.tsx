import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from "react";
import { AlertCircle, Save, Wand2, X } from "lucide-react";
import { Aluno } from "../types/Aluno";
import { AlunoAdjustment, applyAlunoAdjustments, getAlunoAdjustments } from "../utils/adjustments";
import { validateAluno } from "../utils/validator";

interface FormAlunoProps {
  aluno?: Aluno;
  onSave: (aluno: Aluno, appliedAdjustments?: AlunoAdjustment[]) => void;
  onClose: () => void;
}

const baseAluno = (): Aluno => ({
  id: crypto.randomUUID(),
  ano: new Date().getFullYear().toString(),
  codigoEscola: "",
  matricula: "",
  codigoSetps: "",
  nome: "",
  sexo: "M",
  dataNascimento: "",
  nomeMae: "",
  nomePai: "",
  rg: "",
  orgaoExpedidor: "",
  dataEmissaoRg: "",
  cpf: "",
  certidao: "",
  livro: "",
  folha: "",
  endereco: "",
  numero: "",
  complemento: "",
  bairro: "",
  cep: "",
  telefone: "",
  email: "",
  grau: "1",
  serie: "",
  turno: "1",
  flag: "I",
});

export function FormAluno({ aluno, onSave, onClose }: FormAlunoProps) {
  const [formData, setFormData] = useState<Aluno>(baseAluno);
  const [appliedAdjustments, setAppliedAdjustments] = useState<AlunoAdjustment[]>([]);

  useEffect(() => {
    setFormData(aluno ?? baseAluno());
    setAppliedAdjustments([]);
  }, [aluno]);

  const adjustments = getAlunoAdjustments(formData);
  const errors = validateAluno(formData, adjustments);

  const getFieldError = (field: keyof Aluno) => errors.find((error) => error.field === field);

  const getInputClass = (field: keyof Aluno) => {
    const hasError = getFieldError(field);

    return `w-full rounded-xl border px-4 py-2 outline-none transition-all focus:ring-2 focus:ring-blue-500 ${
      hasError
        ? "border-red-500 bg-red-50 text-red-900 placeholder-red-300"
        : "border-slate-200 bg-slate-50 text-slate-900"
    }`;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSave(formData, appliedAdjustments);
  };

  const handleApplyAdjustments = () => {
    setFormData((previous) => applyAlunoAdjustments(previous, adjustments));
    setAppliedAdjustments((previous) => previous.concat(adjustments));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">{aluno ? "Editar Aluno" : "Novo Aluno"}</h2>
          <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-slate-200">
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-3">
              <SectionHeading title="Identificação" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Field label="Ano Vigência *">
                  <input name="ano" value={formData.ano} onChange={handleChange} required placeholder="2026" className={getInputClass("ano")} />
                </Field>
                <Field label="Código SETPS">
                  <input
                    name="codigoSetps"
                    value={formData.codigoSetps}
                    onChange={handleChange}
                    placeholder="1234567890"
                    className={getInputClass("codigoSetps")}
                  />
                </Field>
                <Field label="Nome Completo *" className="md:col-span-2">
                  <input
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="JOÃO DA SILVA"
                    className={getInputClass("nome")}
                  />
                </Field>
                <Field label="Sexo">
                  <select name="sexo" value={formData.sexo} onChange={handleChange} className={getInputClass("sexo")}>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </Field>
                <Field label="Nascimento *">
                  <input
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    placeholder="DD/MM/AAAA"
                    className={getInputClass("dataNascimento")}
                  />
                </Field>
                <Field label="CPF">
                  <input name="cpf" value={formData.cpf} onChange={handleChange} placeholder="12345678901" className={getInputClass("cpf")} />
                </Field>
                <Field label="Matrícula *">
                  <input
                    name="matricula"
                    value={formData.matricula}
                    onChange={handleChange}
                    required
                    placeholder="2023001"
                    className={getInputClass("matricula")}
                  />
                </Field>
              </div>
            </div>

            <div className="md:col-span-3">
              <SectionHeading title="Documentação (RG ou Certidão)" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field label="RG">
                  <input name="rg" value={formData.rg} onChange={handleChange} placeholder="1234567890" className={getInputClass("rg")} />
                </Field>
                <Field label="Órgão Expedidor">
                  <input
                    name="orgaoExpedidor"
                    value={formData.orgaoExpedidor}
                    onChange={handleChange}
                    placeholder="SSP"
                    className={getInputClass("orgaoExpedidor")}
                  />
                </Field>
                <Field label="Emissão RG">
                  <input
                    name="dataEmissaoRg"
                    value={formData.dataEmissaoRg}
                    onChange={handleChange}
                    placeholder="DD/MM/AAAA"
                    className={getInputClass("dataEmissaoRg")}
                  />
                </Field>
                <Field label="Certidão Nasc.">
                  <input
                    name="certidao"
                    value={formData.certidao}
                    onChange={handleChange}
                    placeholder="1234567"
                    className={getInputClass("certidao")}
                  />
                </Field>
                <Field label="Livro">
                  <input name="livro" value={formData.livro} onChange={handleChange} placeholder="001A" className={getInputClass("livro")} />
                </Field>
                <Field label="Folha">
                  <input name="folha" value={formData.folha} onChange={handleChange} placeholder="00234" className={getInputClass("folha")} />
                </Field>
              </div>
            </div>

            <div className="md:col-span-3">
              <SectionHeading title="Dados Escolares" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Field label="Cód. Escola *">
                  <input
                    name="codigoEscola"
                    value={formData.codigoEscola}
                    onChange={handleChange}
                    required
                    placeholder="123"
                    className={getInputClass("codigoEscola")}
                  />
                </Field>
                <Field label="Grau *">
                  <select name="grau" value={formData.grau} onChange={handleChange} className={getInputClass("grau")}>
                    <option value="1">1º Grau (Fundamental)</option>
                    <option value="2">2º Grau (Médio)</option>
                    <option value="3">3º Grau (Superior)</option>
                  </select>
                </Field>
                <Field label="Série *">
                  <input name="serie" value={formData.serie} onChange={handleChange} placeholder="01, 02..." className={getInputClass("serie")} />
                </Field>
                <Field label="Turno *">
                  <select name="turno" value={formData.turno} onChange={handleChange} className={getInputClass("turno")}>
                    <option value="1">1-Matutino</option>
                    <option value="2">2-Vespertino</option>
                    <option value="3">3-Noturno</option>
                    <option value="4">4-Manhã/Tarde/Noite</option>
                    <option value="5">5-Manhã/Tarde</option>
                    <option value="6">6-Manhã/Noite</option>
                    <option value="7">7-Tarde/Noite</option>
                  </select>
                </Field>
              </div>
            </div>

            <div className="md:col-span-3">
              <SectionHeading title="Endereço e Contato" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field label="Logradouro *" className="md:col-span-2">
                  <input
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="RUA DAS FLORES"
                    className={getInputClass("endereco")}
                  />
                </Field>
                <Field label="Número *">
                  <input name="numero" value={formData.numero} onChange={handleChange} placeholder="123" className={getInputClass("numero")} />
                </Field>
                <Field label="Bairro *">
                  <input name="bairro" value={formData.bairro} onChange={handleChange} placeholder="CENTRO" className={getInputClass("bairro")} />
                </Field>
                <Field label="CEP *">
                  <input name="cep" value={formData.cep} onChange={handleChange} required placeholder="40000000" className={getInputClass("cep")} />
                </Field>
                <Field label="Operação (Flag) *">
                  <select name="flag" value={formData.flag} onChange={handleChange} className={getInputClass("flag")}>
                    <option value="I">I - Inclusão</option>
                    <option value="A">A - Alteração</option>
                    <option value="E">E - Exclusão</option>
                  </select>
                </Field>
                <Field label="Telefone">
                  <input
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="71999999999"
                    className={getInputClass("telefone")}
                  />
                </Field>
                <Field label="Email" className="md:col-span-2">
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="aluno@email.com"
                    className={getInputClass("email")}
                  />
                </Field>
              </div>
            </div>

            <div className="md:col-span-3">
              <SectionHeading title="Filiação" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Nome da Mãe *">
                  <input
                    name="nomeMae"
                    value={formData.nomeMae}
                    onChange={handleChange}
                    required
                    placeholder="MARIA DA SILVA"
                    className={getInputClass("nomeMae")}
                  />
                </Field>
                <Field label="Nome do Pai">
                  <input
                    name="nomePai"
                    value={formData.nomePai}
                    onChange={handleChange}
                    placeholder="JOSE DA SILVA"
                    className={getInputClass("nomePai")}
                  />
                </Field>
              </div>
            </div>
          </div>

          {adjustments.length > 0 && (
            <div className="mt-8 flex items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start">
                <Wand2 className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                <div>
                  <p className="mb-1 text-sm font-bold text-emerald-800">Ajustes sugeridos disponíveis</p>
                  <p className="text-xs text-emerald-700">
                    {adjustments.length} campo(s) podem ser padronizados com um clique antes de salvar.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleApplyAdjustments}
                className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Aplicar Ajustes
              </button>
            </div>
          )}

          {errors.length > 0 && (
            <div className="mt-8 flex items-start rounded-xl border border-amber-200 bg-amber-50 p-4">
              <AlertCircle className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <div>
                <p className="mb-1 text-sm font-bold text-amber-800">Atenção: Existem erros de validação</p>
                <ul className="list-inside list-disc text-xs text-amber-700">
                  {errors.map((error, index) => (
                    <li key={`${error.field}-${index}`}>{error.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </form>

        <div className="flex items-center justify-end space-x-4 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-6 py-2 font-bold text-slate-600 transition-all hover:bg-slate-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex items-center rounded-xl bg-blue-600 px-8 py-2 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-blue-300"
          >
            <Save className="mr-2 h-5 w-5" />
            Salvar Registro
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return <h3 className="mb-4 border-b border-blue-100 pb-1 text-sm font-bold uppercase tracking-wider text-blue-600">{title}</h3>;
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-[10px] font-black uppercase text-slate-400">{label}</label>
      {children}
    </div>
  );
}
