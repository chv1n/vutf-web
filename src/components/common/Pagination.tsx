import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Props {
  page: number;
  setPage: (page: number) => void; // หรือ (fn: (prev: number) => number) => void
  meta: any;
  limit: number;
}

export const Pagination = ({ page, setPage, meta, limit }: Props) => {
  if (!meta || meta.totalPages === 0) return null;

  return (
    <div className="flex items-center justify-between mt-6 px-2">
      <div className="text-sm text-gray-500">
        แสดง <span className="font-medium">{(page - 1) * limit + 1}</span> ถึง{' '}
        <span className="font-medium">{Math.min(page * limit, meta.totalItems)}</span> จากทั้งหมด{' '}
        <span className="font-medium">{meta.totalItems}</span> รายการ
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 cursor-pointer transition-colors"
        >
          <FiChevronLeft size={20} className="text-gray-600" />
        </button>

        <div className="px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg text-sm">
          หน้า {page} / {meta.totalPages}
        </div>

        <button
          onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
          disabled={page === meta.totalPages}
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 cursor-pointer transition-colors"
        >
          <FiChevronRight size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};