export type NotificationType = "success" | "error" | "info";

export type NotificationState = {
  type: NotificationType;
  message: string;
} | null;

export type TabKey = "arquivo" | "relatorio";

export type FilterMode = "all" | "invalid" | "I" | "A" | "E";

export type SearchField = "all" | "nome" | "matricula" | "cpf" | "rg" | "nomeMae";

export type AppStats = {
  total: number;
  invalid: number;
  valid: number;
  blocking: number;
  adjustableRecords: number;
  adjustableFields: number;
  isAllValid: boolean;
  topErrors: Array<[string, number]>;
};
