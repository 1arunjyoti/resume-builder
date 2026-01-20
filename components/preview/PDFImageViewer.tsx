"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Loader2,
} from "lucide-react";

// Declare global pdfjsLib type
declare global {
  interface Window {
    pdfjsLib?: {
      GlobalWorkerOptions: { workerSrc: string };
      getDocument: (url: string) => {
        promise: Promise<{
          numPages: number;
          getPage: (pageNum: number) => Promise<{
            getViewport: (options: { scale: number }) => {
              width: number;
              height: number;
            };
            render: (options: {
              canvasContext: CanvasRenderingContext2D;
              viewport: { width: number; height: number };
            }) => { promise: Promise<void> };
          }>;
        }>;
      };
    };
  }
}

interface PDFImageViewerProps {
  url: string;
}

export function PDFImageViewer({ url }: PDFImageViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageImage, setPageImage] = useState<string | null>(null);
  const [isPdfjsReady, setIsPdfjsReady] = useState(false);

  const pdfDocRef = useRef<unknown>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load pdfjs-dist from CDN via script tag (bypasses webpack issues)
  useEffect(() => {
    if (window.pdfjsLib) {
      setIsPdfjsReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";
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
      setIsPdfjsReady(true);
    };

    window.addEventListener("pdfjsReady", handleReady);
    document.head.appendChild(moduleScript);

    return () => {
      window.removeEventListener("pdfjsReady", handleReady);
    };
  }, []);

  // Load PDF document once pdfjs is ready
  useEffect(() => {
    if (!isPdfjsReady || !window.pdfjsLib) return;

    let isMounted = true;

    const loadPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setPageImage(null); // Clear old image
        setNumPages(0); // Reset pages
        setPageNumber(1); // Reset to page 1

        const pdfjsLib = window.pdfjsLib;
        if (!pdfjsLib) {
          throw new Error("PDF.js library not loaded");
        }

        const pdf = await pdfjsLib.getDocument(url).promise;

        if (!isMounted) return;

        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        // Don't set isLoading to false here - renderPage will do it
      } catch (err) {
        console.error("Failed to load PDF:", err);
        if (isMounted) {
          setError("Failed to load PDF. Please try regenerating.");
          setIsLoading(false);
        }
      }
    };

    loadPDF();

    return () => {
      isMounted = false;
    };
  }, [url, isPdfjsReady]);

  // Render current page to canvas and convert to image
  const renderPage = useCallback(async () => {
    const pdf = pdfDocRef.current as {
      getPage: (pageNum: number) => Promise<{
        getViewport: (options: { scale: number }) => {
          width: number;
          height: number;
        };
        render: (options: {
          canvasContext: CanvasRenderingContext2D;
          viewport: { width: number; height: number };
        }) => { promise: Promise<void> };
      }>;
    } | null;

    if (!pdf || pageNumber < 1 || pageNumber > numPages) return;

    try {
      setIsLoading(true);

      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: scale * 1.5 });

      if (!canvasRef.current) {
        canvasRef.current = document.createElement("canvas");
      }
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Could not get canvas context");
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      const imageUrl = canvas.toDataURL("image/png");
      setPageImage(imageUrl);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to render page:", err);
      setError("Failed to render page.");
      setIsLoading(false);
    }
  }, [pageNumber, numPages, scale]);

  // Re-render when page or scale changes
  useEffect(() => {
    if (numPages > 0) {
      renderPage();
    }
  }, [numPages, pageNumber, scale, renderPage]);

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 2.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  if (error) {
    return <div className="text-center text-destructive py-8">{error}</div>;
  }

  return (
    <div className="flex flex-col">
      {/* PDF Controls - Pagination & Zoom */}
      {numPages > 0 && (
        <div className="flex items-center justify-between p-2 mb-2 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1 || isLoading}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-20 text-center">
              Page {pageNumber} of {numPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages || isLoading}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomOut}
              disabled={scale <= 0.5 || isLoading}
              className="h-8 w-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-12.5 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomIn}
              disabled={scale >= 2.0 || isLoading}
              className="h-8 w-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center min-h-100">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading && pageImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pageImage}
            alt={`Page ${pageNumber}`}
            className="rounded-lg shadow-lg max-w-full h-auto"
            style={{ maxHeight: "80vh" }}
          />
        )}
      </div>
    </div>
  );
}
