import React, { useState } from 'react';
import { useChoreTemplates } from '../../store/selectors';
import { useAppStore } from '../../store/useAppStore';
import { AddChoreButton } from './AddChoreButton';
import { AddChoreModal } from '../modals/AddChoreModal';

const frequencyLabels: Record<string, string> = {
  none: 'One-time',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

export const ChoreTemplateList: React.FC = () => {
  const choreTemplates = useChoreTemplates();
  const removeChoreTemplate = useAppStore((state) => state.removeChoreTemplate);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Chores
      </h2>
      <AddChoreButton onClick={() => setIsModalOpen(true)} />
      <ul className="space-y-2">
        {choreTemplates.map((template) => (
          <li
            key={template.id}
            className="bg-white dark:bg-gray-700 rounded-md p-2 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 block truncate">
                  {template.title}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {frequencyLabels[template.recurrence.frequency]}
                  {template.recurrence.frequency !== 'none' &&
                    template.recurrence.interval > 1 &&
                    ` (every ${template.recurrence.interval})`}
                </span>
              </div>
              <button
                onClick={() => removeChoreTemplate(template.id)}
                className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                title="Remove chore"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </li>
        ))}
        {choreTemplates.length === 0 && (
          <li className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
            No chores yet
          </li>
        )}
      </ul>
      <AddChoreModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
