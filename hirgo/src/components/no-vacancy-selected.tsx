import { FileQuestion } from 'lucide-react';

export default function NoVacancySelected() {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center p-6">
      <FileQuestion className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-medium text-gray-800 mb-2">No Job Selected</h3>
      <p className="text-gray-500 max-w-md">
        Select a job from the list to view its details.
      </p>
    </div>
  );
} 