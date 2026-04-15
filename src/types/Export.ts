import { Aluno } from "./Aluno";

export type ExportFlag = Aluno["flag"];

export type ExportConfig = {
  exportFlag: ExportFlag;
  institutionCode: string;
  fileName?: string;
};
