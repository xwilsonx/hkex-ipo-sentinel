import * as pdfjsLib from 'pdfjs-dist';
import { ParsedDocument, PDFSection } from '../types';

// Handle ESM/CJS interop: pdfjs-dist via esm.sh might expose the module on .default
// or as named exports on the namespace.
const pdfjs = (pdfjsLib as any).default || pdfjsLib;

// Configure the worker to use the CDN version compatible with esm.sh import
if (pdfjs.GlobalWorkerOptions) {
  pdfjs.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
}

interface TextItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
  hasEOL: boolean;
}

/**
 * Extracts text from a PDF file and structures it into sections based on font size heuristics.
 * This prepares the data for consumption by an LLM.
 */
export const parsePDFStructure = async (file: File): Promise<ParsedDocument> => {
  const arrayBuffer = await file.arrayBuffer();
  
  // Load the PDF document using the resolved pdfjs object
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const doc = await loadingTask.promise;
  
  const sections: PDFSection[] = [];
  let currentSection: PDFSection = { title: "Introduction", content: "", pageNumber: 1 };
  
  // We need to collect font statistics to determine what counts as a "Header"
  const allTextItems: { item: TextItem; page: number }[] = [];
  
  // 1. First Pass: Collect all text items
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const textContent = await page.getTextContent();
    
    // Type assertion because pdfjs types can be tricky in this setup
    const items = textContent.items as unknown as TextItem[];
    
    items.forEach(item => {
      // Filter out empty whitespace items that often clutter PDF extraction
      if (item.str.trim().length > 0) {
        allTextItems.push({ item, page: i });
      }
    });
  }

  // 2. Statistical Analysis for Heuristics
  // Find the "Body Text" size (Mode of heights)
  const heightCounts: Record<number, number> = {};
  allTextItems.forEach(({ item }) => {
    const h = Math.round(item.height); // Round to handle float variances
    heightCounts[h] = (heightCounts[h] || 0) + 1;
  });

  let modeHeight = 0;
  let maxCount = 0;
  Object.entries(heightCounts).forEach(([height, count]) => {
    if (count > maxCount) {
      maxCount = count;
      modeHeight = Number(height);
    }
  });

  // Define Header Threshold: e.g., 20% larger than body text
  const headerThreshold = modeHeight * 1.2;

  // 3. Second Pass: Structure content
  allTextItems.forEach(({ item, page }) => {
    const isHeader = item.height >= headerThreshold;
    
    if (isHeader) {
      // If we have existing content in the current buffer, push it
      if (currentSection.content.length > 0) {
        sections.push({ ...currentSection });
      }
      
      // Start new section
      currentSection = {
        title: item.str,
        content: "",
        pageNumber: page
      };
    } else {
      // Append to current section
      // Add space if needed
      const separator = currentSection.content.length > 0 && !currentSection.content.endsWith(' ') ? ' ' : '';
      currentSection.content += separator + item.str;
    }
  });

  // Push final section
  if (currentSection.content.length > 0 || currentSection.title !== "Introduction") {
    sections.push(currentSection);
  }

  return {
    fileName: file.name,
    pageCount: doc.numPages,
    sections: sections
  };
};