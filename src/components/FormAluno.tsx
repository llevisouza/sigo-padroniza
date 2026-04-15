import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { AlertCircle, Save, Wand2, X } from "lucide-react";
import { Aluno } from "../types/Aluno";
import { AlunoAdjustment, applyAlunoAdjustments, getAlunoAdjustments } from "../utils/adjustments";
import { validateAluno } from "../utils/validator";

interface FormAlunoProps {
  aluno?: Aluno;
  onSave: (aluno: Aluno, appliedAdjustments?: AlunoAdjustment[]) => void;
  onClose: () => void;
}

const sexoOptions = [
  { value: "M", label: "Masculino" },
  { value: "F", label: "Feminino" },
];

const grauOptions = [
  { value: "1", label: "1o Grau (Fundamental)" },
  { value: "2", label: "2o Grau (Medio)" },
  { value: "3", label: "3o Grau (Superior)" },
];

const turnoOptions = [
  { value: "1", label: "1 - Matutino" },
  { value: "2", label: "2 - Vespertino" },
  { value: "3", label: "3 - Noturno" },
  { value: "4", label: "4 - Manha/Tarde/Noite" },
  { value: "5", label: "5 - Manha/Tarde" },
  { value: "6", label: "6 - Manha/Noite" },
  { value: "7", label: "7 - Tarde/Noite" },
];

const flagOptions = [
  { value: "I", label: "I - Inclusao" },
  { value: "A", label: "A - Alteracao" },
  { value: "E", label: "E - Exclusao" },
];

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

  const adjustments = useMemo(() => getAlunoAdjustments(formData), [formData]);
  const errors = useMemo(() => validateAluno(formData, adjustments), [adjustments, formData]);

  const getFieldError = (field: keyof Aluno) => errors.find((error) => error.field === field);

  const getInputClass = (field: keyof Aluno, readOnly = false) => {
    const hasError = Boolean(getFieldError(field));

    return [
      "w-full rounded-xl border px-3.5 py-2.5 text-[13px] text-slate-900 outline-none transition-all duration-150",
      readOnly ? "cursor-not-allowed bg-slate-100 text-slate-500" : "bg-slate-50",
      hasError
        ? "border-rose-300 bg-rose-50/60 text-rose-700 focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
        : "border-slate-200 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100",
    ].join(" ");
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleApplyAdjustments = () => {
    if (adjustments.length === 0) {
      return;
    }

    setFormData((previous) => applyAlunoAdjustments(previous, adjustments));
    setAppliedAdjustments((previous) => previous.concat(adjustments));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(formData, appliedAdjustments);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.18)]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">{aluno ? "Editar Aluno" : "Novo Aluno"}</h2>
            <p className="mt-1 text-[13px] text-slate-500">Revise os dados por secao antes de salvar.</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-7">
            <FormSection title="Identificacao">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Field label="Ano Vigencia *" error={getFieldError("ano")?.message}>
                  <input
                    name="ano"
                    value={formData.ano}
                    onChange={handleChange}
                    required
                    placeholder="2026"
                    className={getInputClass("ano")}
                  />
                </Field>

                <Field label="Codigo SETPS" error={getFieldError("codigoSetps")?.message}>
                  <input
                    name="codigoSetps"
                    value={formData.codigoSetps}
                    onChange={handleChange}
                    placeholder="1234567890"
                    className={getInputClass("codigoSetps")}
                  />
                </Field>

                <Field label="Nome Completo *" className="md:col-span-2" error={getFieldError("nome")?.message}>
                  <input
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="JOAO DA SILVA"
                    className={getInputClass("nome")}
                  />
                </Field>

                <Field label="Sexo" error={getFieldError("sexo")?.message}>
                  <select name="sexo" value={formData.sexo} onChange={handleChange} className={getInputClass("sexo")}>
                    {sexoOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Nascimento *" error={getFieldError("dataNascimento")?.message}>
                  <input
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    placeholder="DD/MM/AAAA"
                    className={getInputClass("dataNascimento")}
                  />
                </Field>

                <Field label="CPF" error={getFieldError("cpf")?.message}>
                  <input
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="12345678901"
                    className={getInputClass("cpf")}
                  />
                </Field>

                <Field label="Matricula *" error={getFieldError("matricula")?.message}>
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
            </FormSection>

            <FormSection title="Documentacao">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field label="RG" error={getFieldError("rg")?.message}>
                  <input name="rg" value={formData.rg} onChange={handleChange} placeholder="1234567890" className={getInputClass("rg")} />
                </Field>

                <Field label="Orgao Expedidor" error={getFieldError("orgaoExpedidor")?.message}>
                  <input
                    name="orgaoExpedidor"
                    value={formData.orgaoExpedidor}
                    onChange={handleChange}
                    placeholder="SSP"
                    className={getInputClass("orgaoExpedidor")}
                  />
                </Field>

                <Field label="Emissao RG" error={getFieldError("dataEmissaoRg")?.message}>
                  <input
                    name="dataEmissaoRg"
                    value={formData.dataEmissaoRg}
                    onChange={handleChange}
                    placeholder="DD/MM/AAAA"
                    className={getInputClass("dataEmissaoRg")}
                  />
                </Field>

                <Field label="Certidao Nasc." error={getFieldError("certidao")?.message}>
                  <input
                    name="certidao"
                    value={formData.certidao}
                    onChange={handleChange}
                    placeholder="1234567"
                    className={getInputClass("certidao")}
                  />
                </Field>

                <Field label="Livro" error={getFieldError("livro")?.message}>
                  <input name="livro" value={formData.livro} onChange={handleChange} placeholder="001A" className={getInputClass("livro")} />
                </Field>

                <Field label="Folha" error={getFieldError("folha")?.message}>
                  <input name="folha" value={formData.folha} onChange={handleChange} placeholder="00234" className={getInputClass("folha")} />
                </Field>
              </div>
            </FormSection>

            <FormSection title="Dados Escolares">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Field label="Cod. Escola *" error={getFieldError("codigoEscola")?.message}>
                  <input
                    name="codigoEscola"
                    value={formData.codigoEscola}
                    onChange={handleChange}
                    required
                    placeholder="123"
                    className={getInputClass("codigoEscola")}
                  />
                </Field>

                <Field label="Grau *" error={getFieldError("grau")?.message}>
                  <select name="grau" value={formData.grau} onChange={handleChange} className={getInputClass("grau")}>
                    {grauOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Serie *" error={getFieldError("serie")?.message}>
                  <input name="serie" value={formData.serie} onChange={handleChange} placeholder="01, 02..." className={getInputClass("serie")} />
                </Field>

                <Field label="Turno *" error={getFieldError("turno")?.message}>
                  <select name="turno" value={formData.turno} onChange={handleChange} className={getInputClass("turno")}>
                    {turnoOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </FormSection>

            <FormSection title="Endereco e Contato">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field label="Logradouro *" className="md:col-span-2" error={getFieldError("endereco")?.message}>
                  <input
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="RUA DAS FLORES"
                    className={getInputClass("endereco")}
                  />
                </Field>

                <Field label="Numero *" error={getFieldError("numero")?.message}>
                  <input name="numero" value={formData.numero} onChange={handleChange} placeholder="123" className={getInputClass("numero")} />
                </Field>

                <Field label="Complemento" error={getFieldError("complemento")?.message}>
                  <input
                    name="complemento"
                    value={formData.complemento}
                    onChange={handleChange}
                    placeholder="APTO 101"
                    className={getInputClass("complemento")}
                  />
                </Field>

                <Field label="Bairro *" error={getFieldError("bairro")?.message}>
                  <input name="bairro" value={formData.bairro} onChange={handleChange} placeholder="CENTRO" className={getInputClass("bairro")} />
                </Field>

                <Field label="CEP *" error={getFieldError("cep")?.message}>
                  <input
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    required
                    placeholder="40000000"
                    className={getInputClass("cep")}
                  />
                </Field>

                <Field label="Operacao (Flag) *" error={getFieldError("flag")?.message}>
                  <select name="flag" value={formData.flag} onChange={handleChange} className={getInputClass("flag")}>
                    {flagOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Telefone" error={getFieldError("telefone")?.message}>
                  <input
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="71999999999"
                    className={getInputClass("telefone")}
                  />
                </Field>

                <Field label="Email" className="md:col-span-2" error={getFieldError("email")?.message}>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="aluno@email.com"
                    className={getInputClass("email")}
                  />
                </Field>
              </div>
            </FormSection>

            <FormSection title="Filiacao">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Nome da Mae *" error={getFieldError("nomeMae")?.message}>
                  <input
                    name="nomeMae"
                    value={formData.nomeMae}
                    onChange={handleChange}
                    required
                    placeholder="MARIA DA SILVA"
                    className={getInputClass("nomeMae")}
                  />
                </Field>

                <Field label="Nome do Pai" error={getFieldError("nomePai")?.message}>
                  <input
                    name="nomePai"
                    value={formData.nomePai}
                    onChange={handleChange}
                    placeholder="JOSE DA SILVA"
                    className={getInputClass("nomePai")}
                  />
                </Field>
              </div>
            </FormSection>

            {adjustments.length > 0 && (
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <Wand2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <div>
                    <p className="text-[13px] font-semibold text-slate-950">Ajustes sugeridos disponiveis</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
                      {adjustments.length} campo(s) podem ser padronizados com um clique antes de salvar.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyAdjustments}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-medium text-slate-700 shadow-sm transition-colors duration-150 hover:bg-slate-100 hover:text-slate-950"
                >
                  <Wand2 className="h-4 w-4" />
                  Aplicar Ajustes
                </button>
              </div>
            )}

            {errors.length > 0 && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                  <div>
                    <p className="text-[13px] font-semibold text-rose-900">Existem erros de validacao neste registro.</p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-[12px] leading-relaxed text-rose-700">
                      {errors.map((error, index) => (
                        <li key={`${error.field}-${index}`}>{error.message}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-[13px] font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-950"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-[13px] font-medium text-white shadow-sm transition-all duration-150 hover:bg-blue-700 hover:shadow-md"
          >
            <Save className="h-4 w-4" />
            Salvar Registro
          </button>
        </div>
      </form>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  className = "",
  error,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  error?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</label>
      {children}
      {error && <p className="mt-1 text-[11px] text-rose-600">{error}</p>}
    </div>
  );
}
