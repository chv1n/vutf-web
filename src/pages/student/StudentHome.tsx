import { FiPlus } from 'react-icons/fi';

export const StudentHome = () => {
  return (
    <div className="w-full h-full bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-sm min-h-[600px]">
      
      <div className="max-w-md mb-12">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Create Group</h2>
        <p className="text-gray-500">
            Please create the Thesis Project Group form by August 15, 2024.
        </p>
      </div>

      {/* Card ปุ่มกดขนาดใหญ่ */}
      <button className="group relative w-64 h-48 bg-white border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center hover:border-blue-500 hover:shadow-lg transition-all duration-300">
        <div className="mb-4">
             <FiPlus size={48} className="text-gray-800 group-hover:text-blue-600 transition-colors" />
        </div>
        
        {/* ปุ่มสีม่วงข้างใน */}
        <div className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-md shadow-blue-200 group-hover:bg-blue-700 transition-colors">
            Create Group
        </div>
      </button>

    </div>
  );
};