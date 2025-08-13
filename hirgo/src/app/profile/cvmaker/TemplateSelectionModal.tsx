"use client";

import React from 'react';
import { X } from 'lucide-react';

interface TemplateSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (uiType: 'ui1' | 'ui2' | 'ui3') => void;
}

const templates = [
    {
        id: 'ui1',
        name: 'Dark Sidebar',
        previewImage: '/cv/ui-1.png'
    },
    {
        id: 'ui2',
        name: 'Budapest',
        previewImage: '/cv/ui-2.jpg'
    },
    {
        id: 'ui3',
        name: 'Perth',
        previewImage: '/cv/ui-3.jpg'
    },
    {
        id: 'ui4',
        name: 'Perth',
        previewImage: '/cv/ui-4.jpg'
    },
    {
        id: 'ui5',
        name: 'Perth',
        previewImage: '/cv/ui-5.jpg'
    }
];

const TemplateSelectionModal: React.FC<TemplateSelectionModalProps> = ({ isOpen, onClose, onSelect }) => {
    // isOpen false ise hiçbir şey render etme
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
            onClick={onClose} // Dışarıya tıklayınca kapat (prop'tan gelen fonksiyonu çağır)
        >
            <div
                className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-3xl shadow-2xl"
                onClick={(e) => e.stopPropagation()} // İçeriye tıklayınca kapanmasını engelle
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Choose a Template</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="cursor-pointer group"
                            onClick={() => onSelect(template.id as 'ui1' | 'ui2' | 'ui3')}
                        >
                            <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden group-hover:border-blue-500 group-hover:scale-105 transition-all duration-300 shadow-md">
                                <img src={template.previewImage} alt={template.name} className="w-full h-auto object-cover" />
                            </div>
                            <p className="text-center mt-3 text-sm font-semibold text-gray-600 dark:text-gray-300">{template.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TemplateSelectionModal;
