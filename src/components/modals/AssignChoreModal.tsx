import React from 'react';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { useTeamMembers } from '../../store/selectors';
import type { CalendarEvent } from '../../types';

interface AssignChoreModalProps {
  event: CalendarEvent | null;
  onClose: () => void;
}

export const AssignChoreModal: React.FC<AssignChoreModalProps> = ({ event, onClose }) => {
  const teamMembers = useTeamMembers();
  const assignChore = useAppStore((state) => state.assignChore);
  const toggleChoreStatus = useAppStore((state) => state.toggleChoreStatus);

  if (!event) return null;

  const instance = event.resource;
  const isCompleted = instance.status === 'completed';

  const assigneeOptions = [
    { value: '', label: 'Unassigned' },
    ...teamMembers.map((member) => ({
      value: member.id,
      label: member.name,
    })),
  ];

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    assignChore(instance.id, value || null);
  };

  const handleToggleStatus = () => {
    toggleChoreStatus(instance.id);
  };

  return (
    <Modal isOpen={!!event} onClose={onClose} title={instance.title}>
      <div className="space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Date:</strong> {new Date(instance.date).toLocaleDateString()}
        </div>

        <Select
          label="Assigned to"
          options={assigneeOptions}
          value={instance.assigneeId || ''}
          onChange={handleAssigneeChange}
        />

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
          <Button
            variant={isCompleted ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleToggleStatus}
          >
            {isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
          </Button>
        </div>

        {isCompleted && (
          <div className="text-sm text-green-600 dark:text-green-400 font-medium">
            This chore has been completed!
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
