import React, { useState, useRef } from 'react';
import { ParsedDocument } from '../types';
import { uploadPDF } from '../services/api';

interface AdminScreenProps {
  onBack: () => void;
}

const AdminScreen: React.FC<AdminScreenProps> = ({ onBack }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setParsedData(null);

    try {
      // Use the API service to upload and process
      const result = await uploadPDF(file);
      setParsedData(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to process the PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIngest = () => {
    // Mock Ingestion Action
    alert(`Successfully ingested ${parsedData?.sections.length} sections into the Knowledge Base.`);
    onBack();
  };

  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string | null>(null);

  const handlePreview = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      if (response.ok) {
        const text = await response.text();
        setPreviewContent(text);
        setPreviewTitle(fileName);
      } else {
        setPreviewContent("Failed to load content preview.");
      }
    } catch (error) {
      console.error("Preview error:", error);
      setPreviewContent("Error loading preview.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col animate-fade-in pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#2d2d2d] flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#2d2d2d]">Admin Portal</h1>
            <p className="text-xs text-[#595959] uppercase tracking-wider">Document Ingestion & Knowledge Base</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="text-sm font-medium text-[#595959] hover:text-[#db0011] transition-colors flex items-center"
        >
          Exit Portal
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-10">


        {!parsedData ? (
          /* Upload State */
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-light text-[#2d2d2d] mb-2">Upload <span className="font-bold">Prospectus</span></h2>
              <p className="text-[#595959]">Ingest PDF filings to update the GenAI knowledge base.</p>
            </div>

            <div
              className={`
                 relative border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer bg-white
                 ${isDragging ? 'border-[#db0011] bg-red-50' : 'border-gray-300 hover:border-gray-400'}
                 ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
               `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="application/pdf"
                onChange={handleFileSelect}
              />

              {isProcessing ? (
                <div className="flex flex-col items-center">
                  <svg className="animate-spin h-10 w-10 text-[#db0011] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="font-medium text-[#2d2d2d]">Processing with Backend...</p>
                  <p className="text-xs text-[#595959] mt-2">Uploading and extracting structure...</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-[#2d2d2d]">Click or Drag PDF here</p>
                  <p className="text-sm text-[#595959] mt-1">Supports standard HKEX Prospectus filings (Max 50MB)</p>
                </>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-[#db0011] text-sm text-red-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}
          </div>
        ) : (
          /* Results State */
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-light text-[#2d2d2d]">Extraction <span className="font-bold">Results</span></h2>
                <p className="text-[#595959] text-sm mt-1">
                  Filename: {parsedData.fileName} • {parsedData.pageCount || '?'} Pages • {parsedData.sections.length} Sections Identified
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setParsedData(null); setPreviewContent(null); }}
                  className="px-6 py-2 border border-gray-300 text-[#595959] text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleIngest}
                  className="px-6 py-2 bg-[#db0011] text-white text-sm font-bold hover:bg-[#b0000e] transition-colors shadow-sm"
                >
                  Ingest to Knowledge Base
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Info Card */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white p-6 border border-gray-200 shadow-sm h-full flex flex-col">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#595959] mb-4">Extracted Sections</h3>
                  <p className="text-sm text-[#2d2d2d] leading-relaxed mb-4">
                    Select a section to preview content or download the raw JSON output.
                  </p>

                  <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[400px]">
                    {parsedData.fileLinks && parsedData.fileLinks.length > 0 ? (
                      <ul className="space-y-2">
                        {parsedData.fileLinks.map((file, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 group transition-colors"
                          >
                            <div className="flex-1 min-w-0 mr-2 cursor-pointer" onClick={() => handlePreview(file.url, file.name)}>
                              <span className="text-sm font-mono text-[#2d2d2d] truncate block hover:text-[#db0011] transition-colors" title={file.name}>
                                {file.name.replace('.json', '').replace(/_/g, ' ')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); handlePreview(file.url, file.name); }}
                                className="p-1.5 text-xs font-medium text-gray-500 hover:text-[#db0011] hover:bg-red-50 rounded transition-colors flex items-center gap-1"
                                title="Preview content"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span className="hidden sm:inline">Preview</span>
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); window.open(file.url, '_blank'); }}
                                className="p-1.5 text-xs font-medium text-[#db0011] border border-[#db0011] hover:bg-[#db0011] hover:text-white rounded transition-colors flex items-center gap-1"
                                title="Download JSON"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>Download</span>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center p-4 text-gray-400 text-sm italic">
                        No sections extracted.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Data Preview */}
              <div className="lg:col-span-2">
                <div className="bg-[#2d2d2d] rounded-t-sm p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs text-gray-400 font-mono">
                      {previewTitle || 'preview.json'}
                    </span>
                  </div>
                </div>
                <div className="bg-[#1e1e1e] p-4 h-[500px] overflow-y-auto custom-scrollbar border-b border-gray-200">
                  {previewContent ? (
                    <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                      {previewContent}
                    </pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>Select a file from the list to preview content</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminScreen;