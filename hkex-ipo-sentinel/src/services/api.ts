import { ParsedDocument, PDFSection } from '../types';

const API_Base_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

interface BackendTOCEntry {
    level: number;
    title: number;
    page: number;
    section_path: string;
}

interface BackendFileEntry {
    name: string;
    url: string;
}

interface BackendTOCResponse {
    document_id: string;
    toc: BackendTOCEntry[];
    files: BackendFileEntry[];
    metadata: any;
}

export const uploadPDF = async (file: File): Promise<ParsedDocument> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_Base_URL}/api/v1/upload-pdf`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        let errorMessage = `Failed to upload PDF: ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (errorData.detail) {
                errorMessage = errorData.detail;
            }
        } catch (e) {
            // If parsing JSON fails, fall back to text
            const errorText = await response.text();
            if (errorText) errorMessage += ` - ${errorText}`;
        }
        throw new Error(errorMessage);
    }

    const data: BackendTOCResponse = await response.json();

    // Map backend response to frontend ParsedDocument structure
    const sections: PDFSection[] = data.toc.map((entry) => ({
        title: String(entry.title),
        pageNumber: entry.page,
        section_path: entry.section_path,
        // Content is not returned in TOC, so we leave it undefined or fetch later if needed
    }));

    return {
        fileName: file.name,
        pageCount: data.metadata?.page_count || 0,
        sections,
        fileLinks: data.files.map(f => ({
            name: f.name,
            url: `${API_Base_URL}${f.url}`
        }))
    };
};
