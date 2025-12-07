import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';

const StudentHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-sm min-h-[80vh] space-y-10">

      {/* --- Section 1: Create Group --- */}
      <div className="flex flex-col items-center">
        <div className="max-w-md mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Create Group</h2>
          <p className="text-gray-500">
            Please create the Thesis Project Group form by August 15, 2024.
          </p>
        </div>

        <button className="group relative w-64 h-48 bg-white border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
          <div className="mb-4">
            <FiPlus size={48} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>

          <div className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-md shadow-blue-200 group-hover:bg-blue-700 transition-all">
            Create Group
          </div>
        </button>
      </div>


      {/* --- Section 2: ปุ่มไปหน้า Upload File (เพิ่มใหม่) --- */}
      <div className="flex flex-col items-center mt-6">
        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
          Development Mode
        </p>

        <button
          onClick={() => navigate('/student/upload')}
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm rounded-full font-medium shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95"
        >
          <span>Go to Thesis Upload</span>
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
};

export default StudentHome;