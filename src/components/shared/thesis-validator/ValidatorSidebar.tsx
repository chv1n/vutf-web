// src/components/shared/thesis-validator/ValidatorSidebar.tsx
import React from 'react';
import { ValidatorDocumentMap } from './ValidatorDocumentMap';
import { ValidatorIssueList, Issue } from './ValidatorIssueList';

interface Props {
  numPages: number | null;
  pageNumber: number;
  setPageNumber: (page: number) => void;
  issues: Issue[];  
  currentPageIssues: Issue[];
  onToggleIgnore: (id: number) => void;
}

export const ValidatorSidebar: React.FC<Props> = ({
  numPages,
  pageNumber,
  setPageNumber,
  issues,
  currentPageIssues,
  onToggleIgnore,
}) => {

  const getPageColorClass = (p: number) => {
    const pageIssues = issues.filter((i) => i.page === p);
    if (pageIssues.length === 0) 
        return "bg-white dark:bg-gray-800 text-slate-400 dark:text-gray-500 border-slate-200 dark:border-gray-700 hover:border-slate-400 dark:hover:border-gray-500";

    const active = pageIssues.filter((i) => !i.isIgnored);
    if (active.some((i) => i.severity === "error")) 
        return "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/50";
    if (active.some((i) => i.severity === "warning")) 
        return "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50";

    return "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50";
  };

  const handleTogglePageIgnore = () => {
    const hasActive = currentPageIssues.some((i) => !i.isIgnored);
    currentPageIssues.forEach(issue => {
        if (issue.isIgnored !== hasActive) {
            onToggleIgnore(issue.id);
        }
    });
  };

  return (
    <div className="w-96 bg-white dark:bg-gray-800 border-l border-slate-200 dark:border-gray-700 flex flex-col z-20 shadow-[0_0_20px_rgba(0,0,0,0.03)] h-full transition-colors duration-200">
      <ValidatorDocumentMap
        numPages={numPages}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        getPageColorClass={getPageColorClass}
        issues={issues}
      />
      <ValidatorIssueList
        pageNumber={pageNumber}
        currentPageIssues={currentPageIssues}
        handleTogglePageIgnore={handleTogglePageIgnore}
        toggleIssueStatus={onToggleIgnore}
      />
    </div>
  );
};