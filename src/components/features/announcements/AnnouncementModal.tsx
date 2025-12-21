import { useState, useEffect } from 'react';
import { FiX, FiSave, FiImage, FiUpload } from 'react-icons/fi';
import { Announcement } from '../../../types/announcement';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Announcement>) => Promise<void>;
  initialData?: Announcement | null;
  isLoading: boolean;
}

// Helper: แปลงไฟล์เป็น Base64
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const AnnouncementModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }: Props) => {
  const [formData, setFormData] = useState({ title: '', description: '', imgBase64: '' });

  useEffect(() => {
    if (initialData) {
      setFormData({ 
        title: initialData.title, 
        description: initialData.description,
        imgBase64: initialData.imgBase64 || ''
      });
    } else {
      setFormData({ title: '', description: '', imgBase64: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // เช็คขนาดไฟล์ (เช่น ห้ามเกิน 2MB)
        if (file.size > 2 * 1024 * 1024) {
          alert('File size should not exceed 2MB');
          return;
        }
        const base64 = await convertToBase64(file);
        setFormData({ ...formData, imgBase64: base64 });
      } catch (error) {
        console.error('Error converting file:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in scale-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? 'Edit Announcement' : 'New Announcement'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Enter details..."
            />
          </div>

           {/* Image Input (Upload & Preview) */}
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
            
            <div className="flex items-start gap-4">
              {/* Preview Box */}
              <div className="relative w-32 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                {formData.imgBase64 ? (
                  <>
                    <img 
                      src={formData.imgBase64} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    {/* ปุ่มลบรูป */}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imgBase64: '' })}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                      title="Remove image"
                    >
                      <FiX size={12} />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FiImage size={24} />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="w-6 h-6 text-gray-400 mb-1 group-hover:text-blue-500 transition-colors" />
                    <p className="text-xs text-gray-500">
                      <span className="font-semibold text-blue-600">Click to upload</span>
                    </p>
                    <p className="text-[10px] text-gray-400">PNG, JPG (Max 2MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-50 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-blue-200"
            >
              {isLoading ? 'Saving...' : <><FiSave /> Save</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};