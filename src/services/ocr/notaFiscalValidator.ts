import { analyzeTributos, detectNotaFiscalFromText } from "@/services/ocr/ocrService";
import { getPdfText } from "@/services/ocr/pdfText";

export interface NFValidationResult {
  valid: boolean;
  reasons: string[];
  text: string;
  detection: ReturnType<typeof detectNotaFiscalFromText>;
}

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export async function sniffFileType(file: File): Promise<"jpeg" | "png" | "pdf" | "unknown"> {
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("").toLowerCase();
  if (hex.startsWith("ffd8ff")) return "jpeg";
  if (hex.startsWith("89504e470d0a1a0a")) return "png";
  if (hex.startsWith("25504446")) return "pdf";
  return "unknown";
}

function onlyDigits(value: string) {
  return (value || "").replace(/\D/g, "");
}

function parseAmount(raw: string): number | undefined {
  const normalized = raw.replace(/[^0-9,\.]/g, "").replace(/,(?=\d{3}\b)/g, "").replace(/,/g, ".");
  const value = Number.parseFloat(normalized);
  return Number.isNaN(value) ? undefined : value;
}

function findIssueDate(text: string): Date | null {
  const match = text.match(/(\b\d{2}[\/\-]\d{2}[\/\-]\d{4}\b)|(\b\d{4}[\-\/]\d{2}[\-\/]\d{2}\b)/);
  if (!match) return null;
  const parts = match[0].replace(/\D/g, "-").split("-").filter(Boolean);
  const date = parts[0].length === 4
    ? new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    : new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function findTotalValue(text: string): number | null {
  const match = text.match(/(VALOR\s*(?:TOTAL|PAGAMENTO)|TOTAL)\s*[:\-]?\s*(?:R?\$\s*)?([0-9]{1,3}(?:[\.,]\d{3})*(?:[\.,]\d{2})|\d+(?:[\.,]\d{2})?)/i);
  if (!match) return null;
  const value = parseAmount(match[2]);
  return typeof value === "number" && value > 0 ? value : null;
}

export async function extractTextForValidation(file: File): Promise<string> {
  return (await sniffFileType(file)) === "pdf" ? getPdfText(file) : (await analyzeTributos(file)).text;
}

export async function validateNotaFiscalFile(file: File): Promise<NFValidationResult> {
  if (file.size > MAX_SIZE_BYTES) {
    const detection = detectNotaFiscalFromText("");
    return { valid: false, reasons: ["Arquivo excede o limite de 10MB"], text: "", detection };
  }

  if ((await sniffFileType(file)) === "unknown") {
    const detection = detectNotaFiscalFromText("");
    return { valid: false, reasons: ["Tipo de arquivo não suportado"], text: "", detection };
  }

  const text = await extractTextForValidation(file);
  const normalized = text.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const reasons: string[] = [];

  if (!(normalized.includes("NOTA FISCAL") || normalized.includes("NF-E"))) reasons.push("Falta o termo 'Nota Fiscal' ou 'NF-e'");
  if (!onlyDigits(text).match(/\d{44}/)) reasons.push("Falta a chave de acesso de 44 dígitos");
  if (!findIssueDate(text)) reasons.push("Falta a data de emissão");
  if (findTotalValue(text) == null) reasons.push("Falta o valor total");

  return { valid: reasons.length === 0, reasons, text, detection: detectNotaFiscalFromText(text) };
}
