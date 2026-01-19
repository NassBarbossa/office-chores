import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import type { ChoreTemplate } from '../../types';

interface AddChoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Frequency = ChoreTemplate['recurrence']['frequency'];

export const AddChoreModal: React.FC<AddChoreModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('none');
  const [interval, setInterval] = useState(1);
  const addChoreTemplate = useAppStore((state) => state.addChoreTemplate);

  const frequencyOptions = [
    { value: 'none', label: 'One-time' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addChoreTemplate({
        title: title.trim(),
        description: description.trim() || undefined,
        recurrence: {
          frequency,
          interval: frequency === 'none' ? 1 : interval,
        },
      });
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFrequency('none');
    setInterval(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Chore">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Clean the kitchen"
          required
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional details..."
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        <Select
          label="Frequency"
          options={frequencyOptions}
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as Frequency)}
        />

        {frequency !== 'none' && (
          <Input
            label="Repeat every (interval)"
            type="number"
            min={1}
            max={30}
            value={interval}
            onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
          />
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!title.trim()}>
            Add Chore
          </Button>
        </div>
      </form>
    </Modal>
  );
};
