import { type PDFDocumentProxy } from "pdfjs-dist";

// Define a local interface for the window object with pdfjsLib
interface WindowWithPdfJs {
  pdfjsLib?: {
    GlobalWorkerOptions: { workerSrc: string };
    getDocument: (url: string) => {
      promise: Promise<PDFDocumentProxy>;
    };
  };
}

/**
 * Loads the PDF.js library from CDN if not already loaded.
 * This matches the implementation in PDFImageViewer to ensure compatibility.
 */
const loadPdfJs = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const win = window as unknown as WindowWithPdfJs;
    if (win.pdfjsLib) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";
    script.type = "module";
    script.async = true;

    // Create a module script that sets up pdfjsLib on window
    const moduleScript = document.createElement("script");
    moduleScript.type = "module";
    moduleScript.textContent = `
      import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
      window.pdfjsLib = pdfjsLib;
      window.dispatchEvent(new Event('pdfjsReady'));
    `;

    const handleReady = () => {
      resolve();
      window.removeEventListener("pdfjsReady", handleReady);
    };

    const handleError = (e: ErrorEvent) => {
      reject(e);
      window.removeEventListener("error", handleError);
    };

    window.addEventListener("pdfjsReady", handleReady);
    window.addEventListener("error", handleError);

    document.head.appendChild(script);
    document.head.appendChild(moduleScript);
  });
};

/**
 * Converts a PDF blob URL to JPG data URLs (one per page).
 */
export const convertPdfToJpg = async (pdfUrl: string, scale = 2.0): Promise<string[]> => {
  await loadPdfJs();
  const win = window as unknown as WindowWithPdfJs;

  if (!win.pdfjsLib) {
    throw new Error("PDF.js library failed to load");
  }

  const pdf = await win.pdfjsLib.getDocument(pdfUrl).promise;
  const numPages = pdf.numPages;
  const imageUrls: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Failed to get canvas context");
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    };

    await page.render(renderContext).promise;
    imageUrls.push(canvas.toDataURL("image/jpeg", 0.95));
  }

  return imageUrls;
};

export const downloadJpgs = async (dataUrls: string[], filename: string) => {
  if (dataUrls.length === 0) return;

  if (dataUrls.length === 1) {
    // Single page - download as JPG
    const link = document.createElement("a");
    link.href = dataUrls[0];
    link.download = filename.endsWith(".jpg") ? filename : `${filename}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // Multiple pages - zip them
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    
    dataUrls.forEach((url, index) => {
      // Remove data:image/jpeg;base64, prefix
      const data = url.split(",")[1];
      zip.file(`${filename}_page_${index + 1}.jpg`, data, { base64: true });
    });

    const content = await zip.generateAsync({ type: "blob" });
    const zipUrl = URL.createObjectURL(content);
    
    const link = document.createElement("a");
    link.href = zipUrl;
    link.download = filename.endsWith(".zip") ? filename : `${filename}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(zipUrl);
  }
};
