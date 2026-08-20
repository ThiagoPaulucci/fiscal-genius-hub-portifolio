export interface TributosValues {
  icms?: number;
  pis?: number;
  cofins?: number;
}

export interface OCRTributosResult {
  text: string;
  values: TributosValues;
}

function parseNumber(raw: string): number | undefined {
  if (!raw) return undefined;
  const normalized = raw.replace(/[^0-9,\.]/g, "").replace(/,(?=\d{3}\b)/g, "").replace(/,/g, ".");
  const value = Number.parseFloat(normalized);
  return Number.isNaN(value) ? undefined : value;
}

function extractWithRegex(text: string): TributosValues {
  const values: TributosValues = {};
  const patterns: Record<keyof TributosValues, RegExp[]> = {
    icms: [/(ICMS)[^\d%]*([0-9]+[\.,]?[0-9]*)\s*%/i, /(ICMS)[^\d$%]*R?\$?\s*([0-9]+[\.,]?[0-9]*)/i],
    pis: [/(PIS)[^\d%]*([0-9]+[\.,]?[0-9]*)\s*%/i, /(PIS)[^\d$%]*R?\$?\s*([0-9]+[\.,]?[0-9]*)/i],
    cofins: [/(COFINS)[^\d%]*([0-9]+[\.,]?[0-9]*)\s*%/i, /(COFINS)[^\d$%]*R?\$?\s*([0-9]+[\.,]?[0-9]*)/i],
  };

  (Object.keys(patterns) as (keyof TributosValues)[]).forEach((key) => {
    for (const pattern of patterns[key]) {
      const match = text.match(pattern);
      const value = match?.[2] ? parseNumber(match[2]) : undefined;
      if (value !== undefined) {
        values[key] = value;
        break;
      }
    }
  });
  return values;
}

async function tryGoogleVision(base64: string): Promise<string | null> {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase.functions.invoke("vision-ocr", { body: { imageBase64: base64 } });
    if (error || !data?.success) return null;
    return data.text || null;
  } catch {
    return null;
  }
}

async function tesseractExtract(file: File): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("por");
  try {
    const { data } = await worker.recognize(file);
    return data?.text || "";
  } finally {
    await worker.terminate();
  }
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function analyzeTributos(file: File): Promise<OCRTributosResult> {
  const base64 = await toBase64(file);
  const text = (await tryGoogleVision(base64)) || (await tesseractExtract(file));
  return { text, values: extractWithRegex(text) };
}

export interface NotaFiscalDetection {
  isNotaFiscal: boolean;
  type?: "NF-e" | "NFC-e" | "SAT" | "Cupom" | "Desconhecido";
  confidence: number;
  chaveAcesso?: string;
  indicators: string[];
}

export function detectNotaFiscalFromText(text: string): NotaFiscalDetection {
  const normalized = (text || "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const indicators: string[] = [];
  let confidence = 0;
  const digits = (text || "").replace(/\D/g, "");
  const chaveAcesso = digits.match(/(\d{44})/)?.[1];

  if (chaveAcesso) {
    indicators.push("chave_acesso");
    confidence += 0.6;
  }

  const keywords = ["DANFE", "DANFCE", "NF-E", "NFE", "NOTA FISCAL ELETRONICA", "NFC-E", "NFCE", "CF-E", "SAT", "CUPOM FISCAL", "SEFAZ", "CHAVE DE ACESSO", "PROTOCOLO DE AUTORIZACAO", "MODELO 55", "MODELO 65"];
  const hits = keywords.filter((keyword) => normalized.includes(keyword));
  hits.forEach((keyword) => indicators.push(`kw:${keyword}`));
  confidence += Math.min(0.3, hits.length * 0.08);

  let type: NotaFiscalDetection["type"] = "Desconhecido";
  if (normalized.includes("NFC-E") || normalized.includes("NFCE") || normalized.includes("MODELO 65")) type = "NFC-e";
  else if (normalized.includes("NF-E") || normalized.includes("NFE") || normalized.includes("DANFE") || normalized.includes("MODELO 55")) type = "NF-e";
  else if (normalized.includes("SAT") || normalized.includes("CF-E")) type = "SAT";
  else if (normalized.includes("CUPOM FISCAL")) type = "Cupom";

  confidence = Math.max(0, Math.min(1, confidence));
  return { isNotaFiscal: confidence >= 0.5 || Boolean(chaveAcesso) || type !== "Desconhecido", type, confidence, chaveAcesso, indicators };
}
