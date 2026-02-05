import React, { useState, useMemo } from 'react';
import {
  FiBook, FiUsers, FiHash, FiClock, FiFileText, FiDownload,
  FiAlertCircle, FiCheckCircle, FiActivity, FiTag, FiEye, FiX,
  FiLayers,  
  FiDatabase,
  FiFile,     
  FiLoader,   
  FiFilter    
} from 'react-icons/fi';
import { FaFilePdf, FaFileCsv } from 'react-icons/fa6';
import Papa from 'papaparse'; 
import { AdvisedGroupResponse, GroupReport } from '../../../../types/group.types';

// Child Components
import { AdvisedGroupInfoCard } from './AdvisedGroupInfoCard';
import { SubmissionProgressCard } from './SubmissionProgressCard';
import { ProjectReportsCard } from './ProjectReportsCard';

interface AdvisedGroupDetailProps {
  data: AdvisedGroupResponse;
}

// Type for Preview Mode
type PreviewMode = 'PDF' | 'CSV';

export const AdvisedGroupDetail: React.FC<AdvisedGroupDetailProps> = ({ data }) => {
  const { progress, reports = [] } = data;

  // --- State for Modal ---
  const [selectedFile, setSelectedFile] = useState<{ url: string; downloadUrl: string; name: string; type: string } | null>(null);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('PDF'); 
  
  // --- State for CSV Data & Filtering ---
  const [csvData, setCsvData] = useState<{ headers: string[], rows: string[][] } | null>(null);
  const [isLoadingCsv, setIsLoadingCsv] = useState(false);
  
  // Stores available filter options (e.g., list of all Pages found)
  const [csvOptions, setCsvOptions] = useState<{ pages: string[], codes: string[] }>({ pages: [], codes: [] });
  // Stores currently selected filters
  const [csvFilters, setCsvFilters] = useState({ page: 'ALL', code: 'ALL' });

  // --- Handlers ---

  // Handle PDF Preview
  const handlePreviewPdf = (file: { url: string; downloadUrl: string; name: string; type: string }) => {
    setPreviewMode('PDF');
    setCsvData(null);
    setSelectedFile(file);
  };

  // Handle CSV Preview
  const handlePreviewCsv = async (file: { url: string; downloadUrl: string; name: string; type: string }) => {
    setPreviewMode('CSV');
    setSelectedFile(file);
    setIsLoadingCsv(true);
    setCsvData(null);
    setCsvFilters({ page: 'ALL', code: 'ALL' }); // Reset filters when opening new file

    try {
        const response = await fetch(file.url);
        const csvText = await response.text();

        Papa.parse(csvText, {
            complete: (results) => {
                if (results.data && results.data.length > 0) {
                    const [headers, ...rawRows] = results.data as string[][];

                    // 1. Identify Column Indexes (Case-insensitive)
                    const pageIndex = headers.findIndex(h => h.toLowerCase() === 'page');
                    const codeIndex = headers.findIndex(h => h.toLowerCase() === 'code');
                    const msgIndex = headers.findIndex(h => h.toLowerCase() === 'message' || h.toLowerCase() === 'severity');

                    let processedRows = rawRows;

                    // 2. Logic: Deduplication (Filter Duplicate Page+Code+Message)
                    if (pageIndex !== -1 && codeIndex !== -1) {
                        const seen = new Set();
                        processedRows = rawRows.filter(row => {
                            // Skip empty or incomplete rows
                            if (!row[pageIndex] && !row[codeIndex]) return false;

                            // Create Unique Key: "Page|Code|Message"
                            // If 'Message' column exists, include it in key, otherwise just Page|Code
                            const msgVal = msgIndex !== -1 ? row[msgIndex] : '';
                            const uniqueKey = `${row[pageIndex]}|${row[codeIndex]}|${msgVal}`;
                            
                            if (seen.has(uniqueKey)) {
                                return false; // Duplicate -> Skip
                            } else {
                                seen.add(uniqueKey); // New -> Keep
                                return true; 
                            }
                        });
                    }

                    // 3. Prepare Filter Options
                    // Get unique Pages and sort numerically
                    const pages = Array.from(new Set(processedRows.map(r => r[pageIndex]).filter(Boolean)))
                        .sort((a, b) => Number(a) - Number(b)); 
                    
                    // Get unique Codes and sort alphabetically
                    const codes = Array.from(new Set(processedRows.map(r => r[codeIndex]).filter(Boolean)))
                        .sort();

                    setCsvData({ headers, rows: processedRows });
                    setCsvOptions({ pages, codes });
                }
                setIsLoadingCsv(false);
            },
            header: false,
            skipEmptyLines: true
        });
    } catch (error) {
        console.error("Error fetching CSV:", error);
        setIsLoadingCsv(false);
    }
  };

  // Helper to close modal
  const handleCloseModal = () => {
    setSelectedFile(null);
    setCsvData(null);
    setPreviewMode('PDF');
  };

  // Helper for Modal Title Icon
  const getModalIcon = () => {
      if (previewMode === 'CSV') return <FaFileCsv size={24} className="text-green-600" />;
      if (selectedFile?.type.includes('pdf')) return <FaFilePdf size={24} className="text-red-500" />;
      return <FiFile size={24} className="text-gray-500" />;
  };

  // --- Filter Logic (useMemo) ---
  const filteredCsvRows = useMemo(() => {
      if (!csvData) return [];
      
      const pageIndex = csvData.headers.findIndex(h => h.toLowerCase() === 'page');
      const codeIndex = csvData.headers.findIndex(h => h.toLowerCase() === 'code');

      return csvData.rows.filter(row => {
          // Check Page Filter
          const matchPage = csvFilters.page === 'ALL' || (pageIndex !== -1 && row[pageIndex] === csvFilters.page);
          // Check Code Filter
          const matchCode = csvFilters.code === 'ALL' || (codeIndex !== -1 && row[codeIndex] === csvFilters.code);
          
          return matchPage && matchCode;
      });
  }, [csvData, csvFilters]);


  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 1. Group Info */}
      <AdvisedGroupInfoCard data={data} />

      {/* 2. Submission Progress */}
      <SubmissionProgressCard 
        progress={progress} 
        onPreview={handlePreviewPdf} 
      />

      {/* 3. Project Reports (Pass both handlers) */}
      <ProjectReportsCard 
        reports={reports} 
        onPreviewPdf={handlePreviewPdf} 
        onPreviewCsv={handlePreviewCsv} 
      />

      {/* --- Unified Preview Modal --- */}
      {selectedFile && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/95 backdrop-blur-sm p-4 animate-in fade-in">
          
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-t-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 shadow-sm shrink-0">
            
            {/* Left: File Info */}
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                    {getModalIcon()}
                </div>
                <div className="flex flex-col min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
                        {selectedFile.name}
                    </h3>
                    <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">
                        {previewMode === 'CSV' ? 'DATA REPORT PREVIEW' : 'PDF PREVIEW'}
                    </p>
                </div>
            </div>

            {/* Right: Actions & Filters */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                
                {/* --- CSV Filters Dropdown --- */}
                {previewMode === 'CSV' && csvData && (
                    <div className="flex items-center gap-2 mr-2 bg-gray-50 dark:bg-gray-700/50 p-1 rounded-lg border border-gray-100 dark:border-gray-600">
                        <div className="flex items-center gap-1 px-2 text-gray-400">
                            <FiFilter size={14} />
                        </div>
                        
                        {/* Page Filter */}
                        <select 
                            value={csvFilters.page}
                            onChange={(e) => setCsvFilters(prev => ({ ...prev, page: e.target.value }))}
                            className="bg-transparent text-sm text-gray-700 dark:text-gray-200 py-1 pl-1 pr-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 border-none"
                        >
                            <option value="ALL">All Pages</option>
                            {csvOptions.pages.map(p => <option key={p} value={p}>Page {p}</option>)}
                        </select>

                        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>

                        {/* Code Filter */}
                        <select 
                            value={csvFilters.code}
                            onChange={(e) => setCsvFilters(prev => ({ ...prev, code: e.target.value }))}
                            className="bg-transparent text-sm text-gray-700 dark:text-gray-200 py-1 pl-1 pr-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 border-none max-w-[120px] sm:max-w-[150px] truncate"
                        >
                            <option value="ALL">All Codes</option>
                            {csvOptions.codes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                )}

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

                {/* Download Button */}
                <a 
                    href={selectedFile.downloadUrl} 
                    download={selectedFile.name} 
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg transition-colors"
                >
                    <FiDownload size={16} /> <span className="hidden sm:inline">Download</span>
                </a>

                {/* Close Button */}
                <button 
                    onClick={handleCloseModal} 
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 rounded-lg transition-colors"
                >
                    <FiX size={24} />
                </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-b-xl overflow-hidden relative flex flex-col">
            
            {/* --- CASE A: CSV PREVIEW --- */}
            {previewMode === 'CSV' && (
                <>
                    {isLoadingCsv && (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <FiLoader className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
                            <p>Processing Data...</p>
                        </div>
                    )}

                    {!isLoadingCsv && csvData && (
                        <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 w-full h-full scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead className="sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        {csvData.headers.map((head, i) => (
                                            <th key={i} className="bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600 font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-900">
                                    {filteredCsvRows.length > 0 ? (
                                        filteredCsvRows.map((row, i) => (
                                            <tr key={i} className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors">
                                                {row.map((cell, j) => (
                                                    <td key={j} className="px-4 py-2.5 text-gray-600 dark:text-gray-300 whitespace-nowrap max-w-xs truncate" title={cell}>
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={csvData.headers.length} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500">
                                                No data found matching the selected filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!isLoadingCsv && !csvData && (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <FiAlertCircle size={48} className="mb-4 opacity-20" />
                            <p>Unable to load CSV data.</p>
                        </div>
                    )}
                </>
            )}

            {/* --- CASE B: PDF PREVIEW --- */}
            {previewMode === 'PDF' && selectedFile.type.includes('pdf') && (
                <iframe 
                    src={`${selectedFile.url}#toolbar=0`} 
                    className="w-full h-full border-none bg-gray-200 dark:bg-gray-800" 
                    title="File Preview" 
                />
            )}

            {/* --- CASE C: UNSUPPORTED / IMAGE / OTHER --- */}
            {previewMode === 'PDF' && !selectedFile.type.includes('pdf') && (
                 selectedFile.type.startsWith('image/') ? (
                    <div className="w-full h-full flex items-center justify-center p-4 bg-black/50">
                        <img src={selectedFile.url} alt="Preview" className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" />
                    </div>
                 ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <FiFileText size={64} className="mb-6 opacity-20" />
                        <p className="text-lg font-medium mb-2">Preview not available</p>
                        <p className="text-sm mb-6">This file type cannot be previewed directly.</p>
                        <a 
                            href={selectedFile.downloadUrl} 
                            download={selectedFile.name} 
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-lg hover:shadow-indigo-500/30"
                        >
                            Download File
                        </a>
                    </div>
                 )
            )}

          </div>
        </div>
      )}
    </div>
  );
};