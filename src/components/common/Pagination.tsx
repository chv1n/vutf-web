import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface MetaData {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
}

export const Pagination = ({ meta, onPageChange }: { meta: MetaData, onPageChange: (page: number) => void }) => {
    if (!meta) return null;

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700 mt-4 transition-colors">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(meta.page - 1)}
                    disabled={meta.page === 1}
                    className="cursor-pointer relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(meta.page + 1)}
                    disabled={meta.page === meta.lastPage}
                    className="cursor-pointer relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        แสดง <span className="font-medium text-gray-900 dark:text-white">{(meta.page - 1) * meta.limit + 1}</span> ถึง <span className="font-medium text-gray-900 dark:text-white">{Math.min(meta.page * meta.limit, meta.total)}</span> จาก <span className="font-medium text-gray-900 dark:text-white">{meta.total}</span> รายการ
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(meta.page - 1)}
                            disabled={meta.page === 1}
                            className="cursor-pointer relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                            <span className="sr-only">Previous</span>
                            <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {Array.from({ length: meta.lastPage }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                aria-current={meta.page === pageNum ? 'page' : undefined}
                                className={`cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ring-1 ring-inset ring-gray-300 dark:ring-gray-600
                                    ${meta.page === pageNum
                                        ? 'z-10 bg-blue-600 dark:bg-blue-500 text-white focus-visible:outline-blue-600'
                                        : 'text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        ))}

                        <button
                            onClick={() => onPageChange(meta.page + 1)}
                            disabled={meta.page === meta.lastPage}
                            className="cursor-pointer relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                            <span className="sr-only">Next</span>
                            <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};