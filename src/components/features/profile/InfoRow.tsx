// src/components/features/profile/InfoRow.tsx
interface InfoRowProps {
  label: string;
  value: string | null | undefined;
  icon?: React.ReactNode;
}

export const InfoRow = ({ label, value, icon }: InfoRowProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-2 rounded-lg gap-1 sm:gap-0"> 
      <div className="w-full sm:w-1/3 flex items-center gap-2 text-gray-500 font-medium text-sm">
        {icon && <span className="text-blue-500 shrink-0">{icon}</span>}
        {label}
      </div> 
      <div className="w-full sm:w-2/3 text-gray-800 font-medium break-words text-base sm:text-sm pl-6 sm:pl-0">
        {value || <span className="text-gray-400 italic">-</span>}
      </div>
    </div>
  );
};