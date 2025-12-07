import React, { useRef, useState } from 'react';
import { InspectionRound } from '../../../types/inspection';
import { CloudArrowUpIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

interface Props {
    round: InspectionRound | null;
    loading: boolean;
}

const InspectionActiveCard: React.FC<Props> = ({ round, loading }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('th-TH', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    if (loading) return <div className="animate-pulse h-64 bg-gray-100 rounded-xl"></div>;

    if (!round) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-semibold text-gray-500">No Active Inspection Round</h2>
                <p className="text-gray-400 mt-2">There is no submission round open at this time.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="text-center space-y-4 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                    {round.title}
                </h2>

                <p className="text-gray-600">
                    {round.description || "กรุณาอัปโหลดไฟล์เล่มวิทยานิพนธ์เพื่อรับการตรวจสอบ"} <br />
                    <span className="block mt-2 text-red-600">
                        ระหว่างวันที่ {formatDate(round.startDate)} ถึง {formatDate(round.endDate)}
                    </span>
                </p>
            </div>

            {/* Upload Area */}
            <div
                className="max-w-2xl mx-auto border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-indigo-300 transition-all group"
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept=".pdf"
                    onChange={handleFileChange}
                />

                {selectedFile ? (
                    <div className="flex flex-col items-center text-indigo-600">
                        <DocumentCheckIcon className="w-12 h-12 mb-2" />
                        <span className="font-medium">{selectedFile.name}</span>
                        <span className="text-xs text-gray-400 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                ) : (
                    <>
                        <div className="bg-gray-50 p-4 rounded-full mb-3 group-hover:bg-white group-hover:shadow-md transition-all">
                            <CloudArrowUpIcon className="w-8 h-8 text-gray-400 group-hover:text-indigo-500" />
                        </div>
                        <span className="text-gray-600 font-medium group-hover:text-indigo-600">Upload (PDF)</span>
                        <span className="text-xs text-gray-400 mt-2">Max file size 10MB</span>
                    </>
                )}
            </div>

            <div className="mt-8 text-center">
                <button
                    disabled={!selectedFile}
                    className={`px-12 py-3 rounded-full text-white font-semibold shadow-lg transition-all transform hover:-translate-y-0.5
            ${selectedFile
                            ? 'bg-[#5542F6] hover:bg-indigo-700 shadow-indigo-200'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default InspectionActiveCard;