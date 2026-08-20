import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
// @ts-ignore - Vite resolves this URL at build time
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfjsWorker as unknown as string;

export async function getPdfText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: buffer }).promise;
  const pageTexts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items
      .map((item: any) => (typeof item.str === "string" ? item.str : ""))
      .filter(Boolean);
    pageTexts.push(strings.join(" "));
  }

  return pageTexts.join("\n");
}
